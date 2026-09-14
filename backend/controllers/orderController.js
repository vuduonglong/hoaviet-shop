const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { orderItems, deliveryDetails, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'Giỏ hàng trống' });

    let calculatedTotal = 0;
    const itemsToSave = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Không tìm thấy sản phẩm` });
      
      let currentPrice = product.basePrice;
      if (product.flashSale?.isFlashSale) currentPrice = product.flashSale.salePrice;

      calculatedTotal += currentPrice * item.quantity;
      itemsToSave.push({ product: product._id, name: product.name, quantity: item.quantity, price: currentPrice });
    }

    const order = new Order({ customer: req.user._id, orderItems: itemsToSave, deliveryDetails, paymentMethod, totalAmount: calculatedTotal });
    const createdOrder = await order.save();
    res.status(201).json({ message: 'Đặt hàng thành công', order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    // Nhận thêm biến paymentStatus từ Frontend gửi lên
    const { status, paymentStatus } = req.body; 
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    
    // Cập nhật trạng thái tiến độ (Chờ xử lý, Đang giao...)
    if (status) order.status = status;
    
    // Cập nhật trạng thái tiền bạc (Đã thanh toán)
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Logic tự động: Nếu COD mà giao hàng thành công thì coi như đã thu tiền
    if (status === 'Completed' && order.paymentMethod === 'COD') order.paymentStatus = 'Paid';
    
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('customer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

module.exports = { createOrder, updateOrderStatus, getMyOrders, getAllOrders };