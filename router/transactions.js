const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../middleware/verifyToken");
const transactionsController = require("../controller/transactionsController");

// [Create Expense Transaction] - User specific
Router.post('/transactions/expense/:accountId/:userId/:categoryId', verifyUser, transactionsController.createExpenseTransactions);

// [Create Income Transaction] - User specific
Router.post('/transactions/income/:accountId/:userId/:incomeTypeId', verifyUser, transactionsController.createIncomeTransactions);

// [Get All Income Transactions] - User specific
Router.get('/transactions/income/:userId', verifyUser, transactionsController.getAllTranIncome);

// [Get All Expense Transactions] - User specific
Router.get('/transactions/expense/:userId', verifyUser, transactionsController.getAllTranExpense);

// [Delete Transaction] - User specific
Router.delete('/transactions/:tranId/:userId', verifyUser, transactionsController.deleteTransaction);

// [Update Transaction] - User specific
Router.put('/transactions/:tranId/:userId/:type', verifyUser, transactionsController.updateTransaction);

// [Get Transaction Details] - User specific
Router.get('/transactions/:tranId/:userId', verifyUser, transactionsController.getDetailTransactions);

// [Get All Recent Transactions] - User specific
Router.get('/transactions/recent/:userId', verifyUser, transactionsController.getRecentTranByUser);

// [Get Average Transactions in Month] - User specific
Router.get('/transactions/average/month/:userId/:slug_user', verifyUser, transactionsController.getAvgTranInMonth);

// [Get Monthly Sum of Transactions] - User specific
Router.get('/transactions/sum/month/:userId/:slug_user', verifyUser, transactionsController.getMonthlySumTran);

// [Get Average Income and Expense per Month] - User specific
Router.get('/transactions/average/monthly/:userId/:slug_user', verifyUser, transactionsController.getAverageIncomeAndExpensePerMonth);

// [Find Transactions by Keyword] - User specific
Router.get('/transactions/search/:userId', verifyUser, transactionsController.findTransactions);

// [Filter Transactions by Keyword] - User specific
Router.get('/transactions/filter/:userId', verifyUser, transactionsController.filterTransactions);

module.exports = Router;
