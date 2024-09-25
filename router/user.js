const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, verifyUser, verifyAdmin } = require('../middleware/verifyToken');

// GET: Lấy dữ liệu (không thay đổi dữ liệu).
// POST: Gửi dữ liệu để tạo tài nguyên mới.
// PUT: Cập nhật hoặc thay thế tài nguyên hiện có.
// [UpdateUser]
Router.put('/updateUser/:userId', verifyUser, userController.updateUser);
// [getUser]
Router.get('/getUser/:userId', verifyUser, userController.getDetailUser);
// [createUser]
Router.post('/createUser', verifyAdmin, userController.createUser);
// [deleteUser]
Router.delete('/deleteUser/:userId', verifyAdmin, userController.deleteUser);
// [get All Users]
Router.get('/getAllUser', verifyAdmin, userController.getAllUser);
// [find User]
Router.get('/findUser', verifyAdmin, userController.findUser);
module.exports = Router;
