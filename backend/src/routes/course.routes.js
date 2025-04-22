const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isInstructor } = require('../middleware/auth.middleware');

// Public routes for browsing courses
router.get('/', courseController.getAllCourses);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes for course management
router.use(verifyToken);
router.post('/', isInstructor, courseController.createCourse);
router.put('/:id', isInstructor, courseController.updateCourse);
router.delete('/:id', isInstructor, courseController.deleteCourse);

module.exports = router;
