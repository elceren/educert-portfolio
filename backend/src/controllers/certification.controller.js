const { Certification, CourseCertification, StudentCertification, Course, Student, User } = require('../models');
const { Op } = require('sequelize');

// Get all certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      order: [['Title', 'ASC']]
    });
    
    res.status(200).json({ certifications });
  } catch (error) {
    console.error('Get all certifications error:', error);
    res.status(500).json({ message: 'Error retrieving certifications', error: error.message });
  }
};

// Get certification by ID
exports.getCertificationById = async (req, res) => {
  try {
    const certificationId = req.params.id;
    
    const certification = await Certification.findByPk(certificationId, {
      include: [
        {
          model: Course,
          through: CourseCertification
        }
      ]
    });
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    res.status(200).json({ certification });
  } catch (error) {
    console.error('Get certification by ID error:', error);
    res.status(500).json({ message: 'Error retrieving certification', error: error.message });
  }
};

// Create new certification
exports.createCertification = async (req, res) => {
  try {
    const { title, issuingBody, expiryDate } = req.body;
    
    // Create certification
    const certification = await Certification.create({
      Title: title,
      IssueDate: new Date(),
      ExpiryDate: expiryDate,
      IssuingBody: issuingBody
    });
    
    res.status(201).json({ 
      message: 'Certification created successfully',
      certification
    });
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ message: 'Error creating certification', error: error.message });
  }
};

// Update certification
exports.updateCertification = async (req, res) => {
  try {
    const certificationId = req.params.id;
    const { title, issuingBody, expiryDate } = req.body;
    
    // Check if certification exists
    const certification = await Certification.findByPk(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    // Update certification
    await Certification.update({
      Title: title,
      ExpiryDate: expiryDate,
      IssuingBody: issuingBody
    }, {
      where: { CertificationID: certificationId }
    });
    
    res.status(200).json({ message: 'Certification updated successfully' });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ message: 'Error updating certification', error: error.message });
  }
};

// Delete certification
exports.deleteCertification = async (req, res) => {
  try {
    const certificationId = req.params.id;
    
    // Check if certification exists
    const certification = await Certification.findByPk(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    // Delete certification
    await Certification.destroy({
      where: { CertificationID: certificationId }
    });
    
    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ message: 'Error deleting certification', error: error.message });
  }
};

// Associate certification with course
exports.associateCertificationWithCourse = async (req, res) => {
  try {
    const certificationId = req.params.id;
    const { courseId } = req.body;
    
    // Check if certification exists
    const certification = await Certification.findByPk(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if association already exists
    const existingAssociation = await CourseCertification.findOne({
      where: {
        CourseID: courseId,
        CertificationID: certificationId
      }
    });
    
    if (existingAssociation) {
      return res.status(400).json({ message: 'Certification already associated with this course' });
    }
    
    // Create association
    await CourseCertification.create({
      CourseID: courseId,
      CertificationID: certificationId
    });
    
    res.status(201).json({ message: 'Certification associated with course successfully' });
  } catch (error) {
    console.error('Associate certification with course error:', error);
    res.status(500).json({ message: 'Error associating certification with course', error: error.message });
  }
};

// Remove certification from course
exports.removeCertificationFromCourse = async (req, res) => {
  try {
    const certificationId = req.params.id;
    const courseId = req.params.courseId;
    
    // Check if association exists
    const association = await CourseCertification.findOne({
      where: {
        CourseID: courseId,
        CertificationID: certificationId
      }
    });
    
    if (!association) {
      return res.status(404).json({ message: 'Certification not associated with this course' });
    }
    
    // Remove association
    await CourseCertification.destroy({
      where: {
        CourseID: courseId,
        CertificationID: certificationId
      }
    });
    
    res.status(200).json({ message: 'Certification removed from course successfully' });
  } catch (error) {
    console.error('Remove certification from course error:', error);
    res.status(500).json({ message: 'Error removing certification from course', error: error.message });
  }
};

// Issue certification to student
exports.issueCertificationToStudent = async (req, res) => {
  try {
    const certificationId = req.params.id;
    const { studentId } = req.body;
    
    // Check if certification exists
    const certification = await Certification.findByPk(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if student already has this certification
    const existingCertification = await StudentCertification.findOne({
      where: {
        StudentID: studentId,
        CertificationID: certificationId
      }
    });
    
    if (existingCertification) {
      return res.status(400).json({ message: 'Student already has this certification' });
    }
    
    // Issue certification
    await StudentCertification.create({
      StudentID: studentId,
      CertificationID: certificationId,
      IssueDate: new Date()
    });
    
    res.status(201).json({ message: 'Certification issued to student successfully' });
  } catch (error) {
    console.error('Issue certification to student error:', error);
    res.status(500).json({ message: 'Error issuing certification to student', error: error.message });
  }
};

// Get student's certifications
exports.getStudentCertifications = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.UserID;
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get certifications
    const certifications = await StudentCertification.findAll({
      where: { StudentID: studentId },
      include: [
        {
          model: Certification
        }
      ]
    });
    
    res.status(200).json({ certifications });
  } catch (error) {
    console.error('Get student certifications error:', error);
    res.status(500).json({ message: 'Error retrieving student certifications', error: error.message });
  }
};

// Verify certification
exports.verifyCertification = async (req, res) => {
  try {
    const { certificationId, studentId } = req.query;
    
    // Check if student has this certification
    const studentCertification = await StudentCertification.findOne({
      where: {
        StudentID: studentId,
        CertificationID: certificationId
      },
      include: [
        {
          model: Certification
        },
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
    
    if (!studentCertification) {
      return res.status(404).json({ 
        verified: false,
        message: 'Certification not found for this student' 
      });
    }
    
    // Check if certification is expired
    const isExpired = studentCertification.Certification.ExpiryDate && 
                      new Date(studentCertification.Certification.ExpiryDate) < new Date();
    
    res.status(200).json({ 
      verified: !isExpired,
      certification: studentCertification,
      isExpired
    });
  } catch (error) {
    console.error('Verify certification error:', error);
    res.status(500).json({ message: 'Error verifying certification', error: error.message });
  }
};
