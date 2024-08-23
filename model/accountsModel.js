const mongoose=require("mongoose")
const {Schema}=mongoose

const accountsSchema=new Schema(
    {
        account_name: { type: String,required: true },
        desc_account: { type: String, required: true },
        balance: { type: Number, required: true },
        currency : { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        accountType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accountTypes',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('accounts',accountsSchema)