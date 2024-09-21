const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const slug = require('slug');
const db = require('../config/database');
const Joi = require('joi');

class UserController {
    // Lấy chi tiết thông tin người dùng theo user_id
    async getDetaileUser(req, res) {
        try {
            const { userId } = req.params;
            
            // Truy vấn lấy thông tin người dùng từ cơ sở dữ liệu
            const [rows] = await db.execute('Select * from users where user_id = ?', [userId]);
            
            // Kiểm tra người dùng có tồn tại không
            if (rows.length == 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            // Trả về thông tin người dùng nếu thành công
            return res.status(200).json({
                message: "Success",
                user: rows[0]
            });
        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Tạo người dùng mới
    async createUser(req, res) {
        try {
            // Sử dụng Joi để kiểm tra đầu vào
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                sex: Joi.string().valid('male', 'female', 'other').required(),
                password: Joi.string().required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { name, email, sex, password } = req.body;

            // Kiểm tra email đã tồn tại chưa
            const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            // Tạo slug từ tên người dùng
            const userSlug = slug(name, { lower: true });

            // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Thực hiện truy vấn tạo mới người dùng
            const [result] = await db.execute('INSERT INTO users (name, email, sex, avatar, password, slug_user) VALUES (?, ?, ?, ?, ?, ?)', [
                name,
                email,
                sex,
                req.file ? req.file.path : "", // Xử lý file ảnh đại diện nếu có
                hashPassword,
                userSlug
            ]);

            return res.status(201).json({
                message: "Tạo mới người dùng thành công",
                user_id: result.insertId
            });

        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Lấy tất cả người dùng với phân trang
    async getAllUser(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            // Lấy danh sách người dùng với giới hạn và phân trang
            const [users] = await db.execute('Select * from users order by created_at desc limit ? offset ?', [parseInt(limit, 10), offset]);

            // Lấy tổng số lượng người dùng
            const [totalRows] = await db.execute('Select count(*) as count from users');
            const totalItems = totalRows[0].count;

            // Trả về danh sách người dùng và thông tin phân trang
            return res.status(200).json({
                message: "Success",
                data: users,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page
            });
        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Cập nhật thông tin người dùng
    async updateUser(req, res) {
        try {
            const { userId } = req.params;

            // Xác thực dữ liệu đầu vào
            const schema = Joi.object({
                name: Joi.string().optional(),
                email: Joi.string().email().optional(),
                sex: Joi.string().valid('male', 'female', 'other').optional(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { name, email, sex } = req.body;

            // Kiểm tra người dùng có tồn tại không
            const [userRows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
            if (userRows.length == 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            // Kiểm tra email mới có đã tồn tại trong hệ thống không
            if (email) {
                const [existingEmailUser] = await db.execute('SELECT * FROM users WHERE email = ? AND user_id != ?', [email, userId]);
                if (existingEmailUser.length > 0) {
                    return res.status(400).json({ message: "Email đã tồn tại" });
                }
            }

            // Cập nhật avatar nếu có, hoặc giữ nguyên ảnh cũ
            const avatarUpdate = req.file ? req.file.path : userRows[0].avatar;

            // Cập nhật thông tin người dùng
            const [result] = await db.execute('UPDATE users SET name = ?, email = ?, sex = ?, avatar = ? WHERE user_id = ?', [
                name || userRows[0].name,
                email || userRows[0].email,
                sex || userRows[0].sex,
                avatarUpdate,
                userId
            ]);

            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            // Lấy thông tin người dùng sau khi cập nhật
            const [updatedUser] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);

            return res.status(200).json({
                message: "Cập nhật người dùng thành công",
                user: updatedUser[0]
            });
        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Tìm kiếm người dùng theo từ khóa
    async findUser(req, res) {
        try {
            const { keyword } = req.query;

            // Tìm kiếm người dùng theo tên hoặc email
            const [users] = await db.execute(
                'Select * from users where name like ? or email like ?',
                [`%${keyword}%`, `%${keyword}%`]
            );

            return res.status(200).json({
                message: "Success",
                users
            });
        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Xóa người dùng
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            // Kiểm tra người dùng có tồn tại không
            const [user] = await db.execute('Select * from users where user_id = ?', [userId]);
            if (user.length == 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            // Không cho phép xóa tài khoản admin
            if (user[0].isAdmin) {
                return res.status(403).json({ message: "Không thể xóa admin" });
            }

            // Xóa các liên kết của người dùng từ các bảng liên quan
            await db.execute('DELETE FROM savings WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM accounts WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM transactions WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM categories WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM income_type WHERE user_id = ?', [userId]);

            // Xóa người dùng khỏi bảng users
            await db.execute('DELETE FROM users WHERE user_id = ?', [userId]);

            return res.status(200).json({
                message: "Xóa người dùng thành công"
            });
        } catch (err) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }
}

module.exports = new UserController();
