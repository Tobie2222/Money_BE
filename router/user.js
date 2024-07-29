const express=require("express")
const Router=express.Router()
const{verifyTokenUser }=require("../middleware/verifyToken")
const uploadCloud=require("../config/upload/cloudinary.config")

const userController=require("../controller/userController")

// [createAccount]
Router.put('/updateUser/:userId',uploadCloud.single("image"),verifyTokenUser,userController.updateUser)

//[getAllAccount]
Router.get('/getUser/:userId',verifyTokenUser,userController.getDetailUser)

//[deleteAccount]
Router.delete('/deleteUser/:userId',verifyTokenUser,userController.deleteUser)


module.exports=Router