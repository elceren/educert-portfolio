const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Instructor = require('./Instructor');

const Course = sequelize.define('Course', {
  CourseID: {
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
  DifficultyLevel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Language: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  InstructorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Instructor,
      key: 'UserID'
    }
  },
  CertificationOption: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Active'
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
  tableName: 'Course',
  timestamps: false,
  indexes: [
    {
      name: 'idx_course_title',
      fields: ['Title']
    },
    {
      name: 'idx_course_difficulty',
      fields: ['DifficultyLevel']
    },
    {
      name: 'idx_course_language',
      fields: ['Language']
    }
  ]
});

// Define association with Instructor model
Course.belongsTo(Instructor, { foreignKey: 'InstructorID' });

module.exports = Course;
