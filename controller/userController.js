const userSchema=require("../model/userModel")
const accountSchema=require("../model/accountsModel")
const transactionsSchema=require("../model/transactionsModel")
const categoriesSchema=require("../model/categoriesModel")
const savingSchema=require("../model/savingModel")
const budgetSchema=require("../model/butgetModel")

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
    async updateUser(req,res) {
        try {
            const {userId}=req.params
            await userSchema.findByIdAndUpdate(userId,{image: req.file.path,...req.body})
            return res.status(200).json({
                message: `success`
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
                message: `success`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new userController
