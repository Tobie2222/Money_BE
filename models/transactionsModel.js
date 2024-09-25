const  Category= require('../models/categoriesModel'); 
const Transaction = require('../models/')
const path = require('path');
const Joi = require('joi');

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
            const existingCategory = await Category.findOne({ where: { category_name: categories_name, is_global: true } });
            if (existingCategory) {
                return res.status(403).json({
                    message: "Danh mục chi tiêu đã tồn tại"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Image is required"
                });
            }

            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    message: "Invalid image format. Only JPEG and PNG are allowed."
                });
            }

            const imagePath = req.file.path;

            const newCat = await Category.create({
                category_name: categories_name,
                category_image: imagePath,
                is_global: true,
                user_id: null
            });

            return res.status(201).json({
                message: "Danh mục toàn cầu đã được tạo thành công",
                newCat
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi tạo danh mục toàn cầu: ${err.message}`
            });
        }
    }

    // Tạo danh mục cá nhân
    async createCategoriesByUser(req, res) {
        const { userId } = req.params;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error: ' + error.details[0].message,
            });
        }
        try {
            const { categories_name } = req.body;
            const existingCategory = await Category.findOne({ where: { category_name: categories_name, user_id: userId } });
            if (existingCategory) {
                return res.status(403).json({
                    message: "Danh mục chi tiêu đã tồn tại!"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Image is required"
                });
            }

            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    message: "Invalid image format. Only JPEG and PNG are allowed."
                });
            }

            const imagePath = req.file.path;

            const newCat = await Category.create({
                category_name: categories_name,
                category_image: imagePath,
                is_global: false,
                user_id: userId
            });

            return res.status(201).json({
                message: "Tạo mới danh mục chi tiêu thành công",
                newCat
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi khi tạo danh mục chi tiêu: ${err.message}`
            });
        }
    }

    // Lấy tất cả danh mục
    async getAllCategories(req, res) {
        try {
            const { userId } = req.params;
            const allCategories = await Category.findAll({
                where: {
                    [Op.or]: [
                        { user_id: userId },
                        { is_global: true }
                    ]
                }
            });

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
            const category = await Category.findByPk(catId);
            if (!category) {
                return res.status(404).json({
                    message: "Danh mục không tồn tại"
                });
            }
            if (category.is_global) {
                return res.status(403).json({
                    message: "Không thể cập nhật danh mục toàn cầu"
                });
            }

            await Category.update(req.body, { where: { id: catId } });

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
        const { catId, userId } = req.params;
        const transaction = await db.transaction();
        try {
            const category = await Category.findByPk(catId);
            if (!category) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "Danh mục không tồn tại"
                });
            }
            if (category.is_global || category.user_id !== parseInt(userId, 10)) {
                await transaction.rollback();
                return res.status(403).json({
                    message: "Không thể xóa danh mục này"
                });
            }

            await Category.destroy({ where: { id: catId }, transaction });
            await Transaction.update({ category_id: null }, { where: { category_id: catId }, transaction });

            await transaction.commit();
            return res.status(200).json({
                message: "Danh mục đã được xóa thành công"
            });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({
                message: `Lỗi khi xóa danh mục: ${err.message}`
            });
        }
    }
}

module.exports = new CategoriesController();