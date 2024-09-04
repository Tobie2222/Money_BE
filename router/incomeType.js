const express=require("express")
const Router=express.Router()
const uploadCloud=require("../config/upload/cloudinary.config")
const {verifyTokenUser,verifyTokenAdmin }=require("../middleware/verifyToken")
const incomeTypeController=require("../controller/incomeTypeController")

// [createIncomeType]
Router.post('/createIncomeTypeG',uploadCloud.single("image"),verifyTokenAdmin,incomeTypeController.createIncomeTypeGlobal)

// [createIncomeType]
Router.post('/createIncomeType/:userId',uploadCloud.single("image"),verifyTokenUser,incomeTypeController.createIncomeTypeByUser)

// [delete IncomeType]
Router.delete('/deleteIncomeType/:incomeTypeId/:userId',verifyTokenUser,incomeTypeController.deleteIncomeType)

//[getAllIncomeType]
Router.get('/getAllIncomeType/:userId',verifyTokenUser,incomeTypeController.getAllIncomeType)

module.exports=Router