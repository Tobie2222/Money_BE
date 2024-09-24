const db = require('../config/database');
const Joi = require('joi')

const schema = Joi.object({
    income_type_name: Joi.string().min(3).required(),
    income_type_image: Joi.string().optional()
});

class IncomeTypeController {
    // Create global income
    async createIncomeTypeGlobal(req, res) {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }
            const { income_type_name } = req.body;
            const [find] = await db.execute('SELECT * FROM income_type WHERE income_type_name = ?', [income_type_name]);
            if (find.length > 0) {
                return res.status(403).json({ message: "Danh mục thu nhập đã tồn tại" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Chưa có hình ảnh" });
            }
            await db.execute(
                'INSERT INTO income_type (income_type_name, income_type_image, is_global, user_id) VALUES (?, ?, ?, null)',
                [income_type_name, req.file.path, true]
            );
            return res.status(200).json({ message: 'Success' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Create user income 
    async createIncomeTypeByUser(req, res) {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }
            const { income_type_name } = req.body;
            const { userId } = req.params;
            const [find] = await db.execute(
                'SELECT * FROM income_type WHERE income_type_name = ? AND user_id = ?', [income_type_name, userId]
            );
            if (find.length > 0) {
                return res.status(403).json({ message: "Danh mục thu nhập đã tồn tại!" });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Chưa có hình ảnh' });
            }
            await db.execute(
                'INSERT INTO income_type (income_type_name, income_type_image, is_global, user_id) VALUES (?, ?, ?, ?)',
                [income_type_name, req.file.path, false, userId]
            );
            return res.status(200).json({ message: "Tạo mới danh mục thu nhập thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Update incomeType
    async updateIncomeType(req, res) {
        try {
            const { incomeTypeId } = req.params;
            const [findIncomeType] = await db.execute('SELECT * FROM income_type WHERE income_type_id = ?', [incomeTypeId]);
            if (findIncomeType.length === 0) {
                return res.status(404).json({ message: "Danh mục thu nhập không tồn tại" });
            }
            if (findIncomeType[0].is_global) {
                return res.status(403).json({ message: "Không thể cập nhật danh mục mặc định" });
            }
            const { error } = schema.validate(req.body, { allowUnknown: true });
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }
            const { income_type_name, income_type_image } = req.body;
            await db.execute(
                'UPDATE income_type SET income_type_name = ?, income_type_image = ? WHERE income_type_id = ?',
                [income_type_name || findIncomeType[0].income_type_name, income_type_image || findIncomeType[0].income_type_image, incomeTypeId]
            );
            return res.status(200).json({ message: "Cập nhật danh mục thu nhập thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get all incomeTypes with pagination
    async getAllIncomeType(req, res) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const [allIncomeType] = await db.execute(
                'SELECT * FROM income_type WHERE user_id = ? OR is_global = true LIMIT ? OFFSET ?',
                [userId, limit, offset]
            );

            return res.status(200).json({ message: "Success", allIncomeType });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete IncomeType
    async deleteIncomeType(req, res) {
        const connection = await db.getConnection();
        try {
            const { incomeTypeId, userId } = req.params;
            await connection.beginTransaction();
            const [findIn] = await connection.execute('SELECT * FROM income_type WHERE income_type_id = ?', [incomeTypeId]);
            if (findIn.length == 0) {
                await connection.rollback();
                return res.status(404).json({ message: "Danh mục thu nhập không tồn tại" });
            }
            await connection.execute('DELETE FROM income_type WHERE income_type_id = ?', [incomeTypeId]);
            await connection.execute('UPDATE transactions SET income_type_id = NULL WHERE income_type_id = ?', [incomeTypeId]);

            await connection.commit();
            return res.status(200).json({ message: "Xóa danh mục thu nhập thành công" });
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        } finally {
            connection.release();
        }
    }
}

module.exports = new IncomeTypeController();
