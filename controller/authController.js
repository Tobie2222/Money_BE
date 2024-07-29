
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const UsersSchema=require("../model/userModel")
const nodemailer = require("nodemailer")
dotenv.config()


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // `true` cho cổng 465, `false` cho cổng 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});


class authController {
    async generateToken(user) {
        return jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        },process.env.TOKEN_KEY,{expiresIn: "365d"})
    }
    //[register]
    async register(req,res){
        try {
            const {name,email,password,confirmPassword,sex}=req.body
            const findUser=await UsersSchema.findOne({name})
            if (findUser) return res.status(404).json({message: "Tên người dùng đã tồn tại!"})
            if (password!==confirmPassword) return res.status(404).json({message: "Nhắc lại mật khẩu không đúng!"})
            const salt=await bcrypt.genSalt(10)
            const hashPassword=await bcrypt.hash(password,salt)
            const user=new UsersSchema({
                name,
                email,
                password: hashPassword,
                sex
            })
            await user.save()
            return res.status(404).json({
                message: "Đăng ký thành công"
            })
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
    //[login]
    async login(req,res){
        try {
            const {email,password}=req.body
            const findUser=await UsersSchema.findOne({email})
            if (!findUser) return res.status(404).json({message: "tài khoản chưa được đăng ký! "})
            const validatePassword=await bcrypt.compare(password,findUser.password)
            if (!validatePassword) return res.status(404).json({message: "mật khẩu không chính xác! "})
            const authControllers=new authController
            if (findUser && validatePassword) {
                const token=await authControllers.generateToken(findUser)
                return res.status(200).json({
                    message: "Đăng nhập thành công",
                    token,
                    id: findUser._id
                })
            }
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
    //[forgotPassword]
    async forgotPassword(req, res) {
        try {
            const { email } = req.body
            const findEmail = await UsersSchema.findOne({ email })
            if (!findEmail) return res.status(403).json({ message: "Tài khoản không tồn tại!" })
            const verificationCode = Math.floor(1000+Math.random()*9000)
            console.log(verificationCode)
            await UsersSchema.updateOne({ email }, { password_reset_token: verificationCode, password_reset_expiration: Date.now() + 36000 }) // 1 min
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Mã xác thực đặt lại mật khẩu",
                text: `Mã xác thực của bạn là ${verificationCode}`,
                html: `<p>Mã xác thực của bạn là <strong>${verificationCode}</strong></p>`,
            })
            res.status(200).json({ message: "Mã xác thực đã được gửi đến email của bạn." })
        } catch (err) {
            console.error("Error sending email:", err)
            res.status(500).json({ message: `Không thể gửi email: ${err.message}` })
        }
    }
    // [verifyCode]
    async verifyCode(req, res) {
        try {
            const {email,verifyCode}=req.body
            const findUser=await UsersSchema.findOne({email})
            if (!findUser) {
                return res.status(404).json({
                    message: "Tài khoản không tồn tại!"
                })
            }
            if (findUser.password_reset_token !== verifyCode) {
                return res.status(400).json({ message: "Mã xác thực không đúng!" })
            }
            const expirationTime = new Date(findUser.password_reset_expiration).getTime()
            const currentTime = Date.now()
            console.log(currentTime,"  ",expirationTime)
            if (expirationTime < currentTime) {
                return res.status(400).json({ message: "Mã xác thực đã hết hạn!" })
            }
            await findUser.updateOne({
                password_reset_token: null,
                password_reset_expiration: null
            })
            return res.status(200).json({ message: "Mã xác thực chính xác!" })
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
    //[resetPassword]
    async resetPassword(req, res) {
        try {
            const {email,newPassword,confirmNewPassword}=req.body
            if (newPassword!==confirmNewPassword) {
                return res.status(403).json({
                    message: "xác nhận mật khẩu không đúng"
                })
            }
            const findUser=await UsersSchema.findOne({email})
            const salt=await bcrypt.genSalt(10)
            const hashPassword=await bcrypt.hash(newPassword,salt)
            await findUser.updateOne({
                password: hashPassword
            })
            return res.status(200).json({ message: "cập nhật mật khẩu thành công!" })
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
}



module.exports=new authController

