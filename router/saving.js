const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../middleware/verifyToken");
const savingController = require("../controller/savingController");

// [Create Saving] - User specific
Router.post('/createSaving/:userId', verifyUser, savingController.createSaving);
// [Get All Savings by User] - User specific
Router.get('/getAllSaving/:userId', verifyUser, savingController.getAllSavingByUser);
// [Get Saving Details] - User specific
Router.get('/getDetailSaving/:savingId/:userId', verifyUser, savingController.getSavingDetails);
// [Update Saving] - User specific
Router.put('/updateSaving/:savingId/:userId', verifyUser, savingController.updateSaving);
// [Delete Saving] - User specific
Router.delete('/deleteSaving/:savingId/:userId', verifyUser, savingController.deleteSaving);
// [Deposit Money to Saving] - User specific
Router.post('/depositMoney/:savingId/:accountId/:userId', verifyUser, savingController.depositMoneySaving);
// [Get All Deposits for Savings] - User specific
Router.get('/getAllDeposits/:userId', verifyUser, savingController.getAllDepositMoneySaving);

module.exports = Router;
