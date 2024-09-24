const db = require('../config/database'); 

class SavingController {
    // Create saving
    async createSaving(req, res) {
        try {
            const { userId } = req.params;
            const { saving_name, desc_saving, goal_amount, deadline, saving_date } = req.body;
            const day = new Date();
            const deadL = new Date(deadline);

            if (deadL < day) {
                return res.status(403).json({ message: "Thời gian không hợp lệ!" });
            }

            const [result] = await db.execute(
                `INSERT INTO savings (user_id, saving_name, desc_saving, goal_amount, deadline, saving_date, saving_image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, saving_name, desc_saving, goal_amount, deadline, saving_date, req.file ? req.file.path : null]
            );

            return res.status(201).json({ message: "Tạo mới khoản tiết kiệm thành công", result });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all savings by user
    async getAllSavingByUser(req, res) {
        try {
            const { userId } = req.params;
            const [allSavings] = await db.execute(`SELECT * FROM savings WHERE user_id = ?`, [userId]);

            const savingsWithRemainingAmount = allSavings.map(saving => ({
                ...saving,
                remainingAmount: saving.goal_amount - saving.current_amount
            }));

            return res.status(200).json({ message: "Success", allSavings: savingsWithRemainingAmount });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Get saving details
    async getSavingDetails(req, res) {
        try {
            const { savingId, userId } = req.params;
            const [saving] = await db.execute(`SELECT * FROM savings WHERE user_id = ? AND id = ?`, [userId, savingId]);

            if (saving.length === 0) {
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            const savingDetails = saving[0];
            const remainingAmount = savingDetails.goal_amount - savingDetails.current_amount;
            const today = new Date();
            const deadline = new Date(savingDetails.deadline);
            const remainingDate = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

            return res.status(200).json({
                message: 'Success',
                saving: {
                    ...savingDetails,
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
            const [result] = await db.execute(`UPDATE savings SET ? WHERE id = ?`, [req.body, savingId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            return res.status(200).json({ message: "Cập nhật khoản tiết kiệm thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete saving
    async deleteSaving(req, res) {
        const connection = await db.getConnection();
        try {
            const { savingId } = req.params;
            await connection.beginTransaction();

            const [saving] = await connection.execute(`SELECT * FROM savings WHERE id = ?`, [savingId]);

            if (saving.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: "Khoản tiết kiệm không tồn tại" });
            }

            await connection.execute(`DELETE FROM savings WHERE id = ?`, [savingId]);
            await connection.execute(`UPDATE saving_transactions SET saving_id = NULL WHERE saving_id = ?`, [savingId]);

            await connection.commit();
            return res.status(200).json({ message: "Xóa khoản tiết kiệm thành công" });
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        } finally {
            connection.release();
        }
    }

    // Deposit money into saving
    async depositMoneySaving(req, res) {
        try {
            const { savingId, accountId, userId } = req.params;
            const { amount, name_tran, transaction_date } = req.body;
            const tranDate = new Date(transaction_date);

            const [saving] = await db.execute(`SELECT * FROM savings WHERE id = ?`, [savingId]);
            const [account] = await db.execute(`SELECT * FROM accounts WHERE id = ?`, [accountId]);

            if (saving.length === 0 || account.length === 0) {
                return res.status(404).json({ message: "Khoản tiết kiệm hoặc tài khoản không tồn tại" });
            }

            const savingDetails = saving[0];
            const accountDetails = account[0];

            const deadline = new Date(savingDetails.deadline);
            const savingDate = new Date(savingDetails.saving_date);

            if (deadline < tranDate || savingDate > tranDate) {
                return res.status(403).json({ message: "Thời gian không hợp lệ!" });
            }

            if (accountDetails.balance < amount) {
                return res.status(403).json({ message: "Bạn không đủ tiền để gửi" });
            }

            if (savingDetails.current_amount > savingDetails.goal_amount) {
                return res.status(403).json({ message: "Bạn không thể gửi tiền nữa!" });
            }

            savingDetails.current_amount += amount;
            accountDetails.balance -= amount;

            await db.execute(`UPDATE savings SET current_amount = ? WHERE id = ?`, [savingDetails.current_amount, savingId]);
            await db.execute(`UPDATE accounts SET balance = ? WHERE id = ?`, [accountDetails.balance, accountId]);

            if (savingDetails.current_amount === savingDetails.goal_amount) {
                const [notificationResult] = await db.execute(
                    `INSERT INTO notifications (user_id, notification_name, desc_notification, priority, created_at, updated_at)
                     VALUES (?, ?, ?, ?, NOW(), NOW())`,
                    [userId, 'Mục tiêu tiết kiệm đã hoàn thành!', `Bạn đã đạt được mục tiêu tiết kiệm ${savingDetails.saving_name}. Xin chúc mừng!`, 'low']
                );

                const notificationId = notificationResult.insertId;

                await db.execute(
                    `INSERT INTO user_notifications (user_id, notification_id, status) VALUES (?, ?, ?)`,
                    [userId, notificationId, 'unread']
                );
            }

            await db.execute(
                `INSERT INTO saving_transactions (name_tran, transaction_date, amount, account_id, saving_id, user_id, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [name_tran, transaction_date, amount, accountId, savingId, userId]
            );

            return res.status(200).json({ message: "Gửi tiền tiết kiệm thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all deposit money saving transaction
    async getAllDepositMoneySaving(req, res) {
        try {
            const { userId } = req.params;
            const [allDeposits] = await db.execute(`SELECT * FROM saving_transactions WHERE user_id = ?`, [userId]);

            return res.status(200).json({ message: "Success", allDeposits });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }
}

module.exports = new SavingController();
