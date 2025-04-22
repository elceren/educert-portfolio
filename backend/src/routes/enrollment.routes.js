const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, isStudent, isInstructor } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Student enrollment routes
router.get('/student', isStudent, enrollmentController.getStudentEnrollments);
router.post('/enroll', isStudent, enrollmentController.enrollInCourse);
router.put('/:courseId/progress', isStudent, enrollmentController.updateEnrollmentProgress);
router.delete('/:courseId', isStudent, enrollmentController.unenrollFromCourse);
router.get('/:courseId/progress', isStudent, enrollmentController.getCourseProgress);

// Instructor routes
router.get('/course/:courseId', isInstructor, enrollmentController.getCourseEnrollments);

module.exports = router;
