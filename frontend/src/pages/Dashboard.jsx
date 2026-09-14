import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  const { userInfo } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Tận dụng API lấy toàn bộ đơn hàng của Admin
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });

        // 1. TÍNH TOÁN CÁC CHỈ SỐ TỔNG QUAN
        const totalOrders = data.length;
        
        // Tính tổng doanh thu (Chỉ cộng tiền những đơn Đã Thanh Toán)
        const totalRevenue = data.reduce((sum, order) => {
          return order.paymentStatus === 'Paid' ? sum + order.totalAmount : sum;
        }, 0);

        // Đếm số lượng khách hàng duy nhất
        const uniqueCustomers = new Set(data.map(order => order.customer?._id)).size;

        setStats({ totalRevenue, totalOrders, totalCustomers: uniqueCustomers });

        // 2. XỬ LÝ DỮ LIỆU BIỂU ĐỒ (7 ngày gần nhất)
        // Tạo mảng 7 ngày gần nhất với doanh thu ban đầu là 0
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            name: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            dateStr: d.toISOString().split('T')[0], // Dạng YYYY-MM-DD để so sánh
            revenue: 0
          };
        });

        // Đắp tiền từ các đơn hàng "Đã thanh toán" vào đúng ngày
        data.forEach(order => {
          if (order.paymentStatus === 'Paid') {
            const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
            const dayIndex = last7Days.findIndex(day => day.dateStr === orderDateStr);
            if (dayIndex !== -1) {
              last7Days[dayIndex].revenue += order.totalAmount;
            }
          }
        });

        setChartData(last7Days);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.role === 'Admin') {
      fetchAnalytics();
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[60vh]">
        <Activity className="animate-spin text-pink-500 mb-4" size={40} />
        <p>Đang phân tích số liệu kinh doanh...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-pink-500" />
          Tổng Quan Kinh Doanh
        </h2>
        <p className="text-gray-500 text-sm mt-1">Số liệu thực tế cập nhật theo thời gian thực từ hệ thống</p>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-pink-500 transition-transform hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Tổng Doanh Thu (Đã thu)</p>
            <p className="text-3xl font-black text-gray-800">{stats.totalRevenue.toLocaleString()}đ</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-full">
            <DollarSign className="text-pink-500" size={28} />
          </div>
        </div>
        
        {/* Đơn hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-blue-500 transition-transform hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Tổng Đơn Hàng</p>
            <p className="text-3xl font-black text-gray-800">{stats.totalOrders}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-full">
            <ShoppingBag className="text-blue-500" size={28} />
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-green-500 transition-transform hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Khách Hàng Duy Nhất</p>
            <p className="text-3xl font-black text-gray-800">{stats.totalCustomers}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full">
            <Users className="text-green-500" size={28} />
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Biểu đồ doanh thu 7 ngày gần nhất</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              
              {/* Định dạng số tiền bên trục Y cho dễ nhìn (VD: 1,500,000 -> 1.5M) */}
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}}
                tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value > 0 ? `${value / 1000}k` : '0'} 
              />
              
              <Tooltip 
                cursor={{fill: '#fce7f3'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#ec4899" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;