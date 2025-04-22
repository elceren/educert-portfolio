const { Course, Instructor, User, Module, Lecture, Review } = require('../models');
const { Op } = require('sequelize');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { title, difficulty, language, category, instructorId } = req.query;
    
    // Build filter conditions
    const whereClause = {};
    
    if (title) {
      whereClause.Title = { [Op.like]: `%${title}%` };
    }
    
    if (difficulty) {
      whereClause.DifficultyLevel = difficulty;
    }
    
    if (language) {
      whereClause.Language = language;
    }
    
    if (instructorId) {
      whereClause.InstructorID = instructorId;
    }
    
    // Get courses with instructor information
    const courses = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: Instructor,
          include: [
            {
              model: User,
              attributes: ['Name']
            }
          ]
        },
        {
          model: Review,
          attributes: ['Rating']
        }
      ]
    });
    
    // Calculate average rating for each course
    const coursesWithRating = courses.map(course => {
      const reviews = course.Reviews || [];
      const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      return {
        ...course.toJSON(),
        averageRating,
        reviewCount: reviews.length
      };
    });
    
    res.status(200).json({ courses: coursesWithRating });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Error retrieving courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Instructor,
          include: [
            {
              model: User,
              attributes: ['Name']
            }
          ]
        },
        {
          model: Module,
          include: [
            {
              model: Lecture
            }
          ]
        },
        {
          model: Review,
          include: [
            {
              model: Student,
              include: [
                {
                  model: User,
                  attributes: ['Name']
                }
              ]
            }
          ]
        }
      ]
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Calculate average rating
    const reviews = course.Reviews || [];
    const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    const courseData = {
      ...course.toJSON(),
      averageRating,
      reviewCount: reviews.length
    };
    
    res.status(200).json({ course: courseData });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Error retrieving course', error: error.message });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, difficultyLevel, language, duration, certificationOption } = req.body;
    
    // Only instructors can create courses
    if (req.user.UserType !== 'Instructor' && req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }
    
    const instructorId = req.user.UserID;
    
    // Create course
    const course = await Course.create({
      Title: title,
      Description: description,
      DifficultyLevel: difficultyLevel,
      Language: language,
      Duration: duration,
      InstructorID: instructorId,
      CertificationOption: certificationOption || false,
      Status: 'Active'
    });
    
    res.status(201).json({ 
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, difficultyLevel, language, duration, certificationOption, status } = req.body;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of this course or an admin
    if (course.InstructorID !== req.user.UserID && req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course
    await Course.update({
      Title: title,
      Description: description,
      DifficultyLevel: difficultyLevel,
      Language: language,
      Duration: duration,
      CertificationOption: certificationOption,
      Status: status
    }, {
      where: { CourseID: courseId }
    });
    
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of this course or an admin
    if (course.InstructorID !== req.user.UserID && req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    // Delete course
    await Course.destroy({
      where: { CourseID: courseId }
    });
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { query, difficulty, language, instructorName } = req.query;
    
    // Build complex query with joins
    let whereClause = {};
    let instructorWhereClause = {};
    
    if (query) {
      whereClause.Title = { [Op.like]: `%${query}%` };
    }
    
    if (difficulty) {
      whereClause.DifficultyLevel = difficulty;
    }
    
    if (language) {
      whereClause.Language = language;
    }
    
    if (instructorName) {
      instructorWhereClause = {
        '$Instructor.User.Name$': { [Op.like]: `%${instructorName}%` }
      };
    }
    
    const courses = await Course.findAll({
      where: {
        ...whereClause,
        ...instructorWhereClause
      },
      include: [
        {
          model: Instructor,
          include: [
            {
              model: User,
              attributes: ['Name']
            }
          ]
        },
        {
          model: Review,
          attributes: ['Rating']
        }
      ]
    });
    
    // Calculate average rating for each course
    const coursesWithRating = courses.map(course => {
      const reviews = course.Reviews || [];
      const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      return {
        ...course.toJSON(),
        averageRating,
        reviewCount: reviews.length
      };
    });
    
    res.status(200).json({ courses: coursesWithRating });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ message: 'Error searching courses', error: error.message });
  }
};
