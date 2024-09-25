const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const incomeTypeController = require("../controller/incomeTypeController");

// [Create Income Type - Global] - Admin only
Router.post('/createIncomeTypeG', verifyAdmin, incomeTypeController.createIncomeTypeGlobal);

// [Create Income Type by User] - User specific
Router.post('/createIncomeType/:userId', verifyUser, incomeTypeController.createIncomeTypeByUser);

// [Delete Income Type] - User specific
Router.delete('/deleteIncomeType/:incomeTypeId/:userId', verifyUser, incomeTypeController.deleteIncomeType);

// [Get All Income Types] - User specific
Router.get('/getAllIncomeType/:userId', verifyUser, incomeTypeController.getAllIncomeType);

// [Update Income Type] - User specific
Router.put('/updateIncomeType/:incomeTypeId/:userId', verifyUser, incomeTypeController.updateIncomeType);

module.exports = Router;
