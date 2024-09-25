const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const categoriesController = require("../controller/categoriesController");

// [Create Category - Global] - Admin only
Router.post('/categories/global', verifyAdmin, categoriesController.createCatGlobal);

// [Create Category by User] - User specific
Router.post('/categories/user/:userId', verifyUser, categoriesController.createCategoriesByUser);

// [Get All Categories by User] - User specific
Router.get('/categories/:userId', verifyUser, categoriesController.getAllCategories);

// [Update Category] - User specific
Router.put('/categories/:catId/:userId', verifyUser, categoriesController.updateCategories);

// [Delete Category] - User specific
Router.delete('/categories/:catId/:userId', verifyUser, categoriesController.deleteCategories);

module.exports = Router;
