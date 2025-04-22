const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Course = require('./Course');

const Enrolls = sequelize.define('Enrolls', {
  StudentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  CourseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Course,
      key: 'CourseID'
    }
  },
  EnrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  CompletionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'Enrolls',
  timestamps: false
});

// Define associations
Student.belongsToMany(Course, { through: Enrolls, foreignKey: 'StudentID' });
Course.belongsToMany(Student, { through: Enrolls, foreignKey: 'CourseID' });

module.exports = Enrolls;
