const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Notification = require('./Notification');

const UserNotification = sequelize.define('UserNotification', {
  NotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Notification,
      key: 'NotificationID'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  IsRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'UserNotification',
  timestamps: false
});

// Define associations
User.belongsToMany(Notification, { through: UserNotification, foreignKey: 'UserID' });
Notification.belongsToMany(User, { through: UserNotification, foreignKey: 'NotificationID' });

module.exports = UserNotification;
