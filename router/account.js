const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const accountController=require("../controller/accountController")

// [createAccount]
Router.post('/createAccount/:id_accountType/:id_user',verifyTokenUser,accountController.createAccount)
// [updateAccount]
Router.put('/updateAccount/:accountId',verifyTokenUser,accountController.updateAccount)

//[getDetailAccount]
Router.get('/getDetailAccount/:accountId',verifyTokenUser,accountController.getAccountDetails)

//[getAllAccount]
Router.get('/getAllAccount/:userId',verifyTokenUser,accountController.getAllAccountByUser)

//[deleteAccount]
Router.delete('/deleteAccount/:accountId',verifyTokenUser,accountController.deleteAccount)


module.exports=Router