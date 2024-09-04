const accountTypeSchema=require("../model/accountTypeModel")
const accountSchema=require("../model/accountsModel")


class accountTypeController {
    async createAccountType(req,res) {
        try {
            const {account_type_name}=req.body
            const accountType=new accountTypeSchema({
                account_type_name,
                account_type_image: req.file.path
            })
            await accountType.save()
            return res.status(200).json({
                message: `success`,
                accountType
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getAllAccountType(req,res) {
        try {
            const allAccountType=await accountTypeSchema.find()
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
    async deleteAccountType(req,res) {
        try {
            const {id}=req.params
            await accountTypeSchema.findByIdAndDelete(id)
            await accountSchema.updateMany({ accountType: id }, { $set: { accountType: null } })
            return res.status(200).json({
                message: `xóa thành công`,
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
}


module.exports=new accountTypeController
