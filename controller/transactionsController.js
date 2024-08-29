const transactionsSchema = require("../model/transactionsModel")
const accountSchema = require("../model/accountsModel")
const userSchema = require("../model/userModel")

class transactionsController {
    //[create tran expense]
    async createExpenseTransactions(req, res) {
        try {
            const { accountId, userId, categoryId } = req.params
            const findAccount = await accountSchema.findById(accountId)
            const { transaction_name, desc_transaction, is_fixed, amount, transaction_date } = req.body
            findAccount.balance -= amount
            await findAccount.save()
            const newExpenseTrans = new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed,
                amount,
                type: "expense",
                transaction_date: new Date(transaction_date),
                user: userId,
                account: accountId,
                category: categoryId,
                incomeType: null
            })
            await newExpenseTrans.save()
            return res.status(200).json({
                message: "success",
                newExpenseTrans
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[create tran income]
    async createIncomeTransactions(req, res) {
        try {
            const { accountId, incomeTypeId, userId } = req.params
            const { transaction_name, desc_transaction, is_fixed, amount, transaction_date } = req.body
            const findAccount = await accountSchema.findById(accountId)
            findAccount.balance += amount
            await findAccount.save()

            const newTranIncome = new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed, amount,
                type: "income",
                transaction_date,
                user: userId,
                account: accountId,
                incomeType: incomeTypeId,
                category: null
            })
            await newTranIncome.save()
            return res.status(200).json({
                message: "success",
                newTranIncome
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getRecentTransactionsByUser(req, res) {
        try {
            const { userId } = req.params
            const allRecentTranByUser = await accountSchema.find({ user: userId })
                .sort({ transaction_date: -1 })
                .limit(10)
            return res.status(200).json({
                message: "success",
                allRecentTranByUser
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getDetailTransactions(req, res) {
        try {
            const { tranId } = req.params
            const findTran = await transactionsSchema.findById(tranId)
            return res.status(200).json({
                message: "success",
                findTran
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async updateTransactions(req, res) {
        try {
            const { tranId } = req.params
            const findTran = await transactionsSchema.findByIdAndUpdate(tranId, req.body, { new: true })
            return res.status(200).json({
                message: "success",
                findTran
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteTransactions(req, res) {
        try {
            const { tranId } = req.params
            await transactionsSchema.findByIdDelete(tranId)
            return res.status(200).json({
                message: "success"
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    // async getMonthlyAverage(req, res) {
    //     const { year } = req.params 
    //     if (!year || isNaN(year)) {
    //         return res.status(400).json({ message: "Năm không hợp lệ" })
    //     }
    //     try {
    //         const transactions = await Transaction.aggregate([
    //             {
    //                 $match: {
    //                     transaction_date: {
    //                         $gte: new Date(`${year}-01-01`),
    //                         $lt: new Date(`${parseInt(year) + 1}-01-01`)
    //                     }
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: {
    //                         month: { $month: "$transaction_date" },
    //                         type: "$type"
    //                     },
    //                     totalAmount: { $sum: "$amount" }
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: "$_id.month",
    //                     income: {
    //                         $sum: {
    //                             $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0]
    //                         }
    //                     },
    //                     expense: {
    //                         $sum: {
    //                             $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0]
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 $sort: { _id: 1 }
    //             }
    //         ])
    //         const monthlyAverages = transactions.map(month => ({
    //             month: month._id,
    //             income: month.income || 0, 
    //             expense: month.expense || 0,
    //             net: (month.income || 0) - (month.expense || 0)
    //         }))

    //         return res.status(200).json({
    //             message: "Success",
    //             monthlyAverages
    //         })
    //     } catch (err) {
    //         console.error('Error fetching monthly averages:', err);
    //         return res.status(500).json({
    //             message: `Lỗi: ${err.message}`
    //         })
    //     }
    // }
}


module.exports = new transactionsController
