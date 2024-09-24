const { DataTypes } = require('sequelize');
const db = require('../config/database');
const { Transaction } = require('../model/transactionsModel'); 

const Account = db.define('Account', {
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
      key: 'id',
    },
  },
  account_types_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account_types', 
      key: 'id',
    },
  },
}, {
  timestamps: true, 
  tableName: 'accounts', 
});

Account.hasMany('Transaction', { foreignKey: 'account_id' });
Transaction.belongsTo(Account, { foreignKey: 'account_id' });
module.exports = Account;
