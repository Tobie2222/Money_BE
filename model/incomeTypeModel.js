const mongoose=require("mongoose")
const {Schema}=mongoose

const incomeTypeSchema=new Schema(
    {
        income_type_name : { type: String,required: true },
        income_type_image : { type: String,required: true }
    },
    {
        timestamps: true
    }
)


module.exports=new mongoose.model('incomeTypes',incomeTypeSchema)