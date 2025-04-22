import api from '../utils/api';

// Enrollment services
const enrollmentService = {
  getStudentEnrollments: async () => {
    return api.get('/enrollments/student');
  },
  
  enrollInCourse: async (courseId) => {
    return api.post('/enrollments/enroll', { courseId });
  },
  
  updateProgress: async (courseId, progress) => {
    return api.put(`/enrollments/${courseId}/progress`, { progress });
  },
  
  unenrollFromCourse: async (courseId) => {
    return api.delete(`/enrollments/${courseId}`);
  },
  
  getCourseProgress: async (courseId) => {
    return api.get(`/enrollments/${courseId}/progress`);
  },
  
  getCourseEnrollments: async (courseId) => {
    return api.get(`/enrollments/course/${courseId}`);
  }
};

export default enrollmentService;
