import api from '../utils/api';

// Exam services
const examService = {
  getCourseExams: async (courseId) => {
    return api.get(`/exams/course/${courseId}`);
  },
  
  getExamById: async (examId) => {
    return api.get(`/exams/${examId}`);
  },
  
  createExam: async (examData) => {
    return api.post('/exams', examData);
  },
  
  updateExam: async (examId, examData) => {
    return api.put(`/exams/${examId}`, examData);
  },
  
  deleteExam: async (examId) => {
    return api.delete(`/exams/${examId}`);
  },
  
  addQuestionToExam: async (examId, questionId, orderNumber) => {
    return api.post(`/exams/${examId}/questions`, { questionId, orderNumber });
  },
  
  removeQuestionFromExam: async (examId, questionId) => {
    return api.delete(`/exams/${examId}/questions/${questionId}`);
  },
  
  getExamQuestions: async (examId) => {
    return api.get(`/exams/${examId}/questions`);
  },
  
  startExamAttempt: async (examId) => {
    return api.post(`/exams/${examId}/attempt`);
  },
  
  submitExamAttempt: async (attemptId, answers, timeSpent) => {
    return api.put(`/exams/attempt/${attemptId}/submit`, { answers, timeSpent });
  },
  
  getStudentExamAttempts: async (examId) => {
    return api.get(`/exams/${examId}/attempts/student`);
  },
  
  getExamAttempts: async (examId) => {
    return api.get(`/exams/${examId}/attempts`);
  }
};

export default examService;
