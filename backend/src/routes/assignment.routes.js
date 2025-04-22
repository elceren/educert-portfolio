const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { verifyToken, isStudent, isInstructor } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Routes accessible by all authenticated users
router.get('/lecture/:lectureId', assignmentController.getLectureAssignments);
router.get('/:id', assignmentController.getAssignmentById);

// Student routes
router.post('/:id/submit', isStudent, assignmentController.submitAssignment);
router.get('/:id/submission', isStudent, assignmentController.getStudentSubmission);

// Instructor routes
router.post('/', isInstructor, assignmentController.createAssignment);
router.put('/:id', isInstructor, assignmentController.updateAssignment);
router.delete('/:id', isInstructor, assignmentController.deleteAssignment);
router.get('/:id/submissions', isInstructor, assignmentController.getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', isInstructor, assignmentController.gradeSubmission);

module.exports = router;
