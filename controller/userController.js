const userSchema=require("../model/userModel")


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
            
            return res.status(200).json({
                message: `success`,
                allAccountType
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteUser(req,res) {
        try {
            const {id}=req.params
            await accountTypeSchema.findByIdAndDelete(id)
            await accountSchema.updateMany({accountType: id},{$pull: {accountType:null}})
            return res.status(200).json({
                message: `success`,
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }

}


module.exports=new userController
