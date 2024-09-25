const Account = require('../models/accountsModel');
const AccountType = require('../models/accountTypeModel');
const Transaction = require('../models/transactionsModel');
const IncomeType = require('../models/incomeTypeModel');
const Category = require('../models/categoriesModel');
const Joi = require('joi');

class AccountController {
    // Create a new account
    async createAccount(req, res) {
        try {
            const schema = Joi.object({
                account_name: Joi.string().required(),
                desc_account: Joi.string().allow(' '),
                balance: Joi.number().min(0).required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { id_accountType, userId } = req.params;
            const { account_name, desc_account, balance } = req.body;

            const existingAccount = await Account.findOne({ where:  { account_name } });
            if (existingAccount) {
                return res.status(403).json({ message: "Tài khoản đã tồn tại" });
            }

            const newAccount = await Account.create({
                account_name,
                desc_account,
                balance,
                user_id: userId,
                account_types_id: id_accountType
            });

            return res.status(200).json({
                message: "Tạo tài khoản mới thành công",
                newAccount
            });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all accounts by user with pagination
    async getAllAcountByUser(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { rows: allAccountByUser, count } = await Account.findAndCountAll({
                where: { user_id: userId },
                include: [{ model: AccountType, as: 'accountType' }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.status(200).json({
                message: "Success",
                page,
                limit,
                totalCount: count,
                allAccountByUser
            });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get account details
    async getAccountDetail(req, res) {
        try {
            const { accountId } = req.params;

            const account = await Account.findByPk(accountId, {
                include: [
                    { model: Transaction, as: 'transactions', include: [{ model: IncomeType }, { model: Category }] }
                ]
            });

            if (!account) {
                return res.status(404).json({ message: "Tài khoản không tồn tại!" });
            }

            const incomeTransactions = account.transactions.filter(transaction => transaction.type === 'income');
            const expenseTransactions = account.transactions.filter(transaction => transaction.type === 'expense');

            return res.status(200).json({
                message: "Success",
                accountDetail: {
                    account_name: account.account_name,
                    desc_account: account.desc_account,
                    balance: account.balance,
                    incomeTransactions,
                    expenseTransactions
                }
            });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Update account
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
                return res.status(400).json({ message: error.details[0].message });
            }

            const account = await Account.findByPk(accountId);
            if (!account) {
                return res.status(404).json({ message: "Tài khoản không tồn tại!" });
            }

            await account.update(req.body);

            return res.status(200).json({ message: "Cập nhật tài khoản thành công" });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get total balance for a user
    async getTotalBalance(req, res) {
        try {
            const { userId } = req.params;
            const allAccount = await Account.findAll({ where: { user_id: userId } });

            const totalBalance = allAccount.reduce((balance, account) => account.balance + balance, 0);
            return res.status(200).json({ message: "Success", totalBalance });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete account and rollback if failed
    async deleteAccount(req, res) {
        const transaction = await db.transaction();
        try {
            const { accountId } = req.params;

            await Account.destroy({ where: { id: accountId }, transaction });
            await Transaction.update({ account_id: null }, { where: { account_id: accountId }, transaction });
            await SavingTransaction.update({ account_id: null }, { where: { account_id: accountId }, transaction });

            await transaction.commit();
            return res.status(200).json({ message: "Xóa tài khoản thành công" });

        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });

        } finally {
            await transaction.release();
        }
    }
}

module.exports = new AccountController();
