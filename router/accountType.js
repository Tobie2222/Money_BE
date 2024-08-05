const express=require("express")
const Router=express.Router()
const uploadCloud=require("../config/upload/cloudinary.config")

const accountTypeController=require("../controller/accountTypeController")

// [createAccount]
Router.post('/createTypeAccount',uploadCloud.single("image"),accountTypeController.createAccountType)

//[getAllAccount]
Router.get('/getAllTypeAccount',accountTypeController.getAllAccountType)

//[deleteAccount]
Router.delete('/deleteTypeAccount/:id',accountTypeController.deleteAccountType)


module.exports=Router