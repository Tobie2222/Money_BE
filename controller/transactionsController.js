const transactionsSchema = require("../model/transactionsModel")
const accountSchema = require("../model/accountsModel")

const userSchema = require("../model/userModel")


class transactionsController {
    //[create tran expense]
    async createExpenseTransactions(req, res) {
        try {
            const { accountId, userId, categoryId } = req.params
            const findAccount = await accountSchema.findById(accountId)
            const findUser=await userSchema.findById(userId)
            const { transaction_name, desc_transaction, amount, transaction_date } = req.body
            findAccount.balance -= amount
            if (findAccount.balance<amount) {
                return res.status(403).json({
                    message: "Ví của bạn không đủ để trả!"
                })
            }
            await findAccount.save()
            const newExpenseTrans = new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed: false,
                amount,
                type: "expense",
                transaction_date: new Date(transaction_date),
                user: userId,
                account: accountId,
                category: categoryId,
                incomeType: null,
                slug_user: findUser.slug_user 
            })
            await accountSchema.updateOne({_id:accountId},{$push:{transactions: newExpenseTrans._id}})
            await newExpenseTrans.save()
            return res.status(200).json({
                message: "Tạo mới khoản chi thành công",
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
            const findUser=await userSchema.findById(userId)
            const { transaction_name, desc_transaction, amount, transaction_date } = req.body
            const findAccount = await accountSchema.findById(accountId)
            findAccount.balance += amount
            await findAccount.save()
            const newTranIncome = new transactionsSchema({
                transaction_name,
                desc_transaction,
                is_fixed:false
                , amount,
                type: "income",
                transaction_date,
                user: userId,
                account: accountId,
                incomeType: incomeTypeId,
                category: null,
                slug_user: findUser.slug_user 
            })
            await accountSchema.updateOne({_id:accountId},{$push:{transactions: newTranIncome._id}})
            await newTranIncome.save()
            return res.status(200).json({
                message: "Tạo mới khoản thu thành công",
                newTranIncome
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getRecentTranByUser(req, res) {
        try {
            const { userId } = req.params
            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
            const recentIncomeTransactions = await transactionsSchema.find({
                user: userId,
                type: "income",
                transaction_date: { $gte: twoDaysAgo } 
            })
                .populate({
                    path: 'incomeType',
                    select: 'income_type_image', 
                })
                .sort({ transaction_date: -1 }) 
                .limit(5)
            const recentExpenseTransactions = await transactionsSchema.find({
                    user: userId,
                    type: "expense",
                    transaction_date: { $gte: twoDaysAgo } 
                })
                    .populate({
                        path: 'category',
                        select: 'categories_image', 
                    })
                    .sort({ transaction_date: -1 }) 
                    .limit(5)
            return res.status(200).json({
                message: "success",
                allTranRecent: {
                    tranIncome: recentIncomeTransactions,
                    tranExpense: recentExpenseTransactions
                }
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err}`
            })
        }
    }
    //getAll TranIncome
    async getAllTranIncome(req, res) {
        try {
            const { userId } = req.params
            const findTran = await transactionsSchema.find({
                user: userId,
                type: "income" 
            })
            .populate({
                path: 'incomeType',
                select: 'income_type_image', 
            })
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
    //getAll TranExpense
    async getAllTranExpense(req, res) {
        try {
            const { userId } = req.params
            const findTran = await transactionsSchema.find({
                user: userId,
                type: "expense" 
            })
            .populate({
                path: 'category',
                select: 'categories_image', 
            })
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
    //delete tran
    async deleteTran(req, res) {
        try {
            const { tranId } = req.params
            const transaction = await transactionsSchema.findById(tranId)
            if (!transaction) {
                return res.status(404).json({
                    message: "Giao dịch không tồn tại"
                });
            }
            await accountSchema.updateOne(
                { _id: transaction.account }, 
                { $pull: { transactions: tranId } } 
            )
            await transactionsSchema.findByIdAndDelete(tranId)
            return res.status(200).json({
                message: "Xóa thành công"
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err}`
            })
        }
    }
    // Update transaction
    async updateTransactions(req, res) {
        try {
            const { tranId, type } = req.params
            const { desc_transaction, transaction_name, amount } = req.body
            const findTran = await transactionsSchema.findById(tranId)
            if (!findTran) {
                return res.status(404).json({ message: "Giao dịch không tìm thấy" })
            }
            const findAccount = await accountSchema.findById(findTran.account)
            if (!findAccount) {
                return res.status(404).json({ message: "Tài khoản không tìm thấy" })
            }
            if (type === "expense") {
                findAccount.balance += findTran.amount
                findAccount.balance -= amount
            } else {
                findAccount.balance -= findTran.amount
                findAccount.balance += amount
            }
            await findAccount.save()
            await transactionsSchema.findByIdAndUpdate(tranId, {
                desc_transaction,
                transaction_name,
                amount
            }, { new: true })
            return res.status(200).json({
                message: "Cập nhật thành công",
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            })
        }
    }

    //get Detail Transactions
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
    //get Avg balance in month
    async getAvgTranInMonth(req, res) {
        try {
            const { slug_user } = req.params;
            const { month, year } = req.query;
    
            // Ngày đầu tháng và ngày cuối tháng hiện tại
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
            // Tính tổng chi và thu cho tháng hiện tại
            const totals = await transactionsSchema.aggregate([
                {
                    $match: {
                        slug_user: slug_user,
                        transaction_date: {
                            $gte: startDate,
                            $lte: endDate
                        },
                    }
                },
                {
                    $group: {
                        _id: { type: "$type" },
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]);
    
            // Tính số ngày trong tháng hiện tại
            const daysInMonth = new Date(year, month, 0).getDate();
            const totalExpenseThisMonth = totals.find(item => item._id.type === "expense")?.totalAmount || 0;
            const totalIncomeThisMonth = totals.find(item => item._id.type === "income")?.totalAmount || 0;
            const avgExpenseThisMonth = totalExpenseThisMonth / daysInMonth;
            const avgIncomeThisMonth = totalIncomeThisMonth / daysInMonth;
    
            // Ngày đầu tháng và ngày cuối tháng trước
            const prevStartDate = new Date(year, month - 2, 1);
            const prevEndDate = new Date(year, month - 1, 0, 23, 59, 59, 999);
    
            // Tính tổng chi và thu cho tháng trước
            const totalsPrev = await transactionsSchema.aggregate([
                {
                    $match: {
                        slug_user: slug_user,
                        transaction_date: {
                            $gte: prevStartDate,
                            $lte: prevEndDate
                        },
                    }
                },
                {
                    $group: {
                        _id: { type: "$type" },
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]);
    
            // Tính số ngày trong tháng trước
            const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
            const totalExpensePrevMonth = totalsPrev.find(item => item._id.type === "expense")?.totalAmount || 0;
            const totalIncomePrevMonth = totalsPrev.find(item => item._id.type === "income")?.totalAmount || 0;
            const avgExpensePrevMonth = totalExpensePrevMonth / daysInPrevMonth;
            const avgIncomePrevMonth = totalIncomePrevMonth / daysInPrevMonth;
    
            return res.status(200).json({
                message: "success",
                data: {
                    thisMonth: {
                        totalExpense: totalExpenseThisMonth,
                        totalIncome: totalIncomeThisMonth,
                        avgExpensePerDay: avgExpenseThisMonth,
                        avgIncomePerDay: avgIncomeThisMonth
                    },
                    prevMonth: {
                        totalExpense: totalExpensePrevMonth,
                        totalIncome: totalIncomePrevMonth,
                        avgExpensePerDay: avgExpensePrevMonth,
                        avgIncomePerDay: avgIncomePrevMonth
                    }
                }
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            });
        }
    }
    async getMonthlySumTran(req, res) {
        const { slug_user } = req.params
        const { year } = req.query
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: "Năm không hợp lệ" })
        }
        try {
            const transactions = await transactionsSchema.aggregate([
                {
                    $match: {
                        slug_user:slug_user,
                        transaction_date: {
                            $gte: new Date(`${year}-01-01`),
                            $lt: new Date(`${parseInt(year) + 1}-01-01`)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$transaction_date" },
                            type: "$type"
                        },
                        totalAmount: { $sum: "$amount" }
                    }
                },
                {
                    $group: {
                        _id: "$_id.month",
                        income: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0]
                            }
                        },
                        expense: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0]
                            }
                        }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ])
            const monthlyAverages = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                income: 0,
                expense: 0,
                net: 0
            }))
            transactions.forEach(month => {
                const monthIndex = month._id - 1
                monthlyAverages[monthIndex] = {
                    month: month._id,
                    income: month.income || 0,
                    expense: month.expense || 0,
                    net: (month.income || 0) - (month.expense || 0)
                }
            })
            return res.status(200).json({
                message: "Success",
                monthlyAverages
            })
        } catch (err) {
            console.error('Error fetching monthly averages:', err);
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            })
        }
    }
    async getAverageIncomeAndExpensePerMonth(req, res) {
        const { slug_user } = req.params
        const { year } = req.query
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: "Năm không hợp lệ" })
        }
        try {
            const results = await transactionsSchema.aggregate([
                {
                    $match: {
                        slug_user:slug_user,
                        transaction_date: {
                            $gte: new Date(`${year}-01-01`),
                            $lt: new Date(`${parseInt(year) + 1}-01-01`)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$transaction_date" },
                            type: "$type"
                        },
                        totalAmount: { $sum: "$amount" },
                        count: { $sum: 1 }  // Đếm số lượng giao dịch
                    }
                },
                {
                    $group: {
                        _id: "$_id.month",
                        income: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0]
                            }
                        },
                        expense: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0]
                            }
                        },
                        incomeCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "income"] }, "$count", 0]
                            }
                        },
                        expenseCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.type", "expense"] }, "$count", 0]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        averageIncome: {
                            $cond: [
                                { $eq: ["$incomeCount", 0] },
                                0,
                                { $divide: ["$income", "$incomeCount"] }
                            ]
                        },
                        averageExpense: {
                            $cond: [
                                { $eq: ["$expenseCount", 0] },
                                0,
                                { $divide: ["$expense", "$expenseCount"] }
                            ]
                        }
                    }
                },
                {
                    $sort: { month: 1 }
                }
            ])
            // Fill in months with no data
            const monthlyAverages = Array.from({ length: 12 }, (_, i) => {
                const monthData = results.find(item => item.month === (i + 1));
                return {
                    month: i + 1,
                    averageIncome: monthData ? monthData.averageIncome : 0,
                    averageExpense: monthData ? monthData.averageExpense : 0
                }
            })
            return res.status(200).json({
                message: "Success",
                monthlyAverages
            });
        } catch (err) {
            console.error('Error fetching average income and expense:', err);
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            })
        }
    }
    async findTransactions(req, res) {
        try {
            const { keyword,type } = req.query
            const findTran = await transactionsSchema.find({
                type: type,
                transaction_name: {
                    $regex: keyword, $options: 'i' // Tìm kiếm không phân biệt hoa thường
                }
            })
            .populate({
                path: 'category',
                select: 'categories_image', 
            })
            .populate({
                path: 'incomeType',
                select: 'income_type_image', 
            })
            return res.status(200).json({
                message: "Tìm kiếm thành công",
                findTran
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async filterTransactions(req, res) {
        try {
            const { date, categoryId ,type} = req.query
            let filterConditions = {}
            // Nếu có tham số lọc theo thời gian
            if (date) {
                const selectedDate = new Date(date)
                filterConditions.transaction_date = {
                    $gte: selectedDate.setHours(0, 0, 0, 0), // Ngày bắt đầu (00:00:00)
                    $lt: new Date(selectedDate.setDate(selectedDate.getDate() + 1)).setHours(0, 0, 0, 0) // Ngày kết thúc (23:59:59)
                }
            }
            if (categoryId) {
                filterConditions.category = categoryId
            }
            if (Object.keys(filterConditions).length===0) {
                return res.status(403).json({
                    message: "Không có kết quả tìm kiếm!",
                })
            }
            const transactions = await transactionsSchema.find({...filterConditions,type: type})
            .populate({
                path: 'category',
                select: 'categories_image', 
            })
            return res.status(200).json({
                message: "Tìm kiếm thành công",
                transactions
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
}
module.exports = new transactionsController
