import api from '../utils/api';

// Course services
const courseService = {
  getAllCourses: async (filters = {}) => {
    const { title, difficulty, language, instructorId } = filters;
    let url = '/courses';
    
    // Add query parameters if filters are provided
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (difficulty) params.append('difficulty', difficulty);
    if (language) params.append('language', language);
    if (instructorId) params.append('instructorId', instructorId);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return api.get(url);
  },
  
  getCourseById: async (courseId) => {
    return api.get(`/courses/${courseId}`);
  },
  
  createCourse: async (courseData) => {
    return api.post('/courses', courseData);
  },
  
  updateCourse: async (courseId, courseData) => {
    return api.put(`/courses/${courseId}`, courseData);
  },
  
  deleteCourse: async (courseId) => {
    return api.delete(`/courses/${courseId}`);
  },
  
  searchCourses: async (query) => {
    return api.get(`/courses/search?query=${query}`);
  }
};

export default courseService;
