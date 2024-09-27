const  DataTypes  = require('sequelize');
const db = require('../config/database');


const SavingsTransaction = db.define('SavingsTransaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_tran: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
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
  saving_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'savings', 
      key: 'saving_id',
    },
  },
}, {
  timestamps: false, 
  tableName: 'savings_transactions', 
});
SavingsTransaction.sync();
module.exports = SavingsTransaction;
