const mongoose=require("mongoose")
const {Schema}=mongoose

const accountsSchema=new Schema(
    {
        account_name: { type: String,required: true },
        desc_account: { type: String, required: true },
        balance: { type: Number, required: true },
        user: {
            type: mongoose.Schema.Types.Number,
            ref: 'user',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('transactions',accountsSchema)