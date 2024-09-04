const express=require("express")
const Router=express.Router()
const uploadCloud=require("../config/upload/cloudinary.config")
const {verifyTokenUser,verifyTokenAdmin }=require("../middleware/verifyToken")
const categoriesController=require("../controller/categoriesController")


// [createCategories global] 
Router.post('/createCat',verifyTokenAdmin,uploadCloud.single("image"),categoriesController.createCatGlobal)
// [createCategories by user]
Router.post('/createCatByUser/:userId',verifyTokenUser,uploadCloud.single("image"),categoriesController.createCategoriesByUser)

// [getAll Categories]
Router.get('/getAllCat/:userId',verifyTokenUser,categoriesController.getAllCategories)

// [updateCategories]
Router.put('/updateCat/:userId',verifyTokenUser,categoriesController.updateCategories)

//[deleteCategories]
Router.delete('/deleteCat/:catId/:userId',verifyTokenUser,categoriesController.deleteCategories)


module.exports=Router