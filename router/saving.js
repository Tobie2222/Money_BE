const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")
const uploadCloud=require("../config/upload/cloudinary.config")
const savingController=require("../controller/savingController")

// [createSaving]
Router.post('/createSaving/:userId',uploadCloud.single("image"),verifyTokenUser,savingController.createSaving)

//[getAllSavingBy user]
Router.get('/getAllSaving/:userId',verifyTokenUser,savingController.getAllSavingByUser)

//[getDetailSaving]
Router.get('/getDetailSaving/:savingId/:userId',verifyTokenUser,savingController.getSavingDetails)

// [updateSaving]
Router.put('/updateSaving/:savingId/:userId',verifyTokenUser,savingController.updateSaving)

//[deleteSaving]
Router.delete('/deleteSaving/:savingId/:userId',verifyTokenUser,savingController.deleteSaving)

// [deposits money to saving]
Router.post('/depositMoney/:savingId/:accountId/:userId',verifyTokenUser,savingController.depositMoneySaving)


// [get all deposits money to saving]
Router.get('/getAllDeposits/:userId',verifyTokenUser,savingController.getAllDepositMoneySaving)

module.exports=Router