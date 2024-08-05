const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const transactionsController=require("../controller/transactionsController")

// [create expense Transactions]
Router.post('/createExpenseTrans/:accountId/:userId/:categoryId',verifyTokenUser,transactionsController.createExpenseTransactions)

// [create income Transactions]
Router.post('/createIncomeTrans/:accountId/:userId/:incomeTypeId',verifyTokenUser,transactionsController.createIncomeTransactions)

// [updateTransactions]
Router.put('/updateTransactions/:transactionsId',verifyTokenUser,transactionsController.updateTransactions)

//[getDetailTransactions]
Router.get('/getDetailTransactions/:transactionsId',verifyTokenUser,transactionsController.getDetailTransactions)

//[getAllTransactions]
Router.get('/getAllTransactions/:userId',verifyTokenUser,transactionsController.getAllTransactionsByUser)

//[deleteTransactions]
Router.delete('/deleteTransactions/:transactionsId',verifyTokenUser,transactionsController.deleteTransactions)


module.exports=Router