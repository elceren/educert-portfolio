import api from '../utils/api';

// Certification services
const certificationService = {
  getAllCertifications: async () => {
    return api.get('/certifications');
  },
  
  getCertificationById: async (certificationId) => {
    return api.get(`/certifications/${certificationId}`);
  },
  
  createCertification: async (certificationData) => {
    return api.post('/certifications', certificationData);
  },
  
  updateCertification: async (certificationId, certificationData) => {
    return api.put(`/certifications/${certificationId}`, certificationData);
  },
  
  deleteCertification: async (certificationId) => {
    return api.delete(`/certifications/${certificationId}`);
  },
  
  associateCertificationWithCourse: async (certificationId, courseId) => {
    return api.post(`/certifications/${certificationId}/courses`, { courseId });
  },
  
  removeCertificationFromCourse: async (certificationId, courseId) => {
    return api.delete(`/certifications/${certificationId}/courses/${courseId}`);
  },
  
  issueCertificationToStudent: async (certificationId, studentId) => {
    return api.post(`/certifications/${certificationId}/issue`, { studentId });
  },
  
  getStudentCertifications: async () => {
    return api.get('/certifications/student/my');
  },
  
  getStudentCertificationsById: async (studentId) => {
    return api.get(`/certifications/student/${studentId}`);
  },
  
  verifyCertification: async (certificationId, studentId) => {
    return api.get(`/certifications/verify?certificationId=${certificationId}&studentId=${studentId}`);
  }
};

export default certificationService;
