const { User, Student, Instructor, Administrator } = require('../models');
const { Op } = require('sequelize');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserID', 'Email', 'Name', 'Phone', 'UserType', 'LastLogin', 'CreatedAt']
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ['UserID', 'Email', 'Name', 'Phone', 'UserType', 'LastLogin', 'CreatedAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let userDetails;
    if (user.UserType === 'Student') {
      userDetails = await Student.findByPk(userId);
    } else if (user.UserType === 'Instructor') {
      userDetails = await Instructor.findByPk(userId);
    } else if (user.UserType === 'Administrator') {
      userDetails = await Administrator.findByPk(userId);
    }
    
    res.status(200).json({ 
      user: {
        ...user.toJSON(),
        details: userDetails
      } 
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, educationLevel, biography, description, workExperience, department, accessLevel } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify permission (only self or admin can update)
    if (req.user.UserID !== parseInt(userId) && req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    // Update user in transaction
    await User.sequelize.transaction(async (t) => {
      // Update base user info
      await User.update({
        Name: name,
        Phone: phone
      }, { 
        where: { UserID: userId },
        transaction: t 
      });
      
      // Update role-specific info
      if (user.UserType === 'Student') {
        await Student.update({
          EducationLevel: educationLevel,
          Biography: biography
        }, { 
          where: { UserID: userId },
          transaction: t 
        });
      } else if (user.UserType === 'Instructor') {
        await Instructor.update({
          Description: description,
          WorkExperience: workExperience
        }, { 
          where: { UserID: userId },
          transaction: t 
        });
      } else if (user.UserType === 'Administrator') {
        await Administrator.update({
          Department: department,
          AccessLevel: accessLevel
        }, { 
          where: { UserID: userId },
          transaction: t 
        });
      }
    });
    
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only admin can delete users
    if (req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }
    
    // Delete user in transaction
    await User.sequelize.transaction(async (t) => {
      // Delete role-specific record first
      if (user.UserType === 'Student') {
        await Student.destroy({ 
          where: { UserID: userId },
          transaction: t 
        });
      } else if (user.UserType === 'Instructor') {
        await Instructor.destroy({ 
          where: { UserID: userId },
          transaction: t 
        });
      } else if (user.UserType === 'Administrator') {
        await Administrator.destroy({ 
          where: { UserID: userId },
          transaction: t 
        });
      }
      
      // Delete base user record
      await User.destroy({ 
        where: { UserID: userId },
        transaction: t 
      });
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query, userType } = req.query;
    
    const whereClause = {};
    
    if (query) {
      whereClause[Op.or] = [
        { Name: { [Op.like]: `%${query}%` } },
        { Email: { [Op.like]: `%${query}%` } }
      ];
    }
    
    if (userType) {
      whereClause.UserType = userType;
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['UserID', 'Email', 'Name', 'Phone', 'UserType', 'LastLogin', 'CreatedAt']
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};
