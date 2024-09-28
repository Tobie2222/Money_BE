const db = require('../config/database');
const  DataTypes  = require('sequelize');


const UserNotification = db.define('usernotifications', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', 
      key: 'user_id',      
    },
    allowNull: false
  },
  notification_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'notifications', 
      key: 'notification_id',              
    },
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('read', 'unread'),
    defaultValue: 'unread',
  },
}, {
  tableName: 'usernotifications' 
});
module.exports = UserNotification;
