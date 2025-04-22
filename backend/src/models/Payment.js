const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Course = require('./Course');

const Payment = sequelize.define('Payment', {
  PaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  StudentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'UserID'
    }
  },
  CourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'CourseID'
    }
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  PaymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  PaymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Completed'
  },
  TransactionID: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Payment',
  timestamps: false,
  indexes: [
    {
      name: 'idx_payment_student',
      fields: ['StudentID']
    },
    {
      name: 'idx_payment_course',
      fields: ['CourseID']
    }
  ]
});

// Define associations
Payment.belongsTo(Student, { foreignKey: 'StudentID' });
Payment.belongsTo(Course, { foreignKey: 'CourseID' });
Student.hasMany(Payment, { foreignKey: 'StudentID' });
Course.hasMany(Payment, { foreignKey: 'CourseID' });

module.exports = Payment;
