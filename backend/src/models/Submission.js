const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Assignment = require('./Assignment');

const Submission = sequelize.define('Submission', {
  SubmissionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SubmissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Grade: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  FeedbackText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  StudentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  AssignmentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Assignment,
      key: 'AssignmentID'
    }
  }
}, {
  tableName: 'Submission',
  timestamps: false,
  indexes: [
    {
      name: 'idx_submission_student',
      fields: ['StudentID']
    },
    {
      name: 'idx_submission_assignment',
      fields: ['AssignmentID']
    }
  ]
});

// Define associations
Submission.belongsTo(Student, { foreignKey: 'StudentID' });
Submission.belongsTo(Assignment, { foreignKey: 'AssignmentID' });
Student.hasMany(Submission, { foreignKey: 'StudentID' });
Assignment.hasMany(Submission, { foreignKey: 'AssignmentID' });

module.exports = Submission;
