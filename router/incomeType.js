const express=require("express")
const Router=express.Router()
const uploadCloud=require("../config/upload/cloudinary.config")

const incomeTypeController=require("../controller/incomeTypeController")

// [createIncomeType]
Router.post('/createIncomeType',uploadCloud.single("image"),incomeTypeController.createIncomeType)

//[getAllIncomeType]
Router.get('/getAllIncomeType',incomeTypeController.getAllIncomeType)

module.exports=Router