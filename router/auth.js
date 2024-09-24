const express=require("express")
const Router = express.Router();
const AuthController = require('../controller/authController');

//Post day du lieu ve
//get lay du lieu ve
//put la update du lieu
//Register
Router.post('/register',AuthController.register);
//Login
Router.post('/login',AuthController.login);
//send mail
Router.post('/send-mail',AuthController.forgotPassword);

//verify code
Router.post('/verify-code',AuthController.verifyCode);

//reset password
Router.post('/reset-password',AuthController.resetPassword);

//change password
Router.post('/changePassword',AuthController.changePassword);

module.exports = Router;

