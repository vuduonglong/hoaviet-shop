const Order = require('../models/Order');
const Product = require('../models/Product');

// ==========================================
// TẠO ĐƠN HÀNG (có kiểm tra & trừ tồn kho)
// ==========================================
const createOrder = async (req, res) => {
  try {
    const { orderItems, deliveryDetails, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // BƯỚC 1: Kiểm tra tồn kho trước cho TẤT CẢ sản phẩm
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho, không đủ số lượng bạn chọn.`
        });
      }
    }

    // BƯỚC 2: Trừ kho an toàn (atomic), tránh 2 khách mua cùng lúc làm âm kho
    let calculatedTotal = 0;
    const itemsToSave = [];
    const deductedItems = []; // để hoàn kho nếu giữa chừng có lỗi

    try {
      for (const item of orderItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error('Sản phẩm vừa hết hàng, vui lòng thử lại.');
        }

        deductedItems.push({ id: updatedProduct._id, quantity: item.quantity });

        // Hết sạch hàng -> đánh dấu ngừng bán
        if (updatedProduct.stock <= 0 && updatedProduct.isAvailable) {
          updatedProduct.isAvailable = false;
          await updatedProduct.save();
        }

        let currentPrice = updatedProduct.basePrice;
        if (updatedProduct.flashSale?.isFlashSale) {
          currentPrice = updatedProduct.flashSale.salePrice;
        }

        calculatedTotal += currentPrice * item.quantity;
        itemsToSave.push({
          product: updatedProduct._id,
          name: updatedProduct.name,
          quantity: item.quantity,
          price: currentPrice
        });
      }
    } catch (stockError) {
      // Hoàn lại kho cho các sản phẩm đã trừ trước đó trong vòng lặp này
      for (const d of deductedItems) {
        await Product.findByIdAndUpdate(d.id, {
          $inc: { stock: d.quantity },
          isAvailable: true
        });
      }
      return res.status(400).json({ message: stockError.message });
    }

    const order = new Order({
      customer: req.user._id,
      orderItems: itemsToSave,
      deliveryDetails,
      paymentMethod,
      totalAmount: calculatedTotal
    });

    const createdOrder = await order.save();
    res.status(201).json({ message: 'Đặt hàng thành công', order: createdOrder });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ==========================================
// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (hoàn kho nếu huỷ)
// ==========================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const wasAlreadyCancelled = order.status === 'Cancelled';

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (status === 'Completed' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    // Nếu đơn bị huỷ (và trước đó chưa từng huỷ) -> hoàn lại kho
    if (status === 'Cancelled' && !wasAlreadyCancelled) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
          isAvailable: true
        });
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

// ==========================================
// LẤY ĐƠN HÀNG CỦA CHÍNH KHÁCH ĐANG ĐĂNG NHẬP
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

// ==========================================
// LẤY TẤT CẢ ĐƠN HÀNG - ADMIN/STAFF
// ==========================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('customer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi', error: error.message });
  }
};

module.exports = { createOrder, updateOrderStatus, getMyOrders, getAllOrders };