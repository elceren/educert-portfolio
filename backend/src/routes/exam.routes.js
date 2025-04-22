const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { verifyToken, isStudent, isInstructor } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Routes accessible by all authenticated users
router.get('/course/:courseId', examController.getCourseExams);
router.get('/:id', examController.getExamById);

// Student routes
router.post('/:id/attempt', isStudent, examController.startExamAttempt);
router.put('/attempt/:attemptId/submit', isStudent, examController.submitExamAttempt);
router.get('/:id/attempts/student', isStudent, examController.getStudentExamAttempts);

// Instructor routes
router.post('/', isInstructor, examController.createExam);
router.put('/:id', isInstructor, examController.updateExam);
router.delete('/:id', isInstructor, examController.deleteExam);
router.post('/:id/questions', isInstructor, examController.addQuestionToExam);
router.delete('/:id/questions/:questionId', isInstructor, examController.removeQuestionFromExam);
router.get('/:id/questions', isInstructor, examController.getExamQuestions);
router.get('/:id/attempts', isInstructor, examController.getExamAttempts);

module.exports = router;
