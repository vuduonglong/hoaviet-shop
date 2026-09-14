const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Lưu lại giá tại thời điểm mua (vì giá hoa thay đổi liên tục)
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, 
      },
    ],
    totalAmount: { type: Number, required: true },
    
    // Thông tin người nhận và giao hàng chi tiết
    deliveryDetails: {
      receiverName: { type: String, required: true },
      receiverPhone: { type: String, required: true },
      shippingAddress: { type: String, required: true },
      deliveryDate: { type: Date, required: true }, // Ngày giao
      deliveryTimeSlot: { type: String }, // Khung giờ: VD "08:00 - 10:00"
      messageCard: { type: String }, // Lời nhắn in trên thiệp/băng rôn
    },

    // Trạng thái đơn và thanh toán
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivering', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['COD', 'VNPay', 'Stripe'], required: true },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },

    // Tích hợp (Sẽ được điền sau khi tạo đơn thành công)
    qrCodeUrl: { type: String }, // URL ảnh QR code để shipper quét xác nhận
    calendarEventId: { type: String }, // ID event trên Google Calendar của Staff
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);