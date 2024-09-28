const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Account = db.define('Account', {
  account_id: {
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

// Phương thức để thiết lập quan hệ
Account.associate = (models) => {
  Account.belongsTo(models.AccountType, { foreignKey: 'account_types_id', as: 'accountType' });
  Account.hasMany(models.Transaction, { foreignKey: 'account_id', as: 'transactions' });
  Account.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Account;
