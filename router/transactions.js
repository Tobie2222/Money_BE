const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const transactionsController=require("../controller/transactionsController")

// [create expense Transactions]
Router.post('/createExpenseTrans/:accountId/:userId/:categoryId',verifyTokenUser,transactionsController.createExpenseTransactions)

// [create income Transactions]
Router.post('/createIncomeTrans/:accountId/:userId/:incomeTypeId',verifyTokenUser,transactionsController.createIncomeTransactions)

//[get all Tran income]
Router.get('/allTranIncome/:userId',verifyTokenUser,transactionsController.getAllTranIncome)

//[get all Tran expense]
Router.get('/allTranExpense/:userId',verifyTokenUser,transactionsController.getAllTranExpense)


//[deleteTransactions]
Router.delete('/deleteTran/:tranId/:userId',verifyTokenUser,transactionsController.deleteTran)

// [updateTransactions]
Router.put('/updateTransactions/:tranId/:userId',verifyTokenUser,transactionsController.updateTransactions)

//[getDetailTransactions]
Router.get('/getDetailTran/:tranId/:userId',verifyTokenUser,transactionsController.getDetailTransactions)

//[get All recent Transactions]
Router.get('/getAllTranRecent/:userId',verifyTokenUser,transactionsController.getRecentTranByUser)

//[get avg Transactions]
Router.get('/getSumTranInMonth/:userId',verifyTokenUser,transactionsController.getAvgTranInMonth)


//[spread All sum transactions by month by year]
Router.get('/getSumTranByMonth/:userId',verifyTokenUser,transactionsController.getMonthlySumTran)

//[spread All sum avg by month by year]
Router.get('/getAvgTranByMonth/:userId',verifyTokenUser,transactionsController.getAverageIncomeAndExpensePerMonth)



module.exports=Router