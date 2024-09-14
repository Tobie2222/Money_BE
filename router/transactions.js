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
Router.put('/updateTransactions/:tranId/:userId/:type',verifyTokenUser,transactionsController.updateTransactions)

//[getDetailTransactions]
Router.get('/getDetailTran/:tranId/:userId',verifyTokenUser,transactionsController.getDetailTransactions)

//[get All recent Transactions]
Router.get('/getAllTranRecent/:userId',verifyTokenUser,transactionsController.getRecentTranByUser)

//[get avg Transactions]
Router.get('/getAvgTranInMonth/:userId/:slug_user',verifyTokenUser,transactionsController.getAvgTranInMonth)


//[spread All sum transactions by month by year]
Router.get('/getSumTranByMonth/:userId/:slug_user',verifyTokenUser,transactionsController.getMonthlySumTran)

//[spread All sum avg by month by year]
Router.get('/getAvgTranByMonth/:userId/:slug_user',verifyTokenUser,transactionsController.getAverageIncomeAndExpensePerMonth)

//[find transaction by keyword ]
Router.get('/findTran/:userId',verifyTokenUser,transactionsController.findTransactions)

//[find and filter transaction by keyword ]
Router.get('/filterTran/:userId',verifyTokenUser,transactionsController.filterTransactions)

module.exports=Router