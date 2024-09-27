const  DataTypes  = require('sequelize');
const db = require('../config/database');
const Account = db.define('Account', {
  accout_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc_account: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'user_id',
    },
  },
  account_types_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account_types', 
      key: 'account_type_id',
    },
  },
}, {
  timestamps: false, 
  tableName: 'accounts', 
});
Account.sync();
module.exports = Account;
