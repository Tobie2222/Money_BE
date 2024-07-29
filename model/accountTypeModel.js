const mongoose=require("mongoose")
const {Schema}=mongoose

const accountTypeSchema=new Schema(
    {
        wallet_type_name :{type:String},
        wallet_type_image :{type:String}
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('accountTypes',accountTypeSchema)