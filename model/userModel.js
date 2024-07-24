const mongoose=require("mongoose")
const {Schema}=mongoose

const UsersSchema=new Schema(
    {
        name: { type: String,required: true },
        email: {
            type: String,
            unique: true,
            require: true,
        },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        sex: { type: String},
        avatar: { type: String,default:"https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg" },
        google_id: { type: String },
        password_reset_token: { type: String },
        password_reset_expiration: {type: Date}
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('users',UsersSchema)