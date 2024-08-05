const express=require("express")
const Router=express.Router()
const {verifyTokenUser}=require("../middleware/verifyToken")

const savingController=require("../controller/savingController")

// [createSaving]
Router.post('/createSaving/:id_accountType/:id_user',verifyTokenUser,savingController.createSaving)
// [updateSaving]
Router.put('/updateSaving/:savingId',verifyTokenUser,savingController.updateSaving)

//[getDetailSaving]
Router.get('/getDetailSaving/:savingId',verifyTokenUser,savingController.getSavingDetails)

//[getAllSaving]
Router.get('/getAllSaving/:userId',verifyTokenUser,savingController.getAllSavingByUser)

//[deleteSaving]
Router.delete('/deleteSaving/:savingId',verifyTokenUser,savingController.deleteSaving)


module.exports=Router