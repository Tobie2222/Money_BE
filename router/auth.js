const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const authController=require("../controller/authController")

// [Register]
Router.post('/register',authController.register)
// [Login]
Router.post('/login',authController.login)

//send mail
Router.post('/send-mail',authController.forgotPassword)

//verify code
Router.post('/verify-code',authController.verifyCode)

//reset password
Router.post('/reset-password',authController.resetPassword)


module.exports=Router