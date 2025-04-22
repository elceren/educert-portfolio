const { Exam, Course, Question, ExamQuestion, Attempt, Student, User } = require('../models');
const { Op } = require('sequelize');

// Get all exams for a course
exports.getCourseExams = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const exams = await Exam.findAll({
      where: { CourseID: courseId },
      order: [['CreatedAt', 'DESC']]
    });
    
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Get course exams error:', error);
    res.status(500).json({ message: 'Error retrieving exams', error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const examId = req.params.id;
    
    const exam = await Exam.findByPk(examId, {
      include: [
        {
          model: Course,
          attributes: ['Title']
        }
      ]
    });
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(200).json({ exam });
  } catch (error) {
    console.error('Get exam by ID error:', error);
    res.status(500).json({ message: 'Error retrieving exam', error: error.message });
  }
};

// Create new exam
exports.createExam = async (req, res) => {
  try {
    const { title, duration, totalPoints, passingScore, numQuestions, courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Create exam
    const exam = await Exam.create({
      Title: title,
      Duration: duration,
      TotalPoints: totalPoints,
      PassingScore: passingScore,
      NumQuestions: numQuestions,
      CourseID: courseId
    });
    
    res.status(201).json({ 
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const { title, duration, totalPoints, passingScore, numQuestions } = req.body;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Update exam
    await Exam.update({
      Title: title,
      Duration: duration,
      TotalPoints: totalPoints,
      PassingScore: passingScore,
      NumQuestions: numQuestions
    }, {
      where: { ExamID: examId }
    });
    
    res.status(200).json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Delete exam
    await Exam.destroy({
      where: { ExamID: examId }
    });
    
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

// Add question to exam
exports.addQuestionToExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const { questionId, orderNumber } = req.body;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Check if question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if question is already in exam
    const existingQuestion = await ExamQuestion.findOne({
      where: {
        ExamID: examId,
        QuestionID: questionId
      }
    });
    
    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already added to this exam' });
    }
    
    // Add question to exam
    await ExamQuestion.create({
      ExamID: examId,
      QuestionID: questionId,
      OrderNumber: orderNumber
    });
    
    res.status(201).json({ message: 'Question added to exam successfully' });
  } catch (error) {
    console.error('Add question to exam error:', error);
    res.status(500).json({ message: 'Error adding question to exam', error: error.message });
  }
};

// Remove question from exam
exports.removeQuestionFromExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const questionId = req.params.questionId;
    
    // Check if question is in exam
    const examQuestion = await ExamQuestion.findOne({
      where: {
        ExamID: examId,
        QuestionID: questionId
      }
    });
    
    if (!examQuestion) {
      return res.status(404).json({ message: 'Question not found in this exam' });
    }
    
    // Remove question from exam
    await ExamQuestion.destroy({
      where: {
        ExamID: examId,
        QuestionID: questionId
      }
    });
    
    res.status(200).json({ message: 'Question removed from exam successfully' });
  } catch (error) {
    console.error('Remove question from exam error:', error);
    res.status(500).json({ message: 'Error removing question from exam', error: error.message });
  }
};

// Get all questions for an exam
exports.getExamQuestions = async (req, res) => {
  try {
    const examId = req.params.id;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Get questions
    const examQuestions = await ExamQuestion.findAll({
      where: { ExamID: examId },
      include: [
        {
          model: Question
        }
      ],
      order: [['OrderNumber', 'ASC']]
    });
    
    res.status(200).json({ examQuestions });
  } catch (error) {
    console.error('Get exam questions error:', error);
    res.status(500).json({ message: 'Error retrieving exam questions', error: error.message });
  }
};

// Start exam attempt (student)
exports.startExamAttempt = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const examId = req.params.id;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Create attempt
    const attempt = await Attempt.create({
      AttemptDate: new Date(),
      Status: 'In Progress',
      StudentID: studentId,
      ExamID: examId
    });
    
    res.status(201).json({ 
      message: 'Exam attempt started successfully',
      attempt
    });
  } catch (error) {
    console.error('Start exam attempt error:', error);
    res.status(500).json({ message: 'Error starting exam attempt', error: error.message });
  }
};

// Submit exam attempt (student)
exports.submitExamAttempt = async (req, res) => {
  try {
    const attemptId = req.params.attemptId;
    const { answers, timeSpent } = req.body;
    
    // Check if attempt exists
    const attempt = await Attempt.findByPk(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    
    // Check if attempt belongs to student
    if (attempt.StudentID !== req.user.UserID) {
      return res.status(403).json({ message: 'Not authorized to submit this attempt' });
    }
    
    // Calculate score
    const exam = await Exam.findByPk(attempt.ExamID, {
      include: [
        {
          model: Question,
          through: ExamQuestion
        }
      ]
    });
    
    let score = 0;
    // Logic to calculate score based on answers would go here
    // This is a simplified version
    
    // Update attempt
    await Attempt.update({
      Score: score,
      TimeSpent: timeSpent,
      Status: 'Completed'
    }, {
      where: { AttemptID: attemptId }
    });
    
    // Check if passed
    const passed = score >= exam.PassingScore;
    
    res.status(200).json({ 
      message: 'Exam attempt submitted successfully',
      score,
      passed
    });
  } catch (error) {
    console.error('Submit exam attempt error:', error);
    res.status(500).json({ message: 'Error submitting exam attempt', error: error.message });
  }
};

// Get student's exam attempts
exports.getStudentExamAttempts = async (req, res) => {
  try {
    const studentId = req.user.UserID;
    const examId = req.params.id;
    
    // Get attempts
    const attempts = await Attempt.findAll({
      where: {
        StudentID: studentId,
        ExamID: examId
      },
      order: [['AttemptDate', 'DESC']]
    });
    
    res.status(200).json({ attempts });
  } catch (error) {
    console.error('Get student exam attempts error:', error);
    res.status(500).json({ message: 'Error retrieving exam attempts', error: error.message });
  }
};

// Get all attempts for an exam (instructor)
exports.getExamAttempts = async (req, res) => {
  try {
    const examId = req.params.id;
    
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Get attempts
    const attempts = await Attempt.findAll({
      where: { ExamID: examId },
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
      order: [['AttemptDate', 'DESC']]
    });
    
    res.status(200).json({ attempts });
  } catch (error) {
    console.error('Get exam attempts error:', error);
    res.status(500).json({ message: 'Error retrieving exam attempts', error: error.message });
  }
};
