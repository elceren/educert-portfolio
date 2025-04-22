const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Exam = require('./Exam');

const Attempt = sequelize.define('Attempt', {
  AttemptID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  AttemptDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  TimeSpent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time spent in minutes'
  },
  Status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'In Progress'
  },
  StudentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  ExamID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exam,
      key: 'ExamID'
    }
  }
}, {
  tableName: 'Attempt',
  timestamps: false
});

// Define associations
Attempt.belongsTo(Student, { foreignKey: 'StudentID' });
Attempt.belongsTo(Exam, { foreignKey: 'ExamID' });
Student.hasMany(Attempt, { foreignKey: 'StudentID' });
Exam.hasMany(Attempt, { foreignKey: 'ExamID' });

module.exports = Attempt;
