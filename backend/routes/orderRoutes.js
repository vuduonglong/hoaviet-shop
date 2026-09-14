const express = require('express');
const router = express.Router();
const { createOrder, updateOrderStatus, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/myorders').get(protect, getMyOrders);

router.route('/')
  .post(protect, authorize('Customer', 'Admin', 'Staff'), createOrder)
  .get(protect, authorize('Admin', 'Staff'), getAllOrders); 

router.route('/:id/status').put(protect, authorize('Admin', 'Staff'), updateOrderStatus);

module.exports = router;