const  DataTypes  = require('sequelize');
const db = require('../config/database');
const AccountType = db.define('AccountType', {
  account_types_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_types_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_types_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, 
  tableName: 'account_types', 
});

module.exports = AccountType;
