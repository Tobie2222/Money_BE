const  DataTypes  = require('sequelize');
const db = require('../config/database');


const Category = db.define('Category', {
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  is_global: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  category_image: {
    type: DataTypes.STRING,
    allowNull: false,
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
  timestamps: false, 
  tableName: 'categories', 
});
Category.sync();
module.exports = Category;
