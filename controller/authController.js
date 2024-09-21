const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const slug = require('slug');
const nodemailer = require('nodemailer');
const db = require('../config/database');
require('dotenv').config();

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class AuthController {
    // Đăng ký người dùng mới
    async register(req, res) {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                sex: Joi.string().valid('male', 'female', 'other').required(),
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { name, email, password, sex } = req.body;

            // Kiểm tra email đã tồn tại hay chưa
            const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo slug từ tên người dùng
            const userSlug = slug(name, { lower: true });

            // Tạo người dùng mới
            const [result] = await db.execute('INSERT INTO users (name, email, password, sex, slug_user) VALUES (?, ?, ?, ?, ?)', [
                name,
                email,
                hashedPassword,
                sex,
                userSlug
            ]);
            return res.status(201).json({
                message: 'Tạo người dùng thành công',
                userId: result.insertId
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Đăng nhập người dùng
    async login(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message
                });
            }
            const { email, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }
            const user = rows[0];

            // So sánh mật khẩu
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Tạo JWT token
            const token = jwt.sign({
                userId: user.user_id,
                isAdmin: user.isAdmin
            }, process.env.TOKEN_KEY, { expiresIn: '1h' });

            return res.status(200).json({
                message: 'Đăng nhập thành công',
                token
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            });
        }
    }

    // Đặt lại mật khẩu
    async forgotPassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email } = req.body;

            // Tìm email trong cơ sở dữ liệu
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            const user = rows[0];

            // Tạo mã xác thực và thời gian hết hạn
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const expirationTime = 10 * 60 * 1000; // 10 phút
            const expirationDate = new Date(Date.now() + expirationTime);

            // Cập nhật mã xác thực và thời gian hết hạn vào cơ sở dữ liệu
            await db.execute('UPDATE users SET password_reset_token = ?, password_reset_expiration = ? WHERE email = ?', [
                verificationCode,
                expirationDate,
                email
            ]);

            // Gửi email với mã xác thực
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mã xác thực đặt lại mật khẩu',
                text: `Mã xác thực của bạn là ${verificationCode}`,
                html: `<p>Mã xác thực của bạn là <strong>${verificationCode}</strong></p>`
            });

            res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn.', expirationDate });
        } catch (err) {
            console.error('Lỗi khi gửi email:', err);
            res.status(500).json({ message: `Không thể gửi email: ${err.message}` });
        }
    }

    // Xác thực mã xác thực
    async verifyCode(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                verifyCode: Joi.number().required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, verifyCode } = req.body;

            // Tìm người dùng và xác thực mã
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            const user = rows[0];

            if (user.password_reset_token !== verifyCode) {
                return res.status(400).json({ message: 'Mã xác thực không đúng' });
            }

            const expirationTime = new Date(user.password_reset_expiration).getTime();
            const currentTime = Date.now();
            if (expirationTime < currentTime) {
                return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
            }

            // Xóa mã xác thực và thời gian hết hạn
            await db.execute('UPDATE users SET password_reset_token = NULL, password_reset_expiration = NULL WHERE email = ?', [email]);

            return res.status(200).json({ message: 'Mã xác thực chính xác' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Đặt lại mật khẩu
    async resetPassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                newPassword: Joi.string().required(),
                confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, newPassword } = req.body;

            // Tìm người dùng
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            const user = rows[0];

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Cập nhật mật khẩu
            await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

            return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Thay đổi mật khẩu
    async changePassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                currentPassword: Joi.string().required(),
                newPassword: Joi.string().required(),
                confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            });

            // Xác thực dữ liệu đầu vào
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, currentPassword, newPassword } = req.body;

            // Tìm người dùng
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            const user = rows[0];

            // So sánh mật khẩu hiện tại
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
            }

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Cập nhật mật khẩu
            await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

            return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Đăng xuất người dùng
    async logout(req, res) {
        try {
            // Không cần thực hiện gì nếu bạn chỉ cần xóa token trên phía client
            res.status(200).json({ message: 'Đăng xuất thành công' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }
}

module.exports = new AuthController();
