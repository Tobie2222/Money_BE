const categoriesSchema=require("../model/categoriesModel")


class categoriesController {
    //[create cat global]
    async createCatGlobal(req,res) {
        try {
            const {categories_name}=req.body
            const findCat=await categoriesSchema.findOne({categories_name})
            if (findCat) return res.status(403).json({
                message: "Category name already exists"
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
            const findCat=await categoriesSchema.findOne({categories_name})
            if (findCat) return res.status(403).json({
                message: "Category name already exists"
            })
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
                message: `success d`,
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
            const {wallet_type_name}=req.body
            const Categories=new categoriesSchema({
                wallet_type_name,
                wallet_type_image: req.file.path
            })
            await Categories.save()
            return res.status(200).json({
                message: `success`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[delete cat]
    async deleteCategories(req,res) {
        try {
            const {id}=req.params
            await categoriesSchema.findByIdAndDelete(id)
            await accountSchema.updateMany({Categories: id},{$pull: {Categories:null}})
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


module.exports=new categoriesController
