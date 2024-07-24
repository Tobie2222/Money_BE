const mongoose=require("mongoose")
const {Schema}=mongoose

const categoriesSchema=new Schema(
    {
        categories_name: { type: String,required: true },
        desc_categories : { type: String,required: true }
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('categories',categoriesSchema)