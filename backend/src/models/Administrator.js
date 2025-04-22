const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Administrator = sequelize.define('Administrator', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  Department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  AccessLevel: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'Administrator',
  timestamps: false
});

// Define association with User model
Administrator.belongsTo(User, { foreignKey: 'UserID' });

module.exports = Administrator;
