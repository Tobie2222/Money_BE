const express=require("express")
const Router=express.Router()
// const {verifyTokenUser}=require("../middleware/verifyToken")

const authController=require("../controller/authController")

// [Register]
Router.post('/register',authController.register)
// [Login]
Router.post('/login',authController.login)

//logout
// Router.post('/logout',authController.logout)


module.exports=Router