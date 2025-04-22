const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Course = require('./Course');

const Review = sequelize.define('Review', {
  ReviewID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  Comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  StudentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  CourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'CourseID'
    }
  }
}, {
  tableName: 'Review',
  timestamps: false,
  indexes: [
    {
      name: 'idx_review_course',
      fields: ['CourseID']
    },
    {
      name: 'idx_review_student',
      fields: ['StudentID']
    }
  ]
});

// Define associations
Review.belongsTo(Student, { foreignKey: 'StudentID' });
Review.belongsTo(Course, { foreignKey: 'CourseID' });
Student.hasMany(Review, { foreignKey: 'StudentID' });
Course.hasMany(Review, { foreignKey: 'CourseID' });

module.exports = Review;
