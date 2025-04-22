const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certification = sequelize.define('Certification', {
  CertificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  IssueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  IssuingBody: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Certification',
  timestamps: false
});

module.exports = Certification;
