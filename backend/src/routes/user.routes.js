const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Routes accessible by all authenticated users
router.get('/profile/:id', userController.getUserById);
router.put('/profile/:id', userController.updateUserProfile);

// Routes accessible only by administrators
router.get('/', isAdmin, userController.getAllUsers);
router.delete('/:id', isAdmin, userController.deleteUser);
router.get('/search', isAdmin, userController.searchUsers);

module.exports = router;
