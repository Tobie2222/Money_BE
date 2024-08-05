const accountSchema=require("../model/accountsModel")
const transactionsSchema=require("../model/transactionsModel")

class accountController {
    //[create account]
    async createAccount(req,res) {
        try {
            const {id_accountType,userId}=req.params
            const {account_name,desc_account,balance,currency}=req.body
            const findAccount=await accountSchema.findOne({account_name})
            if (findAccount) return res.status(403).json({
                message: "Tài khoản đã tồn tại!"
            })
            const newAccount =new accountSchema({
                account_name,
                desc_account,
                balance,
                currency,
                user: userId,
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
    //[get all account]
    async getAllAccountByUser(req, res) {
        try {
            const { userId } = req.params
            const allAccountByUser = await accountSchema.find({ user: userId })
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
    //[getDetail account]
    async  getAccountDetails(req, res) {
        try {
            const { accountId } = req.params
            const account = await accountSchema.findById(accountId)
            const allTran=await transactionsSchema.find({account: accountId})
            return res.status(200).json({
                message: 'Success',
                account,
                allTran
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            })
        }
    }
    //[update account]
    async updateAccount(req,res) {
        try {
            const {accountId}=req.params
            await accountSchema.findByIdAndUpdate(accountId,req.body)
            return res.status(200).json({
                message: "success",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

    //[delete account]
    async getTotalBalance(req,res) {
        try {
            let totalBalance
            const {userId}=req.params
            const allAccount=await accountSchema.find({user:userId})
            totalBalance=allAccount.reduce((balance,account)=>account.balance+balance,0)
            return res.status(200).json({
                message: "success",
                allAccount,
                totalBalance
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[delete account]
    async deleteAccount(req,res) {
        try {
            const {accountId,transactionId}=req.params
            await accountSchema.findByIdAndDelete(accountId)
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


module.exports=new accountController
