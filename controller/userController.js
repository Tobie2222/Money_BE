const userSchema=require("../model/userModel")
const accountSchema=require("../model/accountsModel")
const transactionsSchema=require("../model/transactionsModel")
const categoriesSchema=require("../model/categoriesModel")
const savingSchema=require("../model/savingModel")
const budgetSchema=require("../model/butgetModel")
const bcrypt=require("bcrypt")
const paginate=require("../utils/paginate")
const { populate } = require("dotenv")

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
            const salt=await bcrypt.genSalt(10)
            const hashPassword=await bcrypt.hash(password,salt)
            const newUser=new userSchema({
                name,email,sex,
                avatar: req.file?req.file.path:"",
                password: hashPassword
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
            console.log(req.file)
            await userSchema.findByIdAndUpdate(userId,{avatar: req.file?req.file?.path:"",...req.body})
            return res.status(200).json({
                message: "Cập nhật người dùng thành công"
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteUser(req,res) {
        try {
            const {userId}=req.params
            await Promise.all([
                savingSchema.deleteMany({ user: userId }),
                accountSchema.deleteMany({ user: userId }),
                transactionsSchema.deleteMany({ user: userId }),
                categoriesSchema.deleteMany({ user: userId }),
                financialGoalsSchema.deleteMany({ user: userId }),
                budgetSchema.deleteMany({ user: userId })
            ])
            return res.status(200).json({
                message: "success"
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new userController
