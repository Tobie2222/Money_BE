const mongoose=require("mongoose")
const {Schema}=mongoose

const SavingSchema=new Schema(
    {
        saving_name: { type: String,required: true },
        desc_saving: { type: String,required: true },
        goal_amount: { type: Number,required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accounts',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('savings',SavingSchema)