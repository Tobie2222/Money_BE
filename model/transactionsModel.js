const mongoose=require("mongoose")
const {Schema}=mongoose

const transactionsSchema=new Schema(
    {
        transaction_name: { type: String,required: true },
        desc_transaction: { type: String,required: true },
        is_fixed: { type: Boolean,required: true },
        amount : { type: Number,required: true },
        type : { type: String,required: true },
        transaction_date : { type: Date,required: true },
        user: {
            type: mongoose.Schema.Types.Number,
            ref: 'users',
            required: true
        },
        account: {
            type: mongoose.Schema.Types.Number,
            ref: 'accounts',
            required: true
        },
        category: {
            type: mongoose.Schema.Types.Number,
            ref: 'categorys',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('transactions',transactionsSchema)