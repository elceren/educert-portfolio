const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lecture = require('./Lecture');

const Assignment = sequelize.define('Assignment', {
  AssignmentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  DueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  MaxPoints: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  LectureID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lecture,
      key: 'LectureID'
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
  tableName: 'Assignment',
  timestamps: false,
  indexes: [
    {
      name: 'idx_assignment_lecture',
      fields: ['LectureID']
    }
  ]
});

// Define association with Lecture model
Assignment.belongsTo(Lecture, { foreignKey: 'LectureID' });
Lecture.hasMany(Assignment, { foreignKey: 'LectureID' });

module.exports = Assignment;
