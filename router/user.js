const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, verifyUser, verifyAdmin }  =  require('../middleware/verifyToken')

// GET: Lấy dữ liệu (không thay đổi dữ liệu).
// POST: Gửi dữ liệu để tạo tài nguyên mới.
// PUT: Cập nhật hoặc thay thế tài nguyên hiện có.

