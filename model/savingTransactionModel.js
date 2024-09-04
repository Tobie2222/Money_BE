const mongoose = require('mongoose')
const { Schema } = mongoose

const savingsTransactionsSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts', required: true },
        saving: { type: mongoose.Schema.Types.ObjectId, ref: 'savings', required: true },
        amount: { type: Number, required: true },
        transaction_date: { type: Date, required: true },
        name_tran: { type: String, required: true },  
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('savings_transactions', savingsTransactionsSchema)
