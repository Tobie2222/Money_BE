const db = require('../config/database');

class NotificationController {
    // Create notification
    async createNotification(req, res) {
        try {
            const { userId } = req.params;
            const { notification_name, desc_notification, priority } = req.body;

            // Check if the user is an admin
            const [admin] = await db.execute(
                'SELECT * FROM users WHERE user_id = ? AND isAdmin = 1', [userId]
            );
            if (admin.length === 0) {
                return res.status(403).json({
                    message: 'Bạn không có quyền thực hiện hành động này'
                });
            }

            // Insert new notification
            const [result] = await db.execute(
                'INSERT INTO notifications (notification_name, desc_notification, priority, type) VALUES (?, ?, ?, ?)',
                [notification_name, desc_notification, priority, 'admin']
            );
            const notificationId = result.insertId;

            // Get all users
            const [users] = await db.execute(
                'SELECT user_id FROM users'
            );
            const userNotifications = users.map(user => [user.user_id, notificationId, 'unread']);

            // Insert user notifications in batch
            await db.execute(
                'INSERT INTO user_notifications (user_id, notification_id, status) VALUES ?', [userNotifications]
            );

            return res.status(201).json({
                message: 'Tạo thông báo thành công',
                notificationId
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
            const [notifications] = await db.execute(
                `SELECT n.*, un.status 
                 FROM user_notifications un 
                 JOIN notifications n ON un.notification_id = n.notification_id 
                 WHERE un.user_id = ? 
                 ORDER BY n.created_at DESC 
                 LIMIT ? OFFSET ?`, 
                 [userId, Number(limit), Number(offset)]
            );

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
        const connection = await db.getConnection();
        try {
            const { notificationId } = req.params;
            await connection.beginTransaction();

            // Find the notification
            const [notification] = await connection.execute('SELECT * FROM notifications WHERE notification_id = ?', [notificationId]);
            if (notification.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Thông báo không tồn tại' });
            }

            if (notification[0].type === 'admin') {
                await connection.rollback();
                return res.status(403).json({ message: 'Bạn không được phép xóa thông báo từ admin' });
            }

            // Delete from user_notifications and notifications
            await connection.execute('DELETE FROM user_notifications WHERE notification_id = ?', [notificationId]);
            await connection.execute('DELETE FROM notifications WHERE notification_id = ?', [notificationId]);

            await connection.commit();
            return res.status(204).send(); // No Content
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ message: `Lỗi: ${err.message}` });
        } finally {
            connection.release();
        }
    }

    // Mark notification as read
    async markNotification(req, res) {
        try {
            const { userNotificationId } = req.params;

            // Update the status to read
            const [result] = await db.execute('UPDATE user_notifications SET status = ? WHERE id = ?', ['read', userNotificationId]);

            if (result.affectedRows === 0) {
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
