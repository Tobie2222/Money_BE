const express=require("express")
const Router=express.Router()
const {verifyTokenUser,verifyTokenAdmin }=require("../middleware/verifyToken")
const notificationController=require("../controller/notificationController")

// [ create notification]
Router.post('/createNotification/:userId',verifyTokenAdmin,notificationController.createNotification)

//[get All notification]
Router.get('/getNotification/:userId',verifyTokenUser,notificationController.getNotification)

//[delete notification]
Router.delete('/deleteNotification/:notificationId/:userId',verifyTokenUser,notificationController.deleteNotification)

//[delete notification]
Router.put('/tick/:userNotificationId/:userId',verifyTokenUser,notificationController.tickNotification)

module.exports=Router