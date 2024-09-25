const express = require("express");
const Router = express.Router();
const { verifyUser } = require("../middleware/verifyToken");
const savingController = require("../controller/savingController");

// [Create Saving] - User specific
Router.post('/savings/:userId', verifyUser, savingController.createSaving);
// [Get All Savings by User] - User specific
Router.get('/savings/:userId', verifyUser, savingController.getAllSavingByUser);
// [Get Saving Details] - User specific
Router.get('/savings/:savingId/details/:userId', verifyUser, savingController.getSavingDetails);
// [Update Saving] - User specific
Router.put('/savings/:savingId/:userId', verifyUser, savingController.updateSaving);
// [Delete Saving] - User specific
Router.delete('/savings/:savingId/:userId', verifyUser, savingController.deleteSaving);
// [Deposit Money to Saving] - User specific
Router.post('/savings/:savingId/deposit/:accountId/:userId', verifyUser, savingController.depositMoneySaving);
// [Get All Deposits for Savings] - User specific
Router.get('/savings/:userId/deposits', verifyUser, savingController.getAllDepositMoneySaving);

module.exports = Router;
