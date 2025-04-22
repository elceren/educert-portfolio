const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Instructor = sequelize.define('Instructor', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  WorkExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Instructor',
  timestamps: false
});

// Define association with User model
Instructor.belongsTo(User, { foreignKey: 'UserID' });

module.exports = Instructor;
