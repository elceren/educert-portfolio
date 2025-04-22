const { Assignment, Lecture, Submission, Student, User } = require('../models');
const { Op } = require('sequelize');

// Get all assignments for a lecture
exports.getLectureAssignments = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    
    const assignments = await Assignment.findAll({
      where: { LectureID: lectureId },
      order: [['DueDate', 'ASC']]
    });
    
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Get lecture assignments error:', error);
    res.status(500).json({ message: 'Error retrieving assignments', error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    const assignment = await Assignment.findByPk(assignmentId, {
      include: [
        {
          model: Lecture,
          attributes: ['Title', 'ModuleID']
        }
      ]
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Get assignment by ID error:', error);
    res.status(500).json({ message: 'Error retrieving assignment', error: error.message });
  }
};

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, maxPoints, weight, lectureId } = req.body;
    
    // Check if lecture exists
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    
    // Create assignment
    const assignment = await Assignment.create({
      Title: title,
      Description: description,
      DueDate: dueDate,
      MaxPoints: maxPoints,
      Weight: weight,
      LectureID: lectureId
    });
    
    res.status(201).json({ 
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { title, description, dueDate, maxPoints, weight } = req.body;
    
    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Update assignment
    await Assignment.update({
      Title: title,
      Description: description,
      DueDate: dueDate,
      MaxPoints: maxPoints,
      Weight: weight
    }, {
      where: { AssignmentID: assignmentId }
    });
    
    res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Delete assignment
    await Assignment.destroy({
      where: { AssignmentID: assignmentId }
    });
    
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

// Submit assignment (student)
exports.submitAssignment = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const assignmentId = req.params.id;
    const { submissionContent } = req.body;
    
    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      where: {
        StudentID: studentId,
        AssignmentID: assignmentId
      }
    });
    
    if (existingSubmission) {
      // Update existing submission
      await Submission.update({
        SubmissionDate: new Date(),
        Content: submissionContent
      }, {
        where: {
          StudentID: studentId,
          AssignmentID: assignmentId
        }
      });
      
      res.status(200).json({ message: 'Submission updated successfully' });
    } else {
      // Create new submission
      const submission = await Submission.create({
        SubmissionDate: new Date(),
        Content: submissionContent,
        StudentID: studentId,
        AssignmentID: assignmentId
      });
      
      res.status(201).json({ 
        message: 'Assignment submitted successfully',
        submission
      });
    }
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  }
};

// Grade assignment submission (instructor)
exports.gradeSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const { grade, feedbackText } = req.body;
    
    // Check if submission exists
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Update submission with grade and feedback
    await Submission.update({
      Grade: grade,
      FeedbackText: feedbackText
    }, {
      where: { SubmissionID: submissionId }
    });
    
    res.status(200).json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Error grading submission', error: error.message });
  }
};

// Get all submissions for an assignment (instructor)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Get submissions
    const submissions = await Submission.findAll({
      where: { AssignmentID: assignmentId },
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
      ],
      order: [['SubmissionDate', 'DESC']]
    });
    
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Get assignment submissions error:', error);
    res.status(500).json({ message: 'Error retrieving submissions', error: error.message });
  }
};

// Get student's submission for an assignment
exports.getStudentSubmission = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const assignmentId = req.params.id;
    
    // Get submission
    const submission = await Submission.findOne({
      where: {
        StudentID: studentId,
        AssignmentID: assignmentId
      }
    });
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.status(200).json({ submission });
  } catch (error) {
    console.error('Get student submission error:', error);
    res.status(500).json({ message: 'Error retrieving submission', error: error.message });
  }
};
