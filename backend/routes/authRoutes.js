const express = require('express');

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  updateUserByAdmin,
  updateUserProfile
} = require('../controllers/authController');

const {
  protect,
  authorize
} = require('../middlewares/authMiddleware');


// ===============================
// API ĐĂNG KÝ (PUBLIC)
// ===============================
router.post('/register', registerUser);


// ===============================
// API ĐĂNG NHẬP (PUBLIC)
// ===============================
router.post('/login', loginUser);


// ===============================
// API LẤY USER ĐANG ĐĂNG NHẬP (PRIVATE)
// ===============================
router.get('/me', protect, async (req, res) => {
  // req.user được gán từ middleware protect
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});


// ===============================
// API KHÁCH HÀNG TỰ CẬP NHẬT PROFILE
// ===============================
router.put(
  '/profile',
  protect,
  updateUserProfile
);


// ===============================
// API QUẢN LÝ USER - ADMIN
// ===============================

// Lấy danh sách tất cả user
router.route('/users')
  .get(
    protect,
    authorize('Admin'),
    getUsers
  );


// Cập nhật user theo ID
router.route('/users/:id')
  .put(
    protect,
    authorize('Admin'),
    updateUserByAdmin
  );


module.exports = router;