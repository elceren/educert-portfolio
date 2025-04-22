import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import StudentDashboard from '../../pages/student/Dashboard';
import InstructorDashboard from '../../pages/instructor/Dashboard';
import AdminDashboard from '../../pages/admin/Dashboard';
import enrollmentService from '../../services/enrollmentService';
import courseService from '../../services/courseService';
import assignmentService from '../../services/assignmentService';
import examService from '../../services/examService';
import certificationService from '../../services/certificationService';
import reportService from '../../services/reportService';

// Mock the services
jest.mock('../../services/enrollmentService');
jest.mock('../../services/courseService');
jest.mock('../../services/assignmentService');
jest.mock('../../services/examService');
jest.mock('../../services/certificationService');
jest.mock('../../services/reportService');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Helper function to render components with providers
const renderWithProviders = (component, authUser = null) => {
  // Mock authenticated user if provided
  if (authUser) {
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      user: authUser,
      isLoading: false
    }));
  }
  
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

describe('Dashboard Components', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('StudentDashboard Component', () => {
    const mockEnrollments = {
      enrollments: [
        {
          CourseID: 1,
          Progress: 25,
          Course: {
            Title: 'Introduction to Programming'
          }
        },
        {
          CourseID: 2,
          Progress: 50,
          Course: {
            Title: 'Advanced Web Development'
          }
        }
      ]
    };
    
    const mockAssignments = {
      assignments: [
        {
          AssignmentID: 1,
          Title: 'Programming Exercise 1',
          DueDate: '2025-05-01'
        },
        {
          AssignmentID: 2,
          Title: 'Web Development Project',
          DueDate: '2025-05-15'
        }
      ]
    };
    
    const mockExams = {
      exams: [
        {
          ExamID: 1,
          Title: 'Programming Fundamentals Exam',
          Course: {
            Title: 'Introduction to Programming'
          }
        }
      ]
    };
    
    const mockCertifications = {
      certifications: [
        {
          CertificationID: 1,
          Title: 'Programming Fundamentals Certificate',
          IssueDate: '2025-04-01'
        }
      ]
    };

    test('renders student dashboard correctly', async () => {
      // Mock service responses
      enrollmentService.getStudentEnrollments.mockResolvedValue(mockEnrollments);
      assignmentService.getLectureAssignments.mockResolvedValue(mockAssignments);
      examService.getCourseExams.mockResolvedValue(mockExams);
      certificationService.getStudentCertifications.mockResolvedValue(mockCertifications);
      
      // Mock student user
      const mockStudent = {
        id: 1,
        name: 'Student User',
        userType: 'Student'
      };
      
      renderWithProviders(<StudentDashboard />, mockStudent);
      
      // Check for loading state
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for dashboard data to load
      await waitFor(() => {
        expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
      });
      
      // Check if enrollments are displayed
      expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      expect(screen.getByText('Advanced Web Development')).toBeInTheDocument();
      
      // Check if assignments are displayed
      expect(screen.getByText('Programming Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Web Development Project')).toBeInTheDocument();
      
      // Check if exams are displayed
      expect(screen.getByText('Programming Fundamentals Exam')).toBeInTheDocument();
      
      // Check if certifications are displayed
      expect(screen.getByText('Programming Fundamentals Certificate')).toBeInTheDocument();
      
      // Check if dashboard statistics are displayed
      expect(screen.getByText('2')).toBeInTheDocument(); // Enrolled Courses
      expect(screen.getByText('2')).toBeInTheDocument(); // Pending Assignments
      expect(screen.getByText('1')).toBeInTheDocument(); // Upcoming Exams
      expect(screen.getByText('1')).toBeInTheDocument(); // Certifications
    });
  });

  describe('InstructorDashboard Component', () => {
    const mockCourses = {
      courses: [
        {
          CourseID: 1,
          Title: 'Introduction to Programming',
          enrollmentCount: 25
        },
        {
          CourseID: 2,
          Title: 'Advanced Web Development',
          enrollmentCount: 15
        }
      ]
    };
    
    const mockEnrollments = {
      enrollments: [
        {
          StudentID: 1,
          CourseID: 1,
          Progress: 25,
          Student: {
            User: {
              Name: 'Student One'
            }
          },
          Course: {
            Title: 'Introduction to Programming'
          }
        },
        {
          StudentID: 2,
          CourseID: 1,
          Progress: 50,
          Student: {
            User: {
              Name: 'Student Two'
            }
          },
          Course: {
            Title: 'Introduction to Programming'
          }
        }
      ]
    };
    
    const mockAssignments = {
      assignments: [
        {
          AssignmentID: 1,
          Title: 'Programming Exercise 1',
          Course: {
            Title: 'Introduction to Programming'
          }
        },
        {
          AssignmentID: 2,
          Title: 'Web Development Project',
          Course: {
            Title: 'Advanced Web Development'
          }
        }
      ]
    };

    test('renders instructor dashboard correctly', async () => {
      // Mock service responses
      courseService.getAllCourses.mockResolvedValue(mockCourses);
      enrollmentService.getCourseEnrollments.mockResolvedValue(mockEnrollments);
      assignmentService.getLectureAssignments.mockResolvedValue(mockAssignments);
      
      // Mock instructor user
      const mockInstructor = {
        id: 1,
        name: 'Instructor User',
        userType: 'Instructor'
      };
      
      renderWithProviders(<InstructorDashboard />, mockInstructor);
      
      // Check for loading state
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for dashboard data to load
      await waitFor(() => {
        expect(screen.getByText('Instructor Dashboard')).toBeInTheDocument();
      });
      
      // Check if courses are displayed
      expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      expect(screen.getByText('Advanced Web Development')).toBeInTheDocument();
      
      // Check if dashboard statistics are displayed
      expect(screen.getByText('2')).toBeInTheDocument(); // Your Courses
      expect(screen.getByText('2')).toBeInTheDocument(); // Enrolled Students
      expect(screen.getByText('2')).toBeInTheDocument(); // Pending Assignments
    });
  });

  describe('AdminDashboard Component', () => {
    const mockCourses = {
      courses: [
        {
          CourseID: 1,
          Title: 'Introduction to Programming',
          DifficultyLevel: 'Beginner',
          Language: 'English'
        },
        {
          CourseID: 2,
          Title: 'Advanced Web Development',
          DifficultyLevel: 'Advanced',
          Language: 'English'
        }
      ]
    };
    
    const mockReports = {
      reports: [
        {
          ReportID: 1,
          Title: 'Course Popularity Report',
          GeneratedDate: '2025-04-01'
        },
        {
          ReportID: 2,
          Title: 'Course Rating Report',
          GeneratedDate: '2025-04-01'
        }
      ]
    };
    
    const mockPopularityReport = {
      data: [
        {
          CourseID: 1,
          Course: {
            Title: 'Introduction to Programming',
            DifficultyLevel: 'Beginner',
            Language: 'English'
          },
          enrollmentCount: 25
        },
        {
          CourseID: 2,
          Course: {
            Title: 'Advanced Web Development',
            DifficultyLevel: 'Advanced',
            Language: 'English'
          },
          enrollmentCount: 15
        }
      ]
    };
    
    const mockRatingReport = {
      data: [
        {
          CourseID: 1,
          Course: {
            Title: 'Introduction to Programming',
            DifficultyLevel: 'Beginner',
            Language: 'English'
          },
          reviewCount: 10,
          averageRating: 4.5
        },
        {
          CourseID: 2,
          Course: {
            Title: 'Advanced Web Development',
            DifficultyLevel: 'Advanced',
            Language: 'English'
          },
          reviewCount: 15,
          averageRating: 4.8
        }
      ]
    };

    test('renders admin dashboard correctly', async () => {
      // Mock service responses
      courseService.getAllCourses.mockResolvedValue(mockCourses);
      reportService.getAllReports.mockResolvedValue(mockReports);
      reportService.generateCoursePopularityReport.mockResolvedValue(mockPopularityReport);
      reportService.generateCourseRatingReport.mockResolvedValue(mockRatingReport);
      
      // Mock admin user
      const mockAdmin = {
        id: 1,
        name: 'Admin User',
        userType: 'Administrator'
      };
      
      renderWithProviders(<AdminDashboard />, mockAdmin);
      
      // Check for loading state
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for dashboard data to load
      await waitFor(() => {
        expect(screen.getByText('Administrator Dashboard')).toBeInTheDocument();
      });
      
      // Check if courses are displayed in the popularity report
      expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
      expect(screen.getByText('Advanced Web Development')).toBeInTheDocument();
      
      // Check if dashboard statistics are displayed
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Courses
      expect(screen.getByText('2')).toBeInTheDocument(); // Reports
    });
  });
});
