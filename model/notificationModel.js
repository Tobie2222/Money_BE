const mongoose=require("mongoose")
const {Schema}=mongoose

const notificationSchema=new Schema(
    {
        notification_name: { type: String,required: true },
        desc_notification: { type: String,required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, default: 'unread' }
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('notifications',notificationSchema)