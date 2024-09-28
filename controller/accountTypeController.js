const Account = require('../models/accountsModel');
const AccountType = require('../models/accountTypeModel');
const Joi = require('joi');
const db = require("../config/database")

class AccountTypeController {
    // Create a new account type
    async createAccountType(req, res) {
        try {
            const schema = Joi.object({
                account_types_name: Joi.string().required(),
                account_types_image: Joi.string().required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { account_types_name, account_types_image } = req.body;

            // Check if the account type already exists
            const existingAccountType = await AccountType.findOne({ where: { account_types_name } });
            if (existingAccountType) {
                return res.status(403).json({ message: "Loại tài khoản đã tồn tại" });
            }

            // Create a new account type
            const newAccountType = await AccountType.create({
                account_types_name,
                account_types_image: account_types_image
            });

            return res.status(200).json({
                message: "Tạo loại tài khoản thành công",
                newAccountType
            });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all account types
    async getAllAccountType(req, res) {
        try {
            const allAccountType = await AccountType.findAll();
            if (allAccountType.length === 0) {
                return res.status(200).json({ message: "Không có loại tài khoản nào", allAccountType: [] });
            }
            return res.status(200).json({ message: "Thành công", allAccountType });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete an account type
    async deleteAccountType(req, res) {
        const transaction = await db.transaction();
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu ID loại tài khoản" });
            }
    
            // Kiểm tra loại tài khoản có tồn tại hay không
            const accountType = await AccountType.findByPk(id);
            if (!accountType) {
                await transaction.rollback();
                return res.status(404).json({ message: "Loại tài khoản không tồn tại" });
            }
    
            // Xóa loại tài khoản
            await accountType.destroy({ transaction });
    
            // await Account.update(
            //     { account_types_id: null },
            //     { where: { account_types_id: id }, transaction }
            // );
    
            // Commit transaction
            await transaction.commit();
            return res.status(200).json({ message: "Xóa loại tài khoản thành công" });
    
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
    
        } finally {}
    }
    
}

module.exports = new AccountTypeController();
