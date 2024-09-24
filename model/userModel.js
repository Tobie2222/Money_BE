const db = require('../config/database');

const User = {
  user_id: 'user_id',
  name: 'name',
  password: 'password',
  email: 'email',
  image: 'image',
  isAdmin: 'isAdmin',
  gender: 'gender',
  password_reset_token: 'password_reset_token',
  password_reset_expiration: 'password_reset_expiration',
  created_at: 'created_at',
  updated_at: 'updated_at',
  slug_user: 'slug_user' // Thêm trường mới
};

module.exports = User;
