const { DataTypes } = require('sequelize');
const db = require('../config/database');


const AccountType = db.define('AccountType', {
  account_type_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_type_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, 
  tableName: 'account_types', 
});

module.exports = AccountType;
