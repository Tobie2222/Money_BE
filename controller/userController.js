const userSchema=require("../model/userModel")
const accountSchema=require("../model/accountsModel")
const transactionsSchema=require("../model/transactionsModel")
const categoriesSchema=require("../model/categoriesModel")
const incomeTypeSchema=require("../model/incomeTypeModel")
const savingSchema=require("../model/savingModel")
const bcrypt=require("bcrypt")
const paginate=require("../utils/paginate")
const slug = require('slug')

class userController {
    async getDetailUser(req,res) {
        try {
            const {userId}=req.params
            const user=await userSchema.findOne({_id:userId})
            return res.status(200).json({
                message: `success`,
                user
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async createUser(req,res) {
        try {
            const {name,email,sex,password}=req.body
            const userSlug = slug(name, { lower: true })
            const salt=await bcrypt.genSalt(10)
            const hashPassword=await bcrypt.hash(password,salt)
            const newUser=new userSchema({
                name,email,sex,
                avatar: req.file?req.file.path:"",
                password: hashPassword,
                slug_user:userSlug
            })
            await newUser.save()
            return res.status(200).json({
                message: "Tạo người dùng mới thành công",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getAllUser(req,res) {
        try {
            const {page,limit}=req.query
            const options={
                page,
                limit,
                populate: "",
                sort:  {createdAt: -1 }
            }
            const getAllUser=await paginate(userSchema,{},options)
            return res.status(200).json({
                message: "success",
                getAllUser
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async updateUser(req,res) {
        try {
            const {userId}=req.params
            const newUser=await userSchema.findByIdAndUpdate(userId,{avatar: req.file?req.file?.path:"",...req.body})
            const updateUser={
                email:newUser.email,
                name:newUser.name,
                avatar:newUser.avatar,
                sex: newUser.sex
            }
            return res.status(200).json({
                message: "Cập nhật người dùng thành công",
                updateUser
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async findUser(req,res) {
        try {
            const {keyword}=req.query
            const searchQuery={
                $or :[
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } }  
                ]
            }
            const user=await userSchema.find(searchQuery)
            return res.status(200).json({
                message: "success",
                user
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteUser(req, res) {
        try {
            const { userId } = req.params
            const user = await userSchema.findById(userId)
            if (user.isAdmin) {
                return res.status(404).json({ message: "Không thể xóa admin" })
            }
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" })
            }
            await Promise.all([
                savingSchema.deleteMany({ user: userId }),
                accountSchema.deleteMany({ user: userId }),
                transactionsSchema.deleteMany({ user: userId }),
                categoriesSchema.deleteMany({ user: userId }),
                incomeTypeSchema.deleteMany({ user: userId }),
            ])
            await userSchema.findByIdAndDelete(userId)
            return res.status(200).json({
                message: "Xóa người dùng thành công"
            });
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message || err}`
            })
        }
    }
    
}


module.exports=new userController
