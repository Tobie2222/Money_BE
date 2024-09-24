const { Notification, UserNotification, User } = require('../models'); 
class NotificationController {
    // Create notification
    async createNotification(req, res) {
        try {
            const { userId } = req.params;
            const { notification_name, desc_notification, priority } = req.body;

            // Check if the user is an admin
            const admin = await User.findOne({
                where: {
                    id: userId,
                    isAdmin: true
                }
            });

            if (!admin) {
                return res.status(403).json({
                    message: 'Bạn không có quyền thực hiện hành động này'
                });
            }

            // Create new notification
            const notification = await Notification.create({
                notification_name,
                desc_notification,
                priority,
                type: 'admin'
            });

            // Get all users
            const users = await User.findAll({ attributes: ['id'] });
            const userNotifications = users.map(user => ({
                user_id: user.id,
                notification_id: notification.id,
                status: 'unread'
            }));

            // Insert user notifications in batch
            await UserNotification.bulkCreate(userNotifications);

            return res.status(201).json({
                message: 'Tạo thông báo thành công',
                notificationId: notification.id
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Get notifications for a user
    async getNotification(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            // Get all notifications for the user, sorted by createdAt
            const notifications = await UserNotification.findAll({
                where: { user_id: userId },
                include: [{ model: Notification }],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                message: 'Success',
                notifications
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Delete notification
    async deleteNotification(req, res) {
        const transaction = await db.transaction();
        try {
            const { notificationId } = req.params;

            // Find the notification
            const notification = await Notification.findOne({
                where: { id: notificationId }
            });

            if (!notification) {
                return res.status(404).json({ message: 'Thông báo không tồn tại' });
            }

            if (notification.type === 'admin') {
                return res.status(403).json({ message: 'Bạn không được phép xóa thông báo từ admin' });
            }

            // Delete from UserNotifications and Notifications
            await UserNotification.destroy({ where: { notification_id: notificationId }, transaction });
            await Notification.destroy({ where: { id: notificationId }, transaction });

            await transaction.commit();
            return res.status(204).send(); // No Content
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }

    // Mark notification as read
    async markNotification(req, res) {
        try {
            const { userNotificationId } = req.params;

            // Update the status to read
            const result = await UserNotification.update(
                { status: 'read', read_at: new Date() },
                { where: { id: userNotificationId } }
            );

            if (result[0] === 0) {
                return res.status(404).json({
                    message: "Thông báo không tồn tại"
                });
            }

            return res.status(200).json({
                message: "Đánh dấu là đã đọc thông báo thành công"
            });
        } catch (err) {
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        }
    }
}

module.exports = new NotificationController();
