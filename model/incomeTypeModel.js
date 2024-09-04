const mongoose=require("mongoose")
const {Schema}=mongoose

const incomeTypeSchema=new Schema(
    {
        income_type_name : { type: String,required: true },
        income_type_image : { type: String,required: true },
        is_global : { type: Boolean,required: true ,default: false},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
    },
    {
        timestamps: true
    }
)


module.exports=new mongoose.model('incomeTypes',incomeTypeSchema)