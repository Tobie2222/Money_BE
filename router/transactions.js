const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const transactionsController=require("../controller/transactionsController")

// [create expense Transactions]
Router.post('/createExpenseTrans/:accountId/:userId/:categoryId',verifyTokenUser,transactionsController.createExpenseTransactions)

// [create income Transactions]
Router.post('/createIncomeTrans/:accountId/:userId/:incomeTypeId',verifyTokenUser,transactionsController.createIncomeTransactions)

// [updateTransactions]
Router.put('/updateTransactions/:tranId',verifyTokenUser,transactionsController.updateTransactions)

//[getDetailTransactions]
Router.get('/getDetailTransactions/:tranId',verifyTokenUser,transactionsController.getDetailTransactions)

//[get All recent Transactions]
Router.get('/getAllTransactions/:userId',verifyTokenUser,transactionsController.getRecentTransactionsByUser)

// //[get All avg Transactions by month]
// Router.get('/getAvgByMonth/:year',verifyTokenUser,transactionsController.getMonthlyAverage)


//[deleteTransactions]
Router.delete('/deleteTransactions/:tranId',verifyTokenUser,transactionsController.deleteTransactions)


module.exports=Router