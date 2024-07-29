const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const transactionsController=require("../controller/transactionsController")

// [createTransactions]
Router.post('/createTransactions/:id_transactionsType/:id_user',verifyTokenUser,transactionsController.createTransactions)
// [updateTransactions]
Router.put('/updateTransactions/:transactionsId',verifyTokenUser,transactionsController.updateTransactions)

//[getDetailTransactions]
Router.get('/getDetailTransactions/:transactionsId',verifyTokenUser,transactionsController.getDetailTransactions)

//[getAllTransactions]
Router.get('/getAllTransactions/:userId',verifyTokenUser,transactionsController.getAllTransactionsByUser)

//[deleteTransactions]
Router.delete('/deleteTransactions/:transactionsId',verifyTokenUser,transactionsController.deleteTransactions)


module.exports=Router