const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const slug = require('slug');
const nodemailer = require('nodemailer');
const  User  = require('../models/userModel'); 
require('dotenv').config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    host:'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class AuthController {
    // Register a new user
    async register(req, res) {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                    'any.only': 'Mật khẩu xác nhận không khớp',
                }),
                gender: Joi.string().valid('male', 'female', 'other').required(),
            });
    
            const { name, email, password, confirmPassword, gender } = req.body;
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
    
            // Check if email already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
    
            // Hash password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Create user slug
            const userSlug = slug(name, { lower: true });
    
            // Create new user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                gender,
                slug_user: userSlug
            });
    
            return res.status(201).json({
                message: 'Tạo người dùng thành công',
                userId: newUser.id
            });
    
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }
    

    // Login user
    async login(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });
    
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
    
            const { email, password } = req.body;
    
            // Find user in database
            const user = await User.findOne({
                where: { email },
                attributes: ['user_id', 'name', 'avatar', 'email', 'slug_user', 'password'] // Chỉ lấy password để so sánh
            });
            if (!user) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }
    
            // Compare passwords
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }
    
            // Create JWT token
            const token = jwt.sign({
                userId: user.user_id,
                isAdmin: user.isAdmin // Nếu bạn có trường isAdmin trong model User
            }, process.env.TOKEN_KEY, { expiresIn: '1h' });
    
            // Trả về token và thông tin người dùng (nếu cần)
            return res.status(200).json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email,
                    slug_user: user.slug_user
                }
            });
    
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }
    

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const expirationTime = 10 * 60 * 1000; // 10 minutes
            const expirationDate = new Date(Date.now() + expirationTime);
            await user.update({
                password_reset_token: verificationCode,
                password_reset_expiration: expirationDate
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mã xác thực đặt lại mật khẩu',
                text: `Mã xác thực của bạn là ${verificationCode}`,
                html: `<p>Mã xác thực của bạn là <strong>${verificationCode}</strong></p>`
            });
            res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn.', expirationDate,email });
        } catch (err) {
            console.error('Lỗi khi gửi email:', err);
            res.status(500).json({ message: `Không thể gửi email: ${err.message}` });
        }
    }

    // Verify code
    async verifyCode(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                verifyCode: Joi.number().required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, verifyCode } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }

            if (user.password_reset_token !== verifyCode) {
                return res.status(400).json({ message: 'Mã xác thực không đúng' });
            }

            const expirationTime = new Date(user.password_reset_expiration).getTime();
            const currentTime = Date.now();
            if (expirationTime < currentTime) {
                return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
            }

            await user.update({
                password_reset_token: null,
                password_reset_expiration: null
            });

            return res.status(200).json({ message: 'Mã xác thực chính xác' });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Reset password
    async resetPassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                newPassword: Joi.string().required(),
                confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, newPassword } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });

            return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                currentPassword: Joi.string().required(),
                newPassword: Joi.string().required(),
                confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, currentPassword, newPassword } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }

            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });

            return res.status(200).json({ message: 'Thay đổi mật khẩu thành công' });

        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }

    // Logout user
    async logout(req, res) {
        try {
            res.status(200).json({ message: 'Đăng xuất thành công' });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message || err}` });
        }
    }
}

module.exports = new AuthController();
