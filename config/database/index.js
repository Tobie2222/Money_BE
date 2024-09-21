  const mysql = require('mysql2');

  const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'root', 
    database: 'Money' 
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL!');
  });
  // Export kết nối để sử dụng trong các file khác
  module.exports = connection;