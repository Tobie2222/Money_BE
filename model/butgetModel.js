const mongoose=require("mongoose")
const {Schema}=mongoose

const budgetSchema=new Schema(
    {
        budget_name: { type: String,required: true },
        desc_budget: {type: String,require: true,},
        amount: { type: Number, required: true },
        period: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.Number,
            ref: 'users',
            required: true
        },
        category: {
            type: mongoose.Schema.Types.Number,
            ref: 'categories',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('budgets',budgetSchema)