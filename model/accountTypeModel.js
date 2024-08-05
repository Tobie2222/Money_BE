const mongoose=require("mongoose")
const {Schema}=mongoose

const accountTypeSchema=new Schema(
    {
        account_type_name :{type:String,required: true },
        account_type_image :{type:String,required: true }
    },
    {
        timestamps: true
    }
)
module.exports=new mongoose.model('accountTypes',accountTypeSchema)