const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")
const categoriesController=require("../controller/categoriesController")

// [createCategories global] 
Router.post('/createCat',uploadCloud.single("image"),categoriesController.createCatGlobal)
// [createCategories by user]
Router.post('/createCat/:userId',verifyTokenUser,uploadCloud.single("image"),categoriesController.createCategoriesByUser)
// [updateCategories]
Router.get('/getAllCat/:userId',verifyTokenUser,categoriesController.getAllCategories)

// [updateCategories]
Router.put('/updateCat/:userId',verifyTokenUser,categoriesController.updateCategories)

//[deleteCategories]
Router.delete('/deleteCategories/:categoriesId',verifyTokenUser,categoriesController.deleteCategories)


module.exports=Router