const  DataTypes  = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  gender: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  slug_user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
  password_reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password_reset_expiration: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false, 
  tableName: 'users', 
});

User.sync();
module.exports = User;
