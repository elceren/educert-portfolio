import api from '../utils/api';

// Assignment services
const assignmentService = {
  getLectureAssignments: async (lectureId) => {
    return api.get(`/assignments/lecture/${lectureId}`);
  },
  
  getAssignmentById: async (assignmentId) => {
    return api.get(`/assignments/${assignmentId}`);
  },
  
  createAssignment: async (assignmentData) => {
    return api.post('/assignments', assignmentData);
  },
  
  updateAssignment: async (assignmentId, assignmentData) => {
    return api.put(`/assignments/${assignmentId}`, assignmentData);
  },
  
  deleteAssignment: async (assignmentId) => {
    return api.delete(`/assignments/${assignmentId}`);
  },
  
  submitAssignment: async (assignmentId, submissionContent) => {
    return api.post(`/assignments/${assignmentId}/submit`, { submissionContent });
  },
  
  getStudentSubmission: async (assignmentId) => {
    return api.get(`/assignments/${assignmentId}/submission`);
  },
  
  getAssignmentSubmissions: async (assignmentId) => {
    return api.get(`/assignments/${assignmentId}/submissions`);
  },
  
  gradeSubmission: async (submissionId, grade, feedbackText) => {
    return api.put(`/assignments/submissions/${submissionId}/grade`, { grade, feedbackText });
  }
};

export default assignmentService;
