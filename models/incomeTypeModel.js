const  DataTypes  = require('sequelize');
const db = require('../config/database');
const IncomeType = db.define('IncomeType', {
  income_type_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  income_type_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_global: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'users', 
      key: 'id',
    },
  },
}, {
  timestamps: true, 
  tableName: 'income_types', 
});
module.exports = IncomeType;
