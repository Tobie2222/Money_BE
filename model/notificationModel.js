const mongoose=require("mongoose")
const {Schema}=mongoose

const notificationSchema=new Schema(
    {
        notification_name: { type: String,required: true },
        desc_notification: { type: String,required: true },
        priority: { type: String, default: 'low' },
        status: { type: String, default: 'unread' },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    {
        timestamps: true
    }
)

module.exports=new mongoose.model('notifications',notificationSchema)