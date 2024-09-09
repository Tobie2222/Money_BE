const mongoose = require('mongoose')
const { Schema } = mongoose

const userNotificationSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        notification: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'notifications',
            required: true
        },
        status: { type: String, enum: ['read', 'unread'], default: 'unread' },
        read_at: { 
            type: Date, 
            default: null //time user read notification
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('user_notifications', userNotificationSchema)
