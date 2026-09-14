const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// ==========================================
// ĐĂNG KÝ TÀI KHOẢN
// ==========================================
// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email này đã được sử dụng!'
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    // role mặc định sẽ lấy từ Model User
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({
        message: 'Dữ liệu không hợp lệ'
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};


// ==========================================
// ĐĂNG NHẬP
// ==========================================
// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user bằng email
    const user = await User.findOne({ email });

    // So sánh mật khẩu
    if (user && (await bcrypt.compare(password, user.password))) {

      // Kiểm tra tài khoản có bị khóa không
      if (!user.isActive) {
        return res.status(403).json({
          message: 'Tài khoản của bạn đã bị khóa.'
        });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });

    } else {
      res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};


// ==========================================
// LẤY DANH SÁCH USER - ADMIN
// ==========================================
// @desc    Lấy danh sách tất cả user
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};


// ==========================================
// CẬP NHẬT USER - ADMIN
// ==========================================
// @desc    Cập nhật quyền hoặc khóa tài khoản user
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng'
      });
    }

    // Cập nhật role
    if (req.body.role) {
      user.role = req.body.role;
    }

    // Cập nhật trạng thái tài khoản
    if (req.body.isActive !== undefined) {
      user.isActive = req.body.isActive;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.phone = req.body.phone || user.phone;
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone, // Trả về sđt mới
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = { registerUser, loginUser, getUsers, updateUserByAdmin, updateUserProfile };