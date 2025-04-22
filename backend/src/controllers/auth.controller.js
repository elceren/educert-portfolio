const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Instructor, Administrator } = require('../models');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, name, password, phone, userType, educationLevel, biography, description, workExperience, department, accessLevel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user in transaction
    const result = await User.sequelize.transaction(async (t) => {
      // Create base user
      const user = await User.create({
        Email: email,
        Name: name,
        Password: password, // Will be hashed by model hook
        Phone: phone,
        UserType: userType,
        LastLogin: new Date()
      }, { transaction: t });

      // Create role-specific record
      if (userType === 'Student') {
        await Student.create({
          UserID: user.UserID,
          EducationLevel: educationLevel,
          Biography: biography
        }, { transaction: t });
      } else if (userType === 'Instructor') {
        await Instructor.create({
          UserID: user.UserID,
          Description: description,
          WorkExperience: workExperience
        }, { transaction: t });
      } else if (userType === 'Administrator') {
        await Administrator.create({
          UserID: user.UserID,
          Department: department,
          AccessLevel: accessLevel
        }, { transaction: t });
      }

      return user;
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: result.UserID, email: result.Email, userType: result.UserType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.UserID,
        email: result.Email,
        name: result.Name,
        userType: result.UserType
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.LastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserID, email: user.Email, userType: user.UserType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.UserID,
        email: user.Email,
        name: user.Name,
        userType: user.UserType
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const userType = req.user.UserType;
    
    let userProfile;
    
    if (userType === 'Student') {
      userProfile = await Student.findByPk(userId, {
        include: [{ model: User, attributes: ['Email', 'Name', 'Phone', 'LastLogin'] }]
      });
    } else if (userType === 'Instructor') {
      userProfile = await Instructor.findByPk(userId, {
        include: [{ model: User, attributes: ['Email', 'Name', 'Phone', 'LastLogin'] }]
      });
    } else if (userType === 'Administrator') {
      userProfile = await Administrator.findByPk(userId, {
        include: [{ model: User, attributes: ['Email', 'Name', 'Phone', 'LastLogin'] }]
      });
    }
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json({ profile: userProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.UserID;
    
    const user = await User.findByPk(userId);
    
    // Verify current password
    const isPasswordValid = await user.isValidPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.Password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};
