const SavingsTransaction = require('../models/savingTransactionModel');
const Notification = require('../models/notificationModel'); 
const UserNotification = require('../models/userNotificationModel');
const Account = require('../models/accountsModel');
const Saving = require("../models/savingModel")
const db = require("../config/database")

class SavingController {
    // Create saving
    async createSaving(req, res) {
        try {
            const { userId } = req.params;
            const { saving_name, desc_saving, goal_amount, deadline, saving_date } = req.body;
            const today = new Date();
            const deadL = new Date(deadline);

            if (deadL < today) {
                return res.status(403).json({ message: "Thời gian không hợp lệ!" });
            }

            const saving = await Saving.create({
                user_id: userId,
                saving_name,
                desc_saving,
                goal_amount,
                deadline,
                saving_date,
                saving_image: "https://example.com/test.png"  
            });

            return res.status(200).json({ message: "Tạo mới khoản tiết kiệm thành công", saving });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all savings by user
    async getAllSavingByUser(req, res) {
        try {
            const { userId } = req.params;

            const savings = await Saving.findAll({ where: { user_id: userId } });

            const savingsWithRemainingAmount = savings.map(saving => ({
                ...saving.dataValues,
                remainingAmount: saving.goal_amount - saving.current_amount
            }));

            return res.status(200).json({ message: "Success", savings: savingsWithRemainingAmount });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Get saving details
    async getSavingDetails(req, res) {
        try {
            const { savingId, userId } = req.params;

            const saving = await Saving.findOne({ where: { saving_id: savingId, user_id: userId } });

            if (!saving) {
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            const remainingAmount = saving.goal_amount - saving.current_amount;
            const today = new Date();
            const deadline = new Date(saving.deadline);
            const remainingDate = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

            return res.status(200).json({
                message: 'Success',
                saving: {
                    ...saving.dataValues,
                    remainingAmount,
                    remainingDate
                }
            });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Update saving
    async updateSaving(req, res) {
        try {
            const { savingId } = req.params;

            const result = await Saving.update(req.body, { where: { id: savingId } });

            if (result[0] === 0) {
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            return res.status(200).json({ message: "Cập nhật khoản tiết kiệm thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete saving
    async deleteSaving(req, res) {
        const transaction = await db.transaction();
        try {
            const { savingId } = req.params;

            const saving = await Saving.findOne({ where: { id: savingId } });

            if (!saving) {
                await transaction.rollback();
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            await Saving.destroy({ where: { id: savingId }, transaction });
            await SavingsTransaction.update({ saving_id: null }, { where: { saving_id: savingId }, transaction });

            await transaction.commit();
            return res.status(200).json({ message: "Xóa khoản tiết kiệm thành công" });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Deposit money into saving
    async depositMoneySaving(req, res) {
        const transaction = await db.transaction();
        try {
            const { savingId, accountId, userId } = req.params;
            const { amount, name_tran, transaction_date } = req.body;
            const tranDate = new Date(transaction_date);

            const saving = await Saving.findOne({ where: { saving_id: savingId }, transaction });
            const account = await Account.findOne({ where: { account_id: accountId }, transaction });

            if (!saving || !account) {
                await transaction.rollback();
                return res.status(404).json({ message: "Khoản tiết kiệm hoặc tài khoản không tồn tại" });
            }

            const deadline = new Date(saving.deadline);
            const savingDate = new Date(saving.saving_date);

            if (deadline < tranDate || savingDate > tranDate) {
                await transaction.rollback();
                return res.status(403).json({ message: "Thời gian không hợp lệ!" });
            }

            if (account.balance < amount) {
                await transaction.rollback();
                return res.status(403).json({ message: "Bạn không đủ tiền để gửi" });
            }

            if (saving.current_amount >= saving.goal_amount) {
                await transaction.rollback();
                return res.status(403).json({ message: "Bạn không thể gửi tiền nữa!" });
            }

            saving.current_amount += amount;
            account.balance -= amount;

            await saving.save({ transaction });
            await account.save({ transaction });

            if (saving.current_amount >= saving.goal_amount) {
                const notification = await Notification.create({
                    user_id: userId,
                    notification_name: 'Mục tiêu tiết kiệm đã hoàn thành!',
                    desc_notification: `Bạn đã đạt được mục tiêu tiết kiệm ${saving.saving_name}. Xin chúc mừng!`,
                    priority: 'low'
                }, { transaction });

                // await UserNotification.create({
                //     user_id: userId,
                //     notification_id: notification.id,
                //     status: 'unread'
                // }, { transaction });
            }

            await SavingsTransaction.create({
                name_tran,
                transaction_date,
                amount,
                account_id: accountId,
                saving_id: savingId,
                user_id: userId
            }, { transaction });

            await transaction.commit();
            return res.status(200).json({ message: "Gửi tiền tiết kiệm thành công" });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all deposit money saving transaction
    async getAllDepositMoneySaving(req, res) {
        try {
            const { userId } = req.params;

            const deposits = await SavingsTransaction.findAll({ where: { user_id: userId } });

            return res.status(200).json({ message: "Success", deposits });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }
}

module.exports = new SavingController();
