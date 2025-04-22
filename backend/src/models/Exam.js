const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');

const Exam = sequelize.define('Exam', {
  ExamID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  TotalPoints: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  PassingScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  NumQuestions: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'CourseID'
    }
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Exam',
  timestamps: false,
  indexes: [
    {
      name: 'idx_exam_course',
      fields: ['CourseID']
    }
  ]
});

// Define association with Course model
Exam.belongsTo(Course, { foreignKey: 'CourseID' });
Course.hasMany(Exam, { foreignKey: 'CourseID' });

module.exports = Exam;
