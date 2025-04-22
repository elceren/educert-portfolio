const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
  SkillID: {
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
  Category: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'Skill',
  timestamps: false
});

module.exports = Skill;
