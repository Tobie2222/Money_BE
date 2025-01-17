const  DataTypes  = require('sequelize');
const db = require('../config/database');

const Notification = db.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  timestamps: false, 
  tableName: 'notifications', 
});
Notification.sync();
module.exports = Notification;
