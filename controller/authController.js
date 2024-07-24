
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const UsersSchema=require("../model/userModel")


dotenv.config()


class authController {
    async generateToken(user) {
        return jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        },process.env.TOKEN_KEY,{expiresIn: "365d"})
    }
    //register
    async register(req,res){
        try {
            const {name,email,password,confirmPassword,sex}=req.body
            const findUser=await UsersSchema.find({name:name})
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
    //register by google
    async registerByGoogle(req,res){
        try {
            const {email,password}=req.body
            return res.status(404).json({
                message: "success"
            })
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
    async login(req,res){
        try {
            const {email,password}=req.body
            
            return res.status(404).json({
                message: "success"
            })
        } catch(err) {
            return res.status(500).json({
                message: err
            })
        }
    }
}



module.exports=new authController

