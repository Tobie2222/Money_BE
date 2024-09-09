const notificationSchema=require("../model/notificationModel")
const UsersSchema=require("../model/userModel")
const userNotificationSchema=require("../model/userNotificationModel")

class notificationController {

    async createNotification(req, res) {
        try {
            const { userId } = req.params
            const adminUser = await UsersSchema.findById(userId)
            const users = await UsersSchema.find({})
            if (!adminUser || !adminUser.isAdmin) {
                return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' })
            }
            const { notification_name, desc_notification, priority } = req.body;
            const newNotification = new notificationSchema({
                notification_name,
                desc_notification,
                priority,
                type: 'admin'
            })
            await newNotification.save()
            const userNotifications = users.map(user => ({
                user: user._id,
                notification: newNotification._id,
                status: "unread"
            }))
            await userNotificationSchema.insertMany(userNotifications)
            return res.status(200).json({
                message: "Tạo thông báo thành công",
                notification: newNotification
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err}`
            })
        }
    }
    
    
    async getNotification(req,res) {
        try {
            const {userId}=req.params
            const allNotification=await userNotificationSchema.find({
                user: userId
            })
            .populate('notification')
            .sort({createdAt: -1 })
            return res.status(200).json({
                message: `success`,
                allNotification
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }




    async deleteNotification(req,res) {
        try {
            const { notificationId } = req.params
            const notification = await notificationSchema.findById(notificationId)
            console.log(notification)
            if (!notification) {
                return res.status(404).json({
                    message: 'Thông báo không tồn tại hoặc bạn không có quyền xóa thông báo này'
                })
            }

            if (notification.type === 'admin') {
                return res.status(403).json({
                    message: 'Bạn không được phép xóa thông báo từ admin'
                })
            }
            await userNotificationSchema.deleteMany({ notification: notificationId })
            await notificationSchema.findByIdAndDelete(notificationId)         
            return res.status(200).json({
                message: 'Xóa thông báo thành công'
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            })
        }
    }
    async tickNotification(req, res) {
        try {
            const { userNotificationId } = req.params
            await userNotificationSchema.findByIdAndUpdate({ _id: userNotificationId},{status: "read"})
            return res.status(200).json({
                message: 'Đánh dấu là đã đọc thông báo thành công'
            })
        } catch (err) {
            return res.status(500).json({
                message: `Lỗi: ${err.message}`
            })
        }
    }
}


module.exports=new notificationController