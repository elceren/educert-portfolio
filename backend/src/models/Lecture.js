const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Module = require('./Module');

const Lecture = sequelize.define('Lecture', {
  LectureID: {
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
  Duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  OrderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ModuleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Module,
      key: 'ModuleID'
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
  tableName: 'Lecture',
  timestamps: false,
  indexes: [
    {
      name: 'idx_lecture_module',
      fields: ['ModuleID']
    }
  ]
});

// Define association with Module model
Lecture.belongsTo(Module, { foreignKey: 'ModuleID' });
Module.hasMany(Lecture, { foreignKey: 'ModuleID' });

module.exports = Lecture;
