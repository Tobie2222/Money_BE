const express = require("express");
const Router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");
const categoriesController = require("../controller/categoriesController");

// [Create Category - Global] - Admin only
Router.post('/createCat', verifyAdmin, categoriesController.createCatGlobal);

// [Create Category by User] - User specific
Router.post('/createCatByUser/:userId', verifyUser, categoriesController.createCategoriesByUser);

// [Get All Categories by User] - User specific
Router.get('/getAllCat/:userId', verifyUser, categoriesController.getAllCategories);

// [Update Category] - User specific
Router.put('/updateCat/:catId/:userId', verifyUser, categoriesController.updateCategories);

// [Delete Category] - User specific
Router.delete('/deleteCat/:catId/:userId', verifyUser, categoriesController.deleteCategories);

module.exports = Router;
