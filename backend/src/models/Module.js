const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');

const Module = sequelize.define('Module', {
  ModuleID: {
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
  OrderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'CourseID'
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
  tableName: 'Module',
  timestamps: false,
  indexes: [
    {
      name: 'idx_module_course',
      fields: ['CourseID']
    }
  ]
});

// Define association with Course model
Module.belongsTo(Course, { foreignKey: 'CourseID' });
Course.hasMany(Module, { foreignKey: 'CourseID' });

module.exports = Module;
