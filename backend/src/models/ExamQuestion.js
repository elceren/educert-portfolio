const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Exam = require('./Exam');
const Question = require('./Question');

const ExamQuestion = sequelize.define('ExamQuestion', {
  ExamID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Exam,
      key: 'ExamID'
    }
  },
  QuestionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Question,
      key: 'QuestionID'
    }
  },
  OrderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ExamQuestion',
  timestamps: false
});

// Define associations
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'ExamID' });
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'QuestionID' });

module.exports = ExamQuestion;
