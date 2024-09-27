const  DataTypes  = require('sequelize');
const db = require('../config/database');

const Transaction = db.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc_transaction: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug_user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_fixed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_date: {
    type: DataTypes.DATE,
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
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts', 
      key: 'account_id',
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'categories', 
      key: 'category_id',
    },
  },
  income_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'incomeTypes', 
      key: 'income_type_id',
    },
  },
}, {
  timestamps: false, 
  tableName: 'transactions', 
});
Transaction.sync();
module.exports = Transaction;
