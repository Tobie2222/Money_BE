const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const accountController=require("../controller/accountController")

// [createAccount]
Router.post('/createAccount/:id_accountType/:userId',verifyTokenUser,accountController.createAccount)
// [updateAccount]
Router.put('/updateAccount/:accountId/:userId',verifyTokenUser,accountController.updateAccount)

//[getDetailAccount]
Router.get('/getDetailAccount/:accountId/:userId',verifyTokenUser,accountController.getAccountDetails)

//[getAllAccount]
Router.get('/getAllAccount/:userId',verifyTokenUser,accountController.getAllAccountByUser)

//[get total balance by user]
Router.get('/getBalance/:userId',verifyTokenUser,accountController.getTotalBalance)


//[deleteAccount]
Router.delete('/deleteAccount/:accountId/:userId',verifyTokenUser,accountController.deleteAccount)


module.exports=Router