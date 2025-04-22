const { Report, Administrator, User, Course, Student, Enrolls, Review } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Administrator,
          include: [
            {
              model: User,
              attributes: ['Name']
            }
          ]
        }
      ],
      order: [['GeneratedDate', 'DESC']]
    });
    
    res.status(200).json({ reports });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Error retrieving reports', error: error.message });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    
    const report = await Report.findByPk(reportId, {
      include: [
        {
          model: Administrator,
          include: [
            {
              model: User,
              attributes: ['Name']
            }
          ]
        }
      ]
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json({ report });
  } catch (error) {
    console.error('Get report by ID error:', error);
    res.status(500).json({ message: 'Error retrieving report', error: error.message });
  }
};

// Generate course popularity report
exports.generateCoursePopularityReport = async (req, res) => {
  try {
    const adminId = req.user.UserID;
    const { startDate, endDate, format } = req.body;
    
    // Validate admin
    const admin = await Administrator.findByPk(adminId);
    if (!admin) {
      return res.status(403).json({ message: 'Only administrators can generate reports' });
    }
    
    // Parse date range
    const parsedStartDate = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const parsedEndDate = endDate ? new Date(endDate) : new Date();
    
    // Get enrollment data
    const enrollmentData = await Enrolls.findAll({
      attributes: [
        'CourseID',
        [Sequelize.fn('COUNT', Sequelize.col('StudentID')), 'enrollmentCount']
      ],
      where: {
        EnrollmentDate: {
          [Op.between]: [parsedStartDate, parsedEndDate]
        }
      },
      include: [
        {
          model: Course,
          attributes: ['Title', 'DifficultyLevel', 'Language']
        }
      ],
      group: ['CourseID'],
      order: [[Sequelize.literal('enrollmentCount'), 'DESC']]
    });
    
    // Create report
    const report = await Report.create({
      Title: `Course Popularity Report (${parsedStartDate.toISOString().split('T')[0]} to ${parsedEndDate.toISOString().split('T')[0]})`,
      GeneratedDate: new Date(),
      ReportType: 'Course Popularity',
      Format: format || 'JSON',
      Parameters: JSON.stringify({ startDate: parsedStartDate, endDate: parsedEndDate }),
      AdministratorID: adminId
    });
    
    res.status(201).json({ 
      message: 'Course popularity report generated successfully',
      report,
      data: enrollmentData
    });
  } catch (error) {
    console.error('Generate course popularity report error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// Generate course rating report
exports.generateCourseRatingReport = async (req, res) => {
  try {
    const adminId = req.user.UserID;
    const { format } = req.body;
    
    // Validate admin
    const admin = await Administrator.findByPk(adminId);
    if (!admin) {
      return res.status(403).json({ message: 'Only administrators can generate reports' });
    }
    
    // Get rating data
    const ratingData = await Review.findAll({
      attributes: [
        'CourseID',
        [Sequelize.fn('AVG', Sequelize.col('Rating')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('ReviewID')), 'reviewCount']
      ],
      include: [
        {
          model: Course,
          attributes: ['Title', 'DifficultyLevel', 'Language']
        }
      ],
      group: ['CourseID'],
      order: [[Sequelize.literal('averageRating'), 'DESC']]
    });
    
    // Create report
    const report = await Report.create({
      Title: 'Course Rating Report',
      GeneratedDate: new Date(),
      ReportType: 'Course Rating',
      Format: format || 'JSON',
      Parameters: JSON.stringify({}),
      AdministratorID: adminId
    });
    
    res.status(201).json({ 
      message: 'Course rating report generated successfully',
      report,
      data: ratingData
    });
  } catch (error) {
    console.error('Generate course rating report error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// Generate student progress report
exports.generateStudentProgressReport = async (req, res) => {
  try {
    const adminId = req.user.UserID;
    const { courseId, format } = req.body;
    
    // Validate admin
    const admin = await Administrator.findByPk(adminId);
    if (!admin) {
      return res.status(403).json({ message: 'Only administrators can generate reports' });
    }
    
    // Check if course exists
    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }
    
    // Build query
    const whereClause = courseId ? { CourseID: courseId } : {};
    
    // Get progress data
    const progressData = await Enrolls.findAll({
      attributes: [
        'StudentID',
        'CourseID',
        'Progress',
        'EnrollmentDate',
        'CompletionDate'
      ],
      where: whereClause,
      include: [
        {
          model: Student,
          include: [
            {
              model: User,
              attributes: ['Name', 'Email']
            }
          ]
        },
        {
          model: Course,
          attributes: ['Title']
        }
      ],
      order: [['Progress', 'DESC']]
    });
    
    // Create report
    const report = await Report.create({
      Title: courseId ? `Student Progress Report for Course #${courseId}` : 'Student Progress Report (All Courses)',
      GeneratedDate: new Date(),
      ReportType: 'Student Progress',
      Format: format || 'JSON',
      Parameters: JSON.stringify({ courseId }),
      AdministratorID: adminId
    });
    
    res.status(201).json({ 
      message: 'Student progress report generated successfully',
      report,
      data: progressData
    });
  } catch (error) {
    console.error('Generate student progress report error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Check if report exists
    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Delete report
    await Report.destroy({
      where: { ReportID: reportId }
    });
    
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
};
