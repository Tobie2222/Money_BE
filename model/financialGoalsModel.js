const mongoose=require("mongoose")
const {Schema}=mongoose

const financialGoalsSchema=new Schema(
    {
        financial_goal_name : { type: String,required: true },
        desc_financial_goal : { type: String,required: true },
        status : { type: String,required: true },
        deadline: { type: Date,required: true },
        user: {
            type: mongoose.Schema.Types.Number,
            ref: 'users',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('financialGoals',financialGoalsSchema)