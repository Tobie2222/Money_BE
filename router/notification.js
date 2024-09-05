const express=require("express")
const Router=express.Router()
const {verifyTokenUser,verifyTokenAdmin }=require("../middleware/verifyToken")
const notificationController=require("../controller/notificationController")

// [ create notification]
Router.post('/createNotification',verifyTokenAdmin,notificationController.createNotification)


//[get All notification]
Router.get('/getNotification/:userId',verifyTokenUser,notificationController.getNotification)

module.exports=Router