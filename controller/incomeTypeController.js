const incomeTypeSchema=require("../model/incomeTypeModel")
const transactionsSchema=require("../model/transactionsModel")

class incomeTypeController {
    // create IncomeType  Global
    async createIncomeTypeGlobal(req,res) {
        try {
            const {income_type_name}=req.body
            const findIn=await incomeTypeSchema.findOne({income_type_name})
            if (findIn) return res.status(403).json({
                message: "Danh mục thu nhập đã tồn tại"
            })
            if (!req.file) return res.status(403).json({
                message: "image not "
            })
            const incomeType=new incomeTypeSchema({
                income_type_name,
                income_type_image: req.file.path,
                is_global: true,
                user: null
            })
            await incomeType.save()
            return res.status(200).json({
                message: `Tạo mới danh mục thu nhập thành công`,
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    // createIncomeType by User
    async createIncomeTypeByUser(req,res) {
        try {
            const {income_type_name}=req.body
            const {userId}=req.params
            const findIn = await incomeTypeSchema.findOne({ income_type_name })
            if (findIn) {
                return res.status(403).json({
                    message: "Danh mục chi tiêu đã tồn tại!"
                })
            }
            if (!req.file) return res.status(403).json({
                message: "image not "
            })
            const newIncomeType=new incomeTypeSchema({
                income_type_name,
                income_type_image: req.file.path,
                is_global: false,
                user: userId
            })
            await newIncomeType.save()
            return res.status(200).json({
                message: `Tạo mới danh mục thu nhập thành công`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async updateIncomeType(req,res) {
        try {
            const {incomeTypeId}=req.params
            const findIncomeType = await incomeTypeSchema.findById(incomeTypeId)
            if (findIncomeType.is_global) {
                return res.status(403).json({
                    message: `Không thể cập nhật danh mục mặc định`
                })
            }
            await incomeTypeSchema.findByIdAndUpdate(incomeTypeId, { ...req.body })
            return res.status(200).json({
                message: `cập nhật danh mục thu nhập thành công`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getAllIncomeType (req,res) {
        try {
            const {incomeTypeId,userId}=req.params
            const allInComeType=await incomeTypeSchema.find({
                $or : [
                    {user:userId},
                    {is_global:true}
                ]
            })
            return res.status(200).json({
                message: `success`,
                allInComeType
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async deleteIncomeType(req,res) {
        try {
            const { incomeTypeId, userId } = req.params
            const findIn = await incomeTypeSchema.findById(incomeTypeId)
            if (!findIn) {
                return res.status(403).json({
                    message: "Danh mục chi tiêu không tồn tại!"
                })
            }
            if (findIn.is_global || findIn.user.toString() !== userId) {
                return res.status(403).json({
                    message: "Danh mục không thể bị xóa"
                })
            }
            await incomeTypeSchema.findByIdAndDelete(incomeTypeId)
            await transactionsSchema.updateMany({incomeType: incomeTypeId},{ $set: {incomeType:null}})
            
            return res.status(200).json({
                message: `Xóa danh mục thu nhập thành công`,
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
}


module.exports=new incomeTypeController