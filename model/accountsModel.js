const mongoose=require("mongoose")
const {Schema}=mongoose

const accountsSchema=new Schema(
    {
        account_name: { type: String,required: true },
        desc_account: { type: String, required: true },
        balance: { type: Number, required: true },
        user: {type: mongoose.Schema.Types.ObjectId,ref: 'users',required: true},
        accountType: {type: mongoose.Schema.Types.ObjectId,ref: 'accountTypes',required: true},
        transactions:[{type: mongoose.Schema.Types.ObjectId,ref: 'transactions'}]
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('accounts',accountsSchema)