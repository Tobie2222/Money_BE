const mongoose=require("mongoose")
const {Schema}=mongoose

const categoriesSchema=new Schema(
    {
        categories_name: { type: String,required: true },
        categories_desc : { type: String,required: true },
        categories_image : { type: String,required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            default: null
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('categories',categoriesSchema)