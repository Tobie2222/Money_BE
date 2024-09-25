const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const notificationController = require("../controller/notificationController");

// [Create Notification] - Admin only
Router.post('/notifications/:userId', verifyAdmin, notificationController.createNotification);

// [Get All Notifications for User] - User specific
Router.get('/notifications/:userId', verifyUser, notificationController.getNotification);

// [Delete Notification] - User specific
Router.delete('/notifications/:notificationId/:userId', verifyUser, notificationController.deleteNotification);

// [Tick Notification as Read] - User specific
Router.put('/notifications/tick/:userNotificationId/:userId', verifyUser, notificationController.markNotification);

module.exports = Router;
