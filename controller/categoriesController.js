const db = require('../config/database'); // Cấu hình kết nối database
const Joi = require('joi');
const path = require('path');

// Định nghĩa schema cho validation
const schema = Joi.object({
    categories_name: Joi.string().min(3).required(),
    categories_image: Joi.string().optional()
});

class CategoriesController {
    // Tạo danh mục toàn cầu
    async createCatGlobal(req, res) {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error: ' + error.details[0].message,
            });
        }
        try {
            const { categories_name } = req.body;
            const [check] = await db.execute('SELECT * FROM categories WHERE categories_name = ?', [categories_name]);
            if (check.length > 0) {
                return res.status(403).json({
                    message: 'Danh mục đã tồn tại'
                });
            }
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (req.file && !allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    message: "Invalid image format. Only JPEG and PNG are allowed."
                });
            }
            const imagePath = req.file ? req.file.path : null;
            await db.execute(
                'INSERT INTO categories (categories_name, categories_image, is_global, user_id) VALUES (?, ?, ?, ?)',
                [categories_name, imagePath, 1, null]
            );
            return res.status(201).json({
                message: "Danh mục toàn cầu đã được tạo thành công"
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi tạo danh mục toàn cầu: ${err.message}`
            });
        }
    }

    // Tạo danh mục cá nhân
    async createCatUser(req, res) {
        const { userId } = req.params;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error: ' + error.details[0].message,
            });
        }
        try {
            const { categories_name } = req.body;
            const [existingCategory] = await db.execute(
                'SELECT * FROM categories WHERE categories_name = ? AND user_id = ?',
                [categories_name, userId]
            );
            if (existingCategory.length > 0) {
                return res.status(403).json({
                    message: "Danh mục đã tồn tại"
                });
            }
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (req.file && !allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    message: "Invalid image format. Only JPEG and PNG are allowed."
                });
            }
            const imagePath = req.file ? req.file.path : null;
            await db.execute(
                'INSERT INTO categories (categories_name, categories_image, is_global, user_id) VALUES (?, ?, ?, ?)',
                [categories_name, imagePath, 0, userId]
            );
            return res.status(201).json({
                message: "Danh mục cá nhân đã được tạo thành công"
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi tạo danh mục cá nhân: ${err.message}`
            });
        }
    }

    // Lấy tất cả danh mục
    async getAllCategories(req, res) {
        try {
            const { userId } = req.params;
            const [allCategories] = await db.execute(
                'SELECT * FROM categories WHERE user_id = ? OR is_global = 1',
                [userId]
            );
            return res.status(200).json({
                message: "Danh mục đã được lấy thành công",
                categories: allCategories
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi lấy danh mục: ${err.message}`
            });
        }
    }

    // Cập nhật danh mục
    async updateCategories(req, res) {
        const { catId } = req.params;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error: ' + error.details[0].message,
            });
        }
        try {
            const [category] = await db.execute('SELECT * FROM categories WHERE category_id = ?', [catId]);
            if (category.length === 0) {
                return res.status(404).json({
                    message: "Danh mục không tồn tại"
                });
            }
            if (category[0].is_global) {
                return res.status(403).json({
                    message: "Không thể cập nhật danh mục toàn cầu"
                });
            }
            const { categories_name, categories_image } = req.body;
            await db.execute(
                'UPDATE categories SET categories_name = ?, categories_image = ? WHERE category_id = ?',
                [categories_name || category[0].categories_name, categories_image || category[0].categories_image, catId]
            );
            return res.status(200).json({
                message: "Danh mục đã được cập nhật thành công"
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi cập nhật danh mục: ${err.message}`
            });
        }
    }

    // Xóa danh mục
    async deleteCategories(req, res) {
        const connection = await db.getConnection();
        try {
            const { catId, userId } = req.params;
            await connection.beginTransaction();
            const [category] = await connection.execute('SELECT * FROM categories WHERE category_id = ?', [catId]);
            if (category.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    message: "Danh mục không tồn tại"
                });
            }
            if (category[0].is_global || category[0].user_id !== userId) {
                await connection.rollback();
                return res.status(403).json({
                    message: "Không thể xóa danh mục"
                });
            }
            await connection.execute('DELETE FROM categories WHERE category_id = ?', [catId]);
            await connection.execute('UPDATE transactions SET category_id = NULL WHERE category_id = ?', [catId]);
            await connection.commit();
            return res.status(200).json({
                message: "Danh mục đã được xóa thành công"
            });
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({
                message: `Lỗi khi xóa danh mục: ${err.message}`
            });
        } finally {
            connection.release();
        }
    }
}

module.exports = new CategoriesController();
