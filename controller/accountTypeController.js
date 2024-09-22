const db = require("../config/database");

class AccountTypeController {
    // Tạo loại tài khoản
    async createAccountType(req, res) {
        try {
            const { account_type_name } = req.body;
            if (!account_type_name) {
                return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
            }

            // Kiểm tra xem loại tài khoản đã tồn tại chưa
            const [existingAccountType] = await db.execute(
                'SELECT * FROM account_types WHERE account_type_name = ?',
                [account_type_name]
            );
            if (existingAccountType.length > 0) {
                return res.status(403).json({ message: "Loại tài khoản đã tồn tại" });
            }

            // Thêm loại tài khoản mới
            const [newAccountType] = await db.execute(
                'INSERT INTO account_types (account_type_name, account_type_image) VALUES (?, ?)',
                [account_type_name, req.file.path]
            );

            return res.status(200).json({
                message: "Tạo loại tài khoản thành công",
                newAccountType
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Lấy tất cả các loại tài khoản
    async getAllAccountType(req, res) {
        try {
            const [allAccountType] = await db.execute('SELECT * FROM account_types');
            if (allAccountType.length === 0) {
                return res.status(200).json({ message: "Không có loại tài khoản nào", allAccountType: [] });
            }
            return res.status(200).json({ message: "Thành công", allAccountType });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Xóa loại tài khoản
    async deleteAccountType(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Thiếu ID loại tài khoản" });
            }
            await connection.beginTransaction();
            // Xóa loại tài khoản
            const [deleteResult] = await connection.execute('DELETE FROM account_types WHERE account_types_id = ?', [id]);
            if (deleteResult.affectedRows === 0) {
                await connection.rollback(); // Rollback nếu không xóa được
                return res.status(404).json({ message: "Loại tài khoản không tồn tại" });
            }

            await connection.execute('UPDATE accounts SET account_types_id = NULL WHERE account_types_id = ?', [id]);
            await connection.commit();
            return res.status(200).json({ message: "Xóa loại tài khoản thành công" });
        } catch (err) {
            await connection.rollback(); // Rollback nếu có lỗi
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        } finally {
            connection.release(); 
        }
    }
}
module.exports = new AccountTypeController();
