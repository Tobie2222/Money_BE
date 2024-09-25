const { DataTypes } = require('sequelize');
const db = require('../config/database');


const Notification = db.define('Notification', {
  notification_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc_notification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'low', 
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'admin', 
  },
}, {
  timestamps: true, 
  tableName: 'notifications', 
});

module.exports = Notification;
