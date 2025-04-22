const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lecture = require('./Lecture');

const Content = sequelize.define('Content', {
  ContentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  URL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  UploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  LectureID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lecture,
      key: 'LectureID'
    }
  }
}, {
  tableName: 'Content',
  timestamps: false
});

// Define association with Lecture model
Content.belongsTo(Lecture, { foreignKey: 'LectureID' });
Lecture.hasMany(Content, { foreignKey: 'LectureID' });

module.exports = Content;
