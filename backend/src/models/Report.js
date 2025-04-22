const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Administrator = require('./Administrator');

const Report = sequelize.define('Report', {
  ReportID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  GeneratedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ReportType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Format: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Parameters: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  AdministratorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Administrator,
      key: 'UserID'
    }
  }
}, {
  tableName: 'Report',
  timestamps: false
});

// Define association with Administrator model
Report.belongsTo(Administrator, { foreignKey: 'AdministratorID' });
Administrator.hasMany(Report, { foreignKey: 'AdministratorID' });

module.exports = Report;
