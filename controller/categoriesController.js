const categoriesSchema=require("../model/categoriesModel")
const transactionsSchema=require("../model/transactionsModel")


class categoriesController {
    //[create cat global]
    async createCatGlobal(req,res) {
        try {
            const {categories_name}=req.body
            const findCat=await categoriesSchema.findOne({categories_name})
            if (findCat) return res.status(403).json({
                message: "Danh mục chi tiêu đã tồn tại"
            })
            if (!req.file) return res.status(403).json({
                message: "image not "
            })
            const newCat=new categoriesSchema({
                categories_name,
                categories_image: req.file.path,
                is_global: true,
                user: null
            })
            await newCat.save()
            return res.status(200).json({
                message: `success d`,
                newCat
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[create cat by user]
    async createCategoriesByUser(req,res) {
        try {
            const {userId}=req.params
            const {categories_name}=req.body
            const findCat = await categoriesSchema.findOne({ categories_name })
            if (findCat) {
                return res.status(403).json({
                    message: "Danh mục chi tiêu đã tồn tại!"
                })
            }
            if (!req.file) return res.status(403).json({
                message: "image not "
            })
            const newCat=new categoriesSchema({
                categories_name,
                categories_image: req.file.path,
                is_global: false,
                user: userId
            })
            await newCat.save()
            return res.status(200).json({
                message: `Tạo mới danh mục chi tiêu thành công`,
                newCat
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[get all cat]
    async getAllCategories(req,res) {
        try {
            const {userId}=req.params
            const allCategories=await categoriesSchema.find({
                $or : [
                    {user:userId},
                    {is_global:true}
                ]
            })
            return res.status(200).json({
                message: `success`,
                allCategories
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[update cat]
    async updateCategories(req,res) {
        try {
            const {catId}=req.params
            const findCat = await categoriesSchema.findById(catId)
            if (findCat.is_global) {
                return res.status(403).json({
                    message: `Không thể cập nhật danh mục mặc định`
                })
            }
            await categoriesSchema.findByIdAndUpdate(catId, { ...req.body })
            return res.status(200).json({
                message: `cập nhật danh mục chi tiêu thành công`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[delete cat]
    async deleteCategories(req, res) {
        try {
            const { catId, userId } = req.params
            const category = await categoriesSchema.findById(catId)
            if (!category) {
                return res.status(404).json({
                    message: "Danh mục không tồn tại"
                })
            }
            if (category.is_global || category.user.toString() !== userId) {
                return res.status(403).json({
                    message: "Danh mục không thể bị xóa"
                })
            }
            await categoriesSchema.findByIdAndDelete(catId)
            await transactionsSchema.updateMany({ category: catId }, { $set: {category:null}})
            
            return res.status(200).json({
                message: "Xóa danh mục chi tiêu thành công",
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    
}


module.exports=new categoriesController
