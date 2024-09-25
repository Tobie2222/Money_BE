const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../middleware/verifyToken");
const transactionsController = require("../controller/transactionsController");

// [Create Expense Transaction] - User specific
Router.post('/createExpenseTrans/:accountId/:userId/:categoryId', verifyUser, transactionsController.createExpenseTransactions);

// [Create Income Transaction] - User specific
Router.post('/createIncomeTrans/:accountId/:userId/:incomeTypeId', verifyUser, transactionsController.createIncomeTransactions);

// [Get All Income Transactions] - User specific
Router.get('/allTranIncome/:userId', verifyUser, transactionsController.getAllTranIncome);

// [Get All Expense Transactions] - User specific
Router.get('/allTranExpense/:userId', verifyUser, transactionsController.getAllTranExpense);

// [Delete Transaction] - User specific
Router.delete('/deleteTran/:tranId/:userId', verifyUser, transactionsController.deleteTransaction);

// [Update Transaction] - User specific
Router.put('/updateTransactions/:tranId/:userId/:type', verifyUser, transactionsController.updateTransaction);

// [Get Transaction Details] - User specific
Router.get('/getDetailTran/:tranId/:userId', verifyUser, transactionsController.getDetailTransactions);

// [Get All Recent Transactions] - User specific
Router.get('/getAllTranRecent/:userId', verifyUser, transactionsController.getRecentTranByUser);

// [Get Average Transactions in Month] - User specific
Router.get('/getAvgTranInMonth/:userId/:slug_user', verifyUser, transactionsController.getAvgTranInMonth);

// [Get Monthly Sum of Transactions] - User specific
Router.get('/getSumTranByMonth/:userId/:slug_user', verifyUser, transactionsController.getMonthlySumTran);

// [Get Average Income and Expense per Month] - User specific
 Router.get('/getAvgTranByMonth/:userId/:slug_user', verifyUser, transactionsController.getAverageIncomeAndExpensePerMonth);

// [Find Transactions by Keyword] - User specific
Router.get('/findTran/:userId', verifyUser, transactionsController.findTransactions);

// [Filter Transactions by Keyword] - User specific
Router.get('/filterTran/:userId', verifyUser, transactionsController.filterTransactions);

module.exports = Router;
