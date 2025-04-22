const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  QuestionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  DifficultyLevel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Points: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Question',
  timestamps: false
});

module.exports = Question;
