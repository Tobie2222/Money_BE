const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');


dotenv.config();

// Tạo đối tượng Sequelize để kết nối MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', 
  logging: false    
});

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối MySQL thành công!');
  } catch (err) {
    console.error('Không thể kết nối MySQL:', err);
  }
})();

module.exports = sequelize;
