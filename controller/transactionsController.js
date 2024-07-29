const transactionsSchema=require("../model/transactionsModel")


class transactionsController {
    async createTransactions(req,res) {
        try {
            const {id_accountType,id_user}=req.params
            const {account_name,desc_account,balance,currency}=req.body
            const newAccount =new accountSchema({
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
    async getAllTransactionsByUser(req,res) {
        try {
            const {userId}=req.params
            const allAccountByUser=await accountSchema.find({user: userId})
            return res.status(200).json({
                message:"success",
                allAccountByUser
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getDetailTransactions(req,res) {
        try {
            const {accountId}=req.params
            
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async updateTransactions(req,res) {
        try {

        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteTransactions(req,res) {
        try {

        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new transactionsController
