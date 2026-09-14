const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Payload chỉ chứa id của user, secret key lấy từ file .env
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token có hiệu lực trong 7 ngày
  });
};

module.exports = generateToken;