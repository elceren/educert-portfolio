import api from '../utils/api';

// Report services
const reportService = {
  getAllReports: async () => {
    return api.get('/reports');
  },
  
  getReportById: async (reportId) => {
    return api.get(`/reports/${reportId}`);
  },
  
  generateCoursePopularityReport: async (startDate, endDate, format = 'JSON') => {
    return api.post('/reports/course-popularity', { startDate, endDate, format });
  },
  
  generateCourseRatingReport: async (format = 'JSON') => {
    return api.post('/reports/course-rating', { format });
  },
  
  generateStudentProgressReport: async (courseId, format = 'JSON') => {
    return api.post('/reports/student-progress', { courseId, format });
  },
  
  deleteReport: async (reportId) => {
    return api.delete(`/reports/${reportId}`);
  }
};

export default reportService;
