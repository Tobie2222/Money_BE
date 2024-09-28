const express = require("express");
const Router = express.Router();
const {verifyUser}   = require("../middleware/verifyToken");
const accountController = require("../controller/accountController");

// [Create Account] - Requires account type and userId
Router.post('/createAccounts/:id_accountType/:userId', verifyUser, accountController.createAccount);
//[Update Account] - Requires accountId and userId
Router.put('/updateAccounts/:accountId/:userId', verifyUser, accountController.updateAccount);
// [Get Account Details] - Requires accountId and userId
Router.get('/getDetailAccounts/:accountId/:userId', verifyUser, accountController.getAccountDetail);
// [Get All Accounts by User] - Requires userId
Router.get('/getAllAccount/:userId', verifyUser, accountController.getAllAcountByUser);
// [Get Total Balance by User] - Requires userId
Router.get('/getBalance/:userId', verifyUser, accountController.getTotalBalance);
// [Delete Account] - Requires accountId and userId
Router.delete('/deleteAccount/:accountId/:userId', verifyUser, accountController.deleteAccount);
module.exports = Router;
