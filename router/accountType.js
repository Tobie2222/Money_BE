const express = require("express");
const Router = express.Router();
const { verifyAdmin, verifyUser } = require("../middleware/verifyToken");
const accountTypeController = require("../controller/accountTypeController");

// [Create Account Type] - Admin only
Router.post('/createTypeAccount', verifyAdmin, accountTypeController.createAccountType);

// [Get All Account Types] - User access
Router.get('/getAllTypeAccount/:userId', verifyUser, accountTypeController.getAllAccountType);

// [Delete Account Type] - Admin only
Router.delete('/deleteTypeAccount/:id', verifyAdmin, accountTypeController.deleteAccountType);

module.exports = Router;
