const mongoose = require('mongoose');

// Schema phụ dành riêng cho từng bài Đánh giá
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Schema chính của Sản phẩm
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    images: [{ type: String }], 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0 },
    
    tags: [{ type: String }], 
    occasions: [{ type: String }], 
    
    flashSale: {
      isFlashSale: { type: Boolean, default: false },
      salePrice: { type: Number, default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
    
    isAvailable: { type: Boolean, default: true },

    // ĐÃ BỔ SUNG: Dữ liệu Đánh giá & Chấm sao
    reviews: [reviewSchema], // Mảng chứa các bài đánh giá
    rating: { type: Number, required: true, default: 0 }, // Điểm trung bình
    numReviews: { type: Number, required: true, default: 0 }, // Tổng số lượt đánh giá
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);