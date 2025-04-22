const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  LastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  UserType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Student', 'Instructor', 'Administrator']]
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
  tableName: 'User',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.Password) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('Password')) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = User;
