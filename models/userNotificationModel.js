const db = require('../config/database');
const  DataTypes  = require('sequelize');


const UserNotification = db.define('UserNotification', {
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
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,  
  }
}, {
  timestamps: true, 
  tableName: 'user_notifications' 
});

module.exports = UserNotification;
