const express=require("express")
const Router=express.Router()
const {verifyTokenUser,verifyTokenAdmin }=require("../middleware/verifyToken")
const uploadCloud=require("../config/upload/cloudinary.config")

const userController=require("../controller/userController")

// [createUser]
Router.put('/updateUser/:userId',uploadCloud.single("image"),verifyTokenUser,userController.updateUser)

//[getUser]
Router.get('/getUser/:userId',verifyTokenUser,userController.getDetailUser)

//[createUser]
Router.post('/createUser',uploadCloud.single("image"),verifyTokenAdmin,userController.createUser)

//[deleteUser]
Router.delete('/deleteUser/:userId',verifyTokenAdmin,userController.deleteUser)

//[get All User]
Router.get('/getAllUser',verifyTokenAdmin,userController.getAllUser)

//[find All User]
Router.get('/findUser',verifyTokenAdmin,userController.findUser)

module.exports=Router