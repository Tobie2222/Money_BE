const mongoose = require('mongoose')
const { Schema } = mongoose


const notificationSchema = new Schema(
    {
        notification_name: { type: String},
        desc_notification: { type: String},
        priority: { type: String, default: 'low' },
        type: { type: String, default: 'admin' }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('notifications', notificationSchema)
