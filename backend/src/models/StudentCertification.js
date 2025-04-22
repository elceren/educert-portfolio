const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Certification = require('./Certification');

const StudentCertification = sequelize.define('StudentCertification', {
  StudentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  CertificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Certification,
      key: 'CertificationID'
    }
  },
  IssueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'StudentCertification',
  timestamps: false
});

// Define associations
Student.belongsToMany(Certification, { through: StudentCertification, foreignKey: 'StudentID' });
Certification.belongsToMany(Student, { through: StudentCertification, foreignKey: 'CertificationID' });

module.exports = StudentCertification;
