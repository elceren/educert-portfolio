const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.UserType === 'Administrator') {
    next();
  } else {
    res.status(403).json({ message: 'Require Administrator Role!' });
  }
};

const isInstructor = (req, res, next) => {
  if (req.user && (req.user.UserType === 'Instructor' || req.user.UserType === 'Administrator')) {
    next();
  } else {
    res.status(403).json({ message: 'Require Instructor Role!' });
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.UserType === 'Student') {
    next();
  } else {
    res.status(403).json({ message: 'Require Student Role!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isInstructor,
  isStudent
};
