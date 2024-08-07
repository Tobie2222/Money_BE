const SavingSchema=require("../model/savingModel")
const transactionsSchema=require("../model/transactionsModel")

class savingController {
    async createSaving(req,res) {
        try {
            const {id_accountType,id_user}=req.params
            const {account_name,desc_account,balance,currency}=req.body
            const newAccount =new SavingSchema({
                account_name,
                desc_account,
                balance,
                currency,
                user: id_user,
                accountType: id_accountType
            })
            await newAccount.save()
            return res.status(200).json({
                message:"success"
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getAllSavingByUser(req, res) {
        try {
            const { userId } = req.params
            const allAccountByUser = await SavingSchema.find({ user: userId })
            return res.status(200).json({
                message: "Success",
                allAccountByUser
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            })
        }
    }
    async  getSavingDetails(req, res) {
        try {
            const { accountId } = req.params
            const account = await SavingSchema.findById(accountId)
                .populate({
                    path: 'transactions', 
                    select: 'transaction_name amount type transaction_date' 
                })
            return res.status(200).json({
                message: 'Success',
                findAccount: account
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            });
        }
    }
    async updateSaving(req,res) {
        try {
            const {accountId}=req.params
            await SavingSchema.findByIdAndUpdate(accountId,req.body)
            return res.status(200).json({
                message: "success",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteSaving(req,res) {
        try {
            const {accountId,transactionId}=req.params
            await SavingSchema.findByIdAndDelete(accountId)
            await transactionsSchema.updateMany({_id:transactionId},{$pull: {account:null}})
            return res.status(200).json({
                message: "success",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new savingController
