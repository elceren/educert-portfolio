const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const { verifyToken, isAdmin, isInstructor, isStudent } = require('../middleware/auth.middleware');

// Public routes
router.get('/verify', certificationController.verifyCertification);

// Routes requiring authentication
router.use(verifyToken);

// Routes accessible by all authenticated users
router.get('/', certificationController.getAllCertifications);
router.get('/:id', certificationController.getCertificationById);

// Student routes
router.get('/student/my', isStudent, certificationController.getStudentCertifications);

// Admin and instructor routes
router.post('/', isAdmin, certificationController.createCertification);
router.put('/:id', isAdmin, certificationController.updateCertification);
router.delete('/:id', isAdmin, certificationController.deleteCertification);
router.post('/:id/courses', isInstructor, certificationController.associateCertificationWithCourse);
router.delete('/:id/courses/:courseId', isInstructor, certificationController.removeCertificationFromCourse);
router.post('/:id/issue', isInstructor, certificationController.issueCertificationToStudent);
router.get('/student/:studentId', isInstructor, certificationController.getStudentCertifications);

module.exports = router;
