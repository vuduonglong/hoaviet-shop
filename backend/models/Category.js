const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // VD: hoa-khai-truong
    description: { type: String },
    image: { type: String }, // URL ảnh từ Cloudinary
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);