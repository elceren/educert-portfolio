const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  EducationLevel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Biography: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Student',
  timestamps: false
});

// Define association with User model
Student.belongsTo(User, { foreignKey: 'UserID' });

module.exports = Student;
