const User = require("../model/userModel");
const Account = require("../model/accountsModel");
const Transaction = require("../model/transactionsModel");
const Categories = require("../model/categoriesModel");
const IncomeType = require("../model/incomeTypeModel");
const Saving = require("../model/savingModel");
const bcrypt = require("bcrypt");
const slug = require('slug');


class UserController {
    // Get user details by userId
    async getDetailUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ where: { user_id: userId } });

            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            return res.status(200).json({
                message: "Success",
                user
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Create a new user
    async createUser(req, res) {
        try {
            const { name, email, sex, password } = req.body;
            const userSlug = slug(name, { lower: true });
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                name,
                email,
                sex,
                avatar: req.file ? req.file.path : "",
                password: hashPassword,
                slug_user: userSlug
            });

            return res.status(201).json({
                message: "Tạo người dùng mới thành công",
                user: newUser
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Get all users with pagination
    async getAllUser(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await User.findAndCountAll({
                offset,
                limit,
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                message: "Success",
                data: rows,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Update user information
    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ where: { user_id: userId } });

            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            const updatedData = {
                avatar: req.file ? req.file.path : user.avatar,
                ...req.body
            };

            await User.update(updatedData, { where: { user_id: userId } });

            const updatedUser = await User.findOne({ where: { user_id: userId } });

            return res.status(200).json({
                message: "Cập nhật người dùng thành công",
                user: updatedUser
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Find user by keyword
    async findUser(req, res) {
        try {
            const { keyword } = req.query;

            const users = await User.findAll({
                where: {
                    // Using string representation instead of Op
                    $or: [
                        { name: { $like: `%${keyword}%` } },
                        { email: { $like: `%${keyword}%` } }
                    ]
                }
            });

            return res.status(200).json({
                message: "Success",
                users
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ where: { user_id: userId } });

            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            if (user.isAdmin) {
                return res.status(403).json({ message: "Không thể xóa admin" });
            }

            await Promise.all([
                Saving.destroy({ where: { user_id: userId } }),
                Account.destroy({ where: { user_id: userId } }),
                Transaction.destroy({ where: { user_id: userId } }),
                Categories.destroy({ where: { user_id: userId } }),
                IncomeType.destroy({ where: { user_id: userId } }),
            ]);

            await User.destroy({ where: { user_id: userId } });

            return res.status(200).json({ message: "Xóa người dùng thành công" });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }
}

module.exports = new UserController();
