const Account = require("../model/accountsModel");
const Transaction = require("../model/transactionsModel");
const SavingTransaction = require("../model/savingTransactionModel");
const db = require("../config/database");
const Joi = require('joi');

class AccountController {
    // Tạo tài khoản
    async createAccount(req, res) {
        try {
            const schema = Joi.object({
                account_name: Joi.string().required(),
                desc_account: Joi.string().allow(' '),
                balance: Joi.number().min(0).required()
            });
            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message
                });
            }

            const { id_accountType, userId } = req.params;
            const { account_name, desc_account, balance } = req.body;

            const [findAccount] = await db.execute('SELECT * FROM accounts WHERE account_name = ?', [account_name]);
            if (findAccount.length > 0) {
                return res.status(403).json({
                    message: "Tài khoản đã tồn tại"
                });
            }

            const [newAccount] = await db.execute(
                'INSERT INTO accounts (account_name, desc_account, balance, user_id, account_types_id) VALUES (?, ?, ?, ?, ?)',
                [account_name, desc_account, balance, userId, id_accountType]
            );

            return res.status(200).json({
                message: "Tạo tài khoản mới thành công"
            });

        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }

    // Lấy tất cả tài khoản của user với phân trang
    async getAllAcountByUser(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const [allAccountByUser] = await db.execute(
                `SELECT a.*, at.account_type_name, at.account_type_image 
                FROM accounts a 
                JOIN account_types at ON a.account_types_id = at.account_types_id
                WHERE a.user_id = ? 
                LIMIT ? OFFSET ?`,
                [userId, parseInt(limit), parseInt(offset)]
            );

            return res.status(200).json({
                message: "Success",
                page,
                limit,
                allAccountByUser
            });

        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }

    // Lấy thông tin chi tiết của tài khoản
    async getAccountDetail(req, res) {
        try {
            const { accountId } = req.params;
            const [account] = await db.execute(
                `SELECT a.*, t.transaction_name, t.desc_transaction, t.amount, t.type, t.transaction_date, 
                it.income_type_image, c.categories_image 
                FROM accounts a 
                LEFT JOIN transactions t ON a.account_id = t.account_id
                LEFT JOIN income_types it ON t.income_type_id = it.income_type_id
                LEFT JOIN categories c ON t.category_id = c.category_id
                WHERE a.account_id = ?`,
                [accountId]
            );

            if (account.length == 0) {
                return res.status(404).json({
                    message: "Tài khoản không tồn tại!"
                });
            }

            // Lọc giao dịch thu nhập và chi tiêu
            const incomeTransactions = account.filter(transaction => transaction.type === 'income');
            const expenseTransactions = account.filter(transaction => transaction.type === 'expense');

            return res.status(200).json({
                message: "Success",
                accountDetail: {
                    account_name: account[0].account_name,
                    desc_account: account[0].desc_account,
                    balance: account[0].balance,
                    incomeTransactions,
                    expenseTransactions
                }
            });

        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }

    // Cập nhật tài khoản
    async updateAccount(req, res) {
        try {
            const { accountId } = req.params;

            const schema = Joi.object({
                account_name: Joi.string().required(),
                desc_account: Joi.string().allow(' '),
                balance: Joi.number().min(0).required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message
                });
            }

            const [account] = await db.execute('SELECT * FROM accounts WHERE account_id = ?', [accountId]);
            if (account.length === 0) {
                return res.status(404).json({
                    message: "Tài khoản không tồn tại!"
                });
            }

            await db.execute(
                'UPDATE accounts SET account_name = ?, desc_account = ?, balance = ? WHERE account_id = ?',
                [req.body.account_name, req.body.desc_account, req.body.balance, accountId]
            );

            return res.status(200).json({
                message: "Cập nhật tài khoản thành công"
            });

        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }

    // Lấy ra tổng thu nhập
    async getTotalBalance(req, res) {
        try {
            const { userId } = req.params;
            const [allAccount] = await db.execute(
                'SELECT balance FROM accounts WHERE user_id = ?',
                [userId]
            );

            const totalBalance = allAccount.reduce((balance, account) => account.balance + balance, 0);
            return res.status(200).json({
                message: "Success",
                totalBalance
            });

        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });
        }
    }

    // Xóa tài khoản và rollback nếu thất bại
    async deleteAccount(req, res) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const { accountId } = req.params;

            await connection.execute('DELETE FROM accounts WHERE account_id = ?', [accountId]);
            await connection.execute('UPDATE transactions SET account_id = NULL WHERE account_id = ?', [accountId]);
            await connection.execute('UPDATE savings_transactions SET account_id = NULL WHERE account_id = ?', [accountId]);

            await connection.commit();
            return res.status(200).json({
                message: "Xóa tài khoản thành công"
            });

        } catch (err) {
            await connection.rollback();
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            });

        } finally {
            connection.release();
        }
    }
}

module.exports = new AccountController();
