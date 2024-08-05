const transactionsSchema=require("../model/transactionsModel")
const accountSchema=require("../model/accountsModel")
const userSchema=require("../model/userModel")

class transactionsController {
    //[create tran expense]
    async createExpenseTransactions(req,res) {
        try {
            const {accountId,userId,categoryId}=req.params
            const findAccount=await accountSchema.findById(accountId)
            const {transaction_name,desc_transaction,is_fixed,amount,transaction_date}=req.body
            findAccount.balance-=amount
            await findAccount.save() 
            const newExpenseTrans =new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed,
                amount,
                type : "expense",
                transaction_date: new Date(transaction_date),
                user: userId,
                account: accountId,
                category:categoryId,
                incomeType:null
            })
            await newExpenseTrans.save()
            return res.status(200).json({
                message:"success",
                newExpenseTrans
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[create tran income]
    async createIncomeTransactions(req,res) {
        try {
            const {accountId,incomeTypeId,userId}=req.params
            const {transaction_name,desc_transaction,is_fixed,amount,transaction_date}=req.body
            const findAccount=await accountSchema.findById(accountId)
            findAccount.balance+=amount
            await findAccount.save()

            const newTranIncome =new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed,amount,
                type : "income",
                transaction_date,
                user: userId,
                account: accountId,
                incomeType: incomeTypeId,
                category:null
            })
            await newTranIncome.save()
            return res.status(200).json({
                message:"success",
                newTranIncome
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
