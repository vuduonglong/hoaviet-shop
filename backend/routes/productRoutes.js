const express = require('express');

const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview // <-- ĐÃ BỔ SUNG: Khai báo hàm đánh giá
} = require('../controllers/productController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const upload = require('../config/cloudinary');

// ===============================
// LẤY DANH MỤC
// Phải đặt trước /:id
// ===============================
router.get('/categories/all', getCategories);

// ===============================
// PRODUCTS
// ===============================
router.route('/')
  .get(getProducts)
  .post(
    protect,
    authorize('Admin'),
    upload.array('images', 5),
    createProduct
  );

// ===============================
// API ĐÁNH GIÁ VÀ CHẤM SAO
// ===============================
router.route('/:id/reviews').post(protect, createProductReview);

// ===============================
// PRODUCT THEO ID
// ===============================
router.route('/:id')
  .get(getProductById)

  // Cho phép Admin sửa sản phẩm + upload tối đa 5 ảnh
  .put(
    protect,
    authorize('Admin'),
    upload.array('images', 5),
    updateProduct
  )

  .delete(
    protect,
    authorize('Admin'),
    deleteProduct
  );

module.exports = router;