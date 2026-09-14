// backend/services/orderService.js
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// 1. Hàm tạo QR Code
const generateOrderQR = async (orderId) => {
  try {
    const trackingUrl = `${process.env.FRONTEND_URL}/admin/orders/${orderId}/update`;
    const qrDataUrl = await QRCode.toDataURL(trackingUrl);
    return qrDataUrl; // Trả về chuỗi base64 dạng ảnh
  } catch (error) {
    console.error('Lỗi tạo QR:', error);
  }
};

// 2. Hàm gửi Email
const sendOrderEmail = async (email, orderDetails, qrImage) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: '"FlowerShop" <no-reply@flowershop.com>',
    to: email,
    subject: 'Xác nhận đơn hàng hoa tươi',
    html: `<h3>Cảm ơn bạn đã đặt hoa!</h3>
           <p>Mã đơn hàng: ${orderDetails._id}</p>
           <p>Shipper sẽ quét mã QR bên dưới để xác nhận giao hoa thành công.</p>`,
    attachments: [{ filename: 'qrcode.png', path: qrImage, cid: 'qrcode' }]
  });
};

module.exports = { generateOrderQR, sendOrderEmail };