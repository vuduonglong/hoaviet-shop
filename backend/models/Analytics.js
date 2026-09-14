const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true }, // Đưa về 00:00:00 của ngày
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);