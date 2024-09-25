const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const notificationController = require("../controller/notificationController");

// [Create Notification] - Admin only
Router.post('/createNotification/:userId', verifyAdmin, notificationController.createNotification);

// [Get All Notifications for User] - User specific
Router.get('/getNotification/:userId', verifyUser, notificationController.getNotification);

// [Delete Notification] - User specific
Router.delete('/deleteNotification/:notificationId/:userId', verifyUser, notificationController.deleteNotification);

// [Tick Notification as Read] - User specific
Router.put('/tick/:userNotificationId/:userId', verifyUser, notificationController.markNotification);

module.exports = Router;
