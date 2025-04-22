const { Enrolls, Student, Course, Module, Lecture } = require('../models');
const { Op } = require('sequelize');

// Get all enrollments for a student
exports.getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    
    const enrollments = await Enrolls.findAll({
      where: { StudentID: studentId },
      include: [
        {
          model: Course,
          attributes: ['CourseID', 'Title', 'Description', 'DifficultyLevel', 'Language', 'Duration']
        }
      ]
    });
    
    res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Get student enrollments error:', error);
    res.status(500).json({ message: 'Error retrieving enrollments', error: error.message });
  }
};

// Enroll student in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const { courseId } = req.body;
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrolls.findOne({
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create enrollment
    await Enrolls.create({
      StudentID: studentId,
      CourseID: courseId,
      EnrollmentDate: new Date(),
      Progress: 0
    });
    
    res.status(201).json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// Update enrollment progress
exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const courseId = req.params.courseId;
    const { progress } = req.body;
    
    // Check if enrollment exists
    const enrollment = await Enrolls.findOne({
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update progress
    await Enrolls.update({
      Progress: progress,
      CompletionDate: progress === 100 ? new Date() : null
    }, {
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update enrollment progress error:', error);
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Unenroll from a course
exports.unenrollFromCourse = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const courseId = req.params.courseId;
    
    // Check if enrollment exists
    const enrollment = await Enrolls.findOne({
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Delete enrollment
    await Enrolls.destroy({
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    res.status(200).json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Unenroll from course error:', error);
    res.status(500).json({ message: 'Error unenrolling from course', error: error.message });
  }
};

// Get course progress details
exports.getCourseProgress = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const courseId = req.params.courseId;
    
    // Check if enrollment exists
    const enrollment = await Enrolls.findOne({
      where: {
        StudentID: studentId,
        CourseID: courseId
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Get course structure
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Module,
          include: [
            {
              model: Lecture
            }
          ]
        }
      ]
    });
    
    res.status(200).json({ 
      enrollment,
      course
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ message: 'Error retrieving course progress', error: error.message });
  }
};

// Get all students enrolled in a course (for instructors)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of this course or an admin
    if (course.InstructorID !== req.user.UserID && req.user.UserType !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to view this course\'s enrollments' });
    }
    
    // Get enrollments
    const enrollments = await Enrolls.findAll({
      where: { CourseID: courseId },
      include: [
        {
          model: Student,
          include: [
            {
              model: User,
              attributes: ['Name', 'Email']
            }
          ]
        }
      ]
    });
    
    res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Get course enrollments error:', error);
    res.status(500).json({ message: 'Error retrieving course enrollments', error: error.message });
  }
};
