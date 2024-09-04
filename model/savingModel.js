const mongoose=require("mongoose")
const {Schema}=mongoose

const SavingSchema=new Schema(
    {
        saving_name: { type: String,required: true },
        desc_saving: { type: String,required: true },
        goal_amount: { type: Number,required: true },
        current_amount: { type: Number ,default: 0},
        deadline: { type: Date,required: true },
        saving_date: { type: Date,required: true },
        saving_image: {type: String,required: true,default:"https://cdn.pixabay.com/photo/2021/04/16/10/19/piggy-bank-6183186_960_720.png"},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('savings',SavingSchema)