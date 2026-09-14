const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Sẽ được mã hóa bằng bcrypt
    phone: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: ['Admin', 'Staff', 'Customer'],
      default: 'Customer',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model('User', userSchema);