const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');
const Certification = require('./Certification');

const CourseCertification = sequelize.define('CourseCertification', {
  CourseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Course,
      key: 'CourseID'
    }
  },
  CertificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Certification,
      key: 'CertificationID'
    }
  }
}, {
  tableName: 'CourseCertification',
  timestamps: false
});

// Define associations
Course.belongsToMany(Certification, { through: CourseCertification, foreignKey: 'CourseID' });
Certification.belongsToMany(Course, { through: CourseCertification, foreignKey: 'CertificationID' });

module.exports = CourseCertification;
