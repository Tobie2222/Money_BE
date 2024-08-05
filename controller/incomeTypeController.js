const incomeTypeSchema=require("../model/incomeTypeModel")

class incomeTypeController {
    async createIncomeType(req,res) {
        try {
            const {income_type_name}=req.body
            const incomeType=new incomeTypeSchema({
                income_type_name,
                income_type_image: req.file.path
            })
            await incomeType.save()
            return res.status(200).json({
                message: `success`,
                incomeType
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getAllIncomeType(req,res) {
        try {
            const allAccountType=await incomeTypeSchema.find()
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
    async deleteIncomeType(req,res) {
        try {
            const {id}=req.params
            await incomeTypeSchema.findByIdAndDelete(id)
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


module.exports=new incomeTypeController