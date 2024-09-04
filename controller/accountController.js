const accountSchema=require("../model/accountsModel")
const transactionsSchema=require("../model/transactionsModel")
const savingsTransactionsSchema=require("../model/savingTransactionModel")

class accountController {
    //[create account]
    async createAccount(req,res) {
        try {
            const {id_accountType,userId}=req.params
            const {account_name,desc_account,balance}=req.body
            const findAccount=await accountSchema.findOne({account_name})
            if (findAccount) return res.status(403).json({
                message: "Tài khoản đã tồn tại!"
            })
            const newAccount =new accountSchema({
                account_name,
                desc_account,
                balance,
                user: userId,
                accountType: id_accountType
            })
            await newAccount.save()
            return res.status(200).json({
                message:"Tạo tài khoản mới thành công"
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
                .populate({
                    path: 'accountType',
                    select: 'account_type_name account_type_image', 
                })
            return res.status(200).json({
                message: "Success",
                allAccountByUser
            })
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            })
        }
    }
    //[getDetail account]
    async getAccountDetails(req, res) {
        try {
            const { accountId } = req.params
            const account = await accountSchema.findById(accountId)
            .populate({
                path: 'transactions',
                select: 'transaction_name desc_transaction amount type transaction_date incomeType',
                populate: [
                    {
                        path: 'incomeType',
                        select: 'income_type_image'
                    },
                    {
                        path: 'category',
                        select: 'categories_image' // Chọn các trường bạn muốn từ category
                    }
                ]
            })
            if (!account) {
                return res.status(404).json({
                    message: 'Tài khoản không tồn tại !',
                })
            }
            const incomeTransactions = account.transactions.filter(transaction => transaction.type === 'income')
            const expenseTransactions = account.transactions.filter(transaction => transaction.type === 'expense')
            return res.status(200).json({
                message: 'Success',
                accountDetails: {
                    account_name: account.account_name,
                    desc_account: account.desc_account,
                    balance: account.balance,
                    incomeTransactions,
                    expenseTransactions,
                }
            })
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`,
            })
        }
    }
    
    //[update account]
    async updateAccount(req, res) {
        try {
            const { accountId } = req.params
            const account = await accountSchema.findById(accountId)
            if (!account) {
                return res.status(404).json({
                    message: "Tài khoản không tồn tại !",
                })
            }
            const updatedAccount = await accountSchema.findByIdAndUpdate(
                accountId,
                {
                    account_name: req.body?.account_name,
                    desc_account: req.body?.desc_account,
                    balance: req?.body.balance,
                },
                { new: true } 
            )
            return res.status(200).json({
                message: "Cập nhật tài khoản thành công",
                account: updatedAccount
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`,
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
            const {accountId}=req.params
            await accountSchema.findByIdAndDelete(accountId)
            await transactionsSchema.updateMany({account:accountId},{ $set: {account:null}})
            await savingsTransactionsSchema.updateMany({account:accountId},{ $set: {account:null}})
            return res.status(200).json({
                message: "Xóa tài khoản thành công",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new accountController
