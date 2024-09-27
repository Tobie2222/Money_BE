const Transactions= require("../models/transactionsModel"); 
const Accounts = require("../models/accountsModel"); 
const Users = require("../models/userModel"); 
const Categories = require("../models/categoriesModel"); 
const IncomeTypes = require("../models/incomeTypeModel"); 
const { Op } = require("sequelize"); 

class TransactionsController {
    //[create tran expense]
    async createExpenseTransactions(req, res) {
        try {
            console.log(req.body);
            const { accountId, userId, categoryId } = req.params;
            const { transaction_name, desc_transaction, amount, transaction_date } = req.body;

            const findAccount = await Accounts.findByPk(accountId);
            const findUser = await Users.findByPk(userId);

            if (!findAccount) {
                return res.status(404).json({ message: "Tài khoản không tìm thấy" });
            }

            if (findAccount.balance < amount) {
                return res.status(403).json({ message: "Ví của bạn không đủ để trả!" });
            }

            findAccount.balance -= amount;
            await findAccount.save();

            const newExpenseTrans = await Transactions.create({
                transaction_name,
                desc_transaction,
                is_fixed: false,
                amount,
                transactions_type: "expense",
                transaction_date: new Date(transaction_date),
                user_id: userId,
                account_id: accountId,
                categoryId: categoryId,
                incomeTypeId: null,
                slug_user: findUser.slug_user
            });

            return res.status(200).json({
                message: "Tạo mới khoản chi thành công",
                newExpenseTrans
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi ${err.message}` });
        }
    }

    //[create tran income]
    async createIncomeTransactions(req, res) {
        try {
            const { accountId, incomeTypeId, userId } = req.params;
            const { transaction_name, desc_transaction, amount, transaction_date } = req.body;

            const findAccount = await Accounts.findByPk(accountId);
            const findUser = await Users.findByPk(userId);

            if (!findAccount) {
                return res.status(404).json({ message: "Tài khoản không tìm thấy" });
            }

            findAccount.balance += amount;
            await findAccount.save();

            const newIncomeTrans = await Transactions.create({
                transaction_name,
                desc_transaction,
                is_fixed: false,
                amount,
                type: "income",
                transaction_date: new Date(transaction_date),
                userId: userId,
                accountId: accountId,
                incomeTypeId: incomeTypeId,
                categoryId: null,
                slug_user: findUser.slug_user
            });

            return res.status(200).json({
                message: "Tạo mới khoản thu thành công",
                newIncomeTrans
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi ${err.message}` });
        }
    }

    // Get recent transactions by user
    async getRecentTranByUser(req, res) {
        try {
            const { userId } = req.params;
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const recentIncomeTransactions = await Transactions.findAll({
                where: {
                    userId: userId,
                    type: "income",
                    transaction_date: { [Op.gte]: twoDaysAgo }
                },
                include: [{ model: IncomeTypes, attributes: ["income_type_image"] }],
                order: [["transaction_date", "DESC"]],
                limit: 5
            });

            const recentExpenseTransactions = await Transactions.findAll({
                where: {
                    userId: userId,
                    type: "expense",
                    transaction_date: { [Op.gte]: twoDaysAgo }
                },
                include: [{ model: Categories, attributes: ["categories_image"] }],
                order: [["transaction_date", "DESC"]],
                limit: 5
            });

            return res.status(200).json({
                message: "success",
                allTranRecent: {
                    tranIncome: recentIncomeTransactions,
                    tranExpense: recentExpenseTransactions
                }
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi ${err.message}` });
        }
    }

    //getAll TranIncome
    async getAllTranIncome(req, res) {
        try {
            const { userId } = req.params;
            const findTran = await Transactions.findAll({
                where: {
                    userId: userId,
                    type: "income"
                },
                include: [
                    {
                        model: IncomeTypes,
                        attributes: ['income_type_image']
                    }
                ]
            });
            return res.status(200).json({
                message: "success",
                findTran
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err.message}`
            });
        }
    }
    //getAll TranExpense
async getAllTranExpense(req, res) {
    try {
        const { userId } = req.params;
        const findTran = await Transactions.findAll({
            where: {
                userId: userId,
                type: "expense"
            },
            include: [
                {
                    model: Categories,
                    attributes: ['categories_image']
                }
            ]
        });
        return res.status(200).json({
            message: "success",
            findTran
        });
    } catch (err) {
        return res.status(500).json({
            message: `Lỗi ${err.message}`
        });
    }
}

    //[delete tran]
    async deleteTransaction(req, res) {
        try {
            const { transactionId } = req.params;

            const findTransaction = await Transactions.findByPk(transactionId);

            if (!findTransaction) {
                return res.status(404).json({ message: "Giao dịch không tìm thấy" });
            }

            await findTransaction.destroy();

            return res.status(200).json({
                message: "Xóa giao dịch thành công"
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi ${err.message}` });
        }
    }

    //[update tran]
    async updateTransaction(req, res) {
        try {
            const { transactionId } = req.params;
            const { transaction_name, desc_transaction, amount, transaction_date } = req.body;

            const findTransaction = await Transactions.findByPk(transactionId);

            if (!findTransaction) {
                return res.status(404).json({ message: "Giao dịch không tìm thấy" });
            }

            findTransaction.transaction_name = transaction_name || findTransaction.transaction_name;
            findTransaction.desc_transaction = desc_transaction || findTransaction.desc_transaction;
            findTransaction.amount = amount || findTransaction.amount;
            findTransaction.transaction_date = transaction_date || findTransaction.transaction_date;

            await findTransaction.save();

            return res.status(200).json({
                message: "Cập nhật giao dịch thành công",
                findTransaction
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi ${err.message}` });
        }
    }
    // get Detail Transactions
    async getDetailTransactions(req, res) {
        try {
            const { tranId } = req.params;
            const findTran = await Transactions.findByPk(tranId);
            return res.status(200).json({
                message: "success",
                findTran
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err.message}`
            });
        }
    }
    // get Avg balance in month
    async getAvgTranInMonth(req, res) {
        try {
            const { slug_user } = req.params;
            const { month, year } = req.query;

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            // Tính tổng thu nhập và chi tiêu cho tháng hiện tại
            const totals = await Transactions.findAll({
                where: {
                    userId: slug_user,
                    transaction_date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                attributes: [
                    'type',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
                ],
                group: ['type']
            });

            // Tính tổng số ngày trong tháng hiện tại
            const daysInMonth = new Date(year, month, 0).getDate();
            const totalExpenseThisMonth = totals.find(item => item.type === "expense")?.get('totalAmount') || 0;
            const totalIncomeThisMonth = totals.find(item => item.type === "income")?.get('totalAmount') || 0;
            const avgExpenseThisMonth = totalExpenseThisMonth / daysInMonth;
            const avgIncomeThisMonth = totalIncomeThisMonth / daysInMonth;

            return res.status(200).json({
                message: "success",
                data: {
                    thisMonth: {
                        totalExpense: totalExpenseThisMonth,
                        totalIncome: totalIncomeThisMonth,
                        avgExpensePerDay: avgExpenseThisMonth,
                        avgIncomePerDay: avgIncomeThisMonth
                    }
                }
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            });
        }
    }
    // get Monthly Sum Transactions
    async getMonthlySumTran(req, res) {
        const { slug_user } = req.params;
        const { year } = req.query;
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: "Năm không hợp lệ" });
        }
        try {
            const transactions = await Transactions.findAll({
                where: {
                    userId: slug_user,
                    transaction_date: {
                        [Op.between]: [new Date(`${year}-01-01`), new Date(`${parseInt(year) + 1}-01-01`)],
                    }
                },
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('transaction_date')), 'month'],
                    'type',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
                ],
                group: [Sequelize.fn('MONTH', Sequelize.col('transaction_date')), 'type'],
                order: [Sequelize.fn('MONTH', Sequelize.col('transaction_date'))]
            });

            const monthlyAverages = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                income: 0,
                expense: 0,
                net: 0
            }));

            transactions.forEach(month => {
                const monthIndex = month.get('month') - 1;
                if (month.type === 'income') {
                    monthlyAverages[monthIndex].income = month.get('totalAmount');
                } else {
                    monthlyAverages[monthIndex].expense = month.get('totalAmount');
                }
                monthlyAverages[monthIndex].net = monthlyAverages[monthIndex].income - monthlyAverages[monthIndex].expense;
            });

            return res.status(200).json({
                message: "Success",
                monthlyAverages
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }
    // get Average Income and Expense Per Month
    async getAverageIncomeAndExpensePerMonth(req, res) {
        const { slug_user } = req.params;
        const { year } = req.query;
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: "Năm không hợp lệ" });
        }
        try {
            const results = await Transactions.findAll({
                where: {
                    userId: slug_user,
                    transaction_date: {
                        [Op.between]: [new Date(`${year}-01-01`), new Date(`${parseInt(year) + 1}-01-01`)],
                    }
                },
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('transaction_date')), 'month'],
                    'type',
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                group: [Sequelize.fn('MONTH', Sequelize.col('transaction_date')), 'type'],
                order: [Sequelize.fn('MONTH', Sequelize.col('transaction_date'))]
            });

            const monthlyAverages = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                averageIncome: 0,
                averageExpense: 0
            }));

            results.forEach(monthData => {
                const monthIndex = monthData.get('month') - 1;
                const count = monthData.get('count');
                if (monthData.type === 'income') {
                    monthlyAverages[monthIndex].averageIncome = monthData.get('totalAmount') / count;
                } else {
                    monthlyAverages[monthIndex].averageExpense = monthData.get('totalAmount') / count;
                }
            });

            return res.status(200).json({
                message: "Success",
                monthlyAverages
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }
    // Find Transactions by keyword
    async findTransactions(req, res) {
        try {
            const { keyword, type } = req.query;
            const findTran = await Transactions.findAll({
                where: {
                    type: type,
                    transaction_name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                include: [
                    {
                        model: Categories,
                        attributes: ['categories_image']
                    },
                    {
                        model: IncomeTypes,
                        attributes: ['income_type_image']
                    }
                ]
            });
            return res.status(200).json({
                message: "Tìm kiếm thành công",
                findTran
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err.message}`
            });
        }
    }
    // Filter Transactions by date and category
    async filterTransactions(req, res) {
        try {
            const { date, categoryId, type } = req.query;
            const filterConditions = {};

            if (date) {
                const selectedDate = new Date(date);
                filterConditions.transaction_date = {
                    [Op.between]: [selectedDate.setHours(0, 0, 0, 0), selectedDate.setHours(23, 59, 59, 999)]
                };
            }

            if (categoryId) {
                filterConditions.categoryId = categoryId;
            }

            if (!Object.keys(filterConditions).length) {
                return res.status(403).json({
                    message: "Không có kết quả tìm kiếm!",
                });
            }

            const transactions = await Transactions.findAll({
                where: { ...filterConditions, type: type },
                include: [
                    {
                        model: Categories,
                        attributes: ['categories_image']
                    }
                ]
            });

            return res.status(200).json({
                message: "Tìm kiếm thành công",
                transactions
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err.message}`
            });
        }
    }




}

module.exports = new TransactionsController();
