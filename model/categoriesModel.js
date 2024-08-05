const mongoose=require("mongoose")
const {Schema}=mongoose

const categoriesSchema=new Schema(
    {
        categories_name: { type: String,required: true },
        is_global : { type: Boolean,required: true ,default: false},
        categories_image : { type: String,required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: false,
            default: null
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('categories',categoriesSchema)