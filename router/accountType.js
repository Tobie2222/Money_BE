const express=require("express")
const Router=express.Router()
const uploadCloud=require("../config/upload/cloudinary.config")
const {verifyTokenAdmin,verifyTokenUser }=require("../middleware/verifyToken")
const accountTypeController=require("../controller/accountTypeController")

// [createAccount]
Router.post('/createTypeAccount',uploadCloud.single("image"),verifyTokenAdmin,accountTypeController.createAccountType)

//[getAllAccount]
Router.get('/getAllTypeAccount/:userId',verifyTokenUser,accountTypeController.getAllAccountType)

//[deleteAccount]
Router.delete('/deleteTypeAccount/:id',verifyTokenAdmin,accountTypeController.deleteAccountType)


module.exports=Router