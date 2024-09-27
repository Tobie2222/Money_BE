const  DataTypes  = require('sequelize');
const db = require('../config/database');


const Saving = db.define('Saving', {
  saving_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saving_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc_saving: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  goal_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  current_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  saving_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  saving_image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "https://cdn.pixabay.com/photo/2021/04/16/10/19/piggy-bank-6183186_960_720.png",
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'user_id',
    },
  },
}, {
  timestamps: false, 
  tableName: 'savings',
});
Saving.sync();
module.exports = Saving;
