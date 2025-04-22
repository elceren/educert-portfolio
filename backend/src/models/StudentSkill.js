const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Skill = require('./Skill');

const StudentSkill = sequelize.define('StudentSkill', {
  StudentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  SkillID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Skill,
      key: 'SkillID'
    }
  },
  ProficiencyLevel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  AcquiredDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'StudentSkill',
  timestamps: false
});

// Define associations
Student.belongsToMany(Skill, { through: StudentSkill, foreignKey: 'StudentID' });
Skill.belongsToMany(Student, { through: StudentSkill, foreignKey: 'SkillID' });

module.exports = StudentSkill;
