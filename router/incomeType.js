const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const incomeTypeController = require("../controller/incomeTypeController");

// [Create Income Type - Global] - Admin only
Router.post('/income-types/global', verifyAdmin, incomeTypeController.createIncomeTypeGlobal);

// [Create Income Type by User] - User specific
Router.post('/income-types/:userId', verifyUser, incomeTypeController.createIncomeTypeByUser);

// [Delete Income Type] - User specific
Router.delete('/income-types/:incomeTypeId/:userId', verifyUser, incomeTypeController.deleteIncomeType);

// [Get All Income Types] - User specific
Router.get('/income-types/:userId', verifyUser, incomeTypeController.getAllIncomeType);

// [Update Income Type] - User specific
Router.put('/income-types/:incomeTypeId/:userId', verifyUser, incomeTypeController.updateIncomeType);

module.exports = Router;
