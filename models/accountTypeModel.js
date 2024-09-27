const { DataTypes } = require('sequelize');
const db = require('../config/database');

const AccountType = db.define('AccountType', {
  account_type_id: {  // Sửa tên trường để khớp với khóa ngoại trong Account
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
  timestamps: false, 
  tableName: 'account_types', 
});

// Phương thức để thiết lập quan hệ
AccountType.associate = (models) => {
  AccountType.hasMany(models.Account, { foreignKey: 'account_types_id', as: 'accounts' });
};

module.exports = AccountType;