const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and admin privileges
router.use(verifyToken, isAdmin);

// Report routes
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.post('/course-popularity', reportController.generateCoursePopularityReport);
router.post('/course-rating', reportController.generateCourseRatingReport);
router.post('/student-progress', reportController.generateStudentProgressReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
