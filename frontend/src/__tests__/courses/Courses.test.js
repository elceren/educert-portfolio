import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import CourseList from '../../pages/courses/CourseList';
import CourseDetails from '../../pages/courses/CourseDetails';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';

// Mock the services
jest.mock('../../services/courseService');
jest.mock('../../services/enrollmentService');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1' })
}));

// Helper function to render components with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          {component}
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

describe('Course Components', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('CourseList Component', () => {
    const mockCourses = {
      courses: [
        {
          CourseID: 1,
          Title: 'Introduction to Programming',
          Description: 'Learn the basics of programming',
          DifficultyLevel: 'Beginner',
          Duration: 120,
          Language: 'English',
          Price: 49.99,
          CertificationOption: true,
          InstructorID: 1,
          Instructor: {
            User: {
              Name: 'John Doe'
            }
          },
          averageRating: 4.5,
          reviewCount: 10
        },
        {
          CourseID: 2,
          Title: 'Advanced Web Development',
          Description: 'Master web development techniques',
          DifficultyLevel: 'Advanced',
          Duration: 240,
          Language: 'English',
          Price: 99.99,
          CertificationOption: true,
          InstructorID: 2,
          Instructor: {
            User: {
              Name: 'Jane Smith'
            }
          },
          averageRating: 4.8,
          reviewCount: 15
        }
      ]
    };

    test('renders course list correctly', async () => {
      // Mock successful course fetch
      courseService.getAllCourses.mockResolvedValue(mockCourses);
      
      renderWithProviders(<CourseList />);
      
      // Check for loading state
      expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for courses to load
      await waitFor(() => {
        expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
        expect(screen.getByText('Advanced Web Development')).toBeInTheDocument();
      });
      
      // Check if course details are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getAllByText(/Beginner|Advanced/i)).toHaveLength(2);
    });

    test('handles filter changes', async () => {
      // Mock successful course fetch
      courseService.getAllCourses.mockResolvedValue(mockCourses);
      
      renderWithProviders(<CourseList />);
      
      // Wait for courses to load
      await waitFor(() => {
        expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      });
      
      // Find and interact with filter controls
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'Web Development' } });
      
      // Check if getAllCourses was called with search parameter
      await waitFor(() => {
        expect(courseService.getAllCourses).toHaveBeenCalledWith(
          expect.objectContaining({ 
            search: 'Web Development' 
          })
        );
      });
    });
  });

  describe('CourseDetails Component', () => {
    const mockCourse = {
      course: {
        CourseID: 1,
        Title: 'Introduction to Programming',
        Description: 'Learn the basics of programming',
        DifficultyLevel: 'Beginner',
        Duration: 120,
        Language: 'English',
        Price: 49.99,
        CertificationOption: true,
        InstructorID: 1,
        Instructor: {
          User: {
            Name: 'John Doe'
          },
          Description: 'Experienced instructor with 10+ years of teaching'
        },
        averageRating: 4.5,
        reviewCount: 10,
        Modules: [
          {
            ModuleID: 1,
            Title: 'Getting Started',
            Description: 'Introduction to programming concepts',
            Lectures: [
              {
                LectureID: 1,
                Title: 'What is Programming?',
                Duration: 15
              },
              {
                LectureID: 2,
                Title: 'Setting Up Your Environment',
                Duration: 20
              }
            ]
          }
        ],
        Reviews: [
          {
            ReviewID: 1,
            Rating: 5,
            Comment: 'Great course!',
            Date: '2025-01-15',
            Student: {
              User: {
                Name: 'Student One'
              }
            }
          }
        ]
      }
    };

    test('renders course details correctly', async () => {
      // Mock successful course fetch
      courseService.getCourseById.mockResolvedValue(mockCourse);
      enrollmentService.getStudentEnrollments.mockResolvedValue({ enrollments: [] });
      
      renderWithProviders(<CourseDetails />);
      
      // Check for loading state
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for course details to load
      await waitFor(() => {
        expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      });
      
      // Check if course details are displayed
      expect(screen.getByText('Learn the basics of programming')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('120 minutes')).toBeInTheDocument();
      
      // Check if modules are displayed
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('What is Programming?')).toBeInTheDocument();
      expect(screen.getByText('Setting Up Your Environment')).toBeInTheDocument();
      
      // Check if reviews are displayed
      expect(screen.getByText('Great course!')).toBeInTheDocument();
      expect(screen.getByText('Student One')).toBeInTheDocument();
    });

    test('handles enrollment', async () => {
      // Mock successful course fetch and enrollment
      courseService.getCourseById.mockResolvedValue(mockCourse);
      enrollmentService.getStudentEnrollments.mockResolvedValue({ enrollments: [] });
      enrollmentService.enrollInCourse.mockResolvedValue({ success: true });
      
      // Mock authenticated user
      const mockUseAuth = {
        isAuthenticated: true,
        user: { userType: 'Student' }
      };
      
      jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => mockUseAuth);
      
      renderWithProviders(<CourseDetails />);
      
      // Wait for course details to load
      await waitFor(() => {
        expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      });
      
      // Find and click the enroll button
      const enrollButton = screen.getByRole('button', { name: /enroll now/i });
      fireEvent.click(enrollButton);
      
      // Check if enrollInCourse was called with the correct course ID
      await waitFor(() => {
        expect(enrollmentService.enrollInCourse).toHaveBeenCalledWith('1');
      });
    });
  });
});
