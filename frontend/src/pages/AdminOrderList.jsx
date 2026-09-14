import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { ClipboardList, AlertCircle, Phone, MapPin } from 'lucide-react';

const AdminOrderList = () => {
  const { userInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.role === 'Admin') {
      fetchOrders();
    }
  }, [userInfo]);

  const handleStatusChange = async (orderId, newStatus, newPaymentStatus = null) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, 
        { 
          status: newStatus,
          paymentStatus: newPaymentStatus
        },
        { headers: { Authorization: `Bearer ${userInfo?.token}` }}
      );
      alert('Cập nhật đơn hàng thành công!');
      fetchOrders(); 
    } catch (error) {
      alert('Lỗi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivering': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu đơn hàng...</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="text-pink-500" />
            Quản lý Đơn Hàng
          </h2>
          <p className="text-gray-500 text-sm mt-1">Theo dõi, thu tiền và cập nhật tiến độ giao hoa</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-gray-100">
          <AlertCircle className="mx-auto mb-2 text-gray-400" size={40} />
          <p className="text-gray-500">Chưa có đơn hàng nào trong hệ thống!</p>
        </div>
      ) : (
        <>
          {/* GIAO DIỆN BẢNG DÀNH CHO MÁY TÍNH */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-semibold">Mã đơn / Ngày</th>
                  <th className="p-4 font-semibold">Thông tin nhận</th>
                  <th className="p-4 font-semibold">Sản phẩm</th>
                  <th className="p-4 font-semibold">Tổng tiền</th>
                  <th className="p-4 font-semibold text-center w-40">Thanh toán</th>
                  <th className="p-4 font-semibold text-center">Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors align-top">
                    <td className="p-4">
                      <p className="font-mono font-bold text-pink-600 text-sm">#{order._id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('vi-VN')} <br/>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-bold text-gray-800">{order.deliveryDetails?.receiverName}</p>
                      <p className="text-gray-600 font-mono flex items-center gap-1 mt-1"><Phone size={12}/> {order.deliveryDetails?.receiverPhone}</p>
                      <p className="text-gray-500 text-xs mt-1 max-w-[200px] truncate" title={order.deliveryDetails?.shippingAddress}>
                        {order.deliveryDetails?.shippingAddress}
                      </p>
                    </td>
                    <td className="p-4 text-sm">
                      <ul className="list-disc list-inside text-gray-600">
                        {order.orderItems.map(item => (
                          <li key={item._id} className="truncate max-w-[150px]" title={item.name}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-gray-800">{order.totalAmount.toLocaleString()}đ</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1.5 rounded text-[11px] font-bold block mb-2 ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.paymentMethod === 'VNPay' ? 'Chuyển khoản' : 'COD'} - {order.paymentStatus === 'Paid' ? 'Đã thu tiền' : 'Chưa thu tiền'}
                      </span>
                      {order.paymentStatus !== 'Paid' && order.paymentMethod === 'VNPay' && (
                        <button onClick={() => handleStatusChange(order._id, order.status, 'Paid')} className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 font-bold shadow-sm w-full">
                          Xác nhận Tiền
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border-2 focus:outline-none cursor-pointer w-36 ${getStatusColor(order.status)} border-transparent hover:border-pink-300`}
                      >
                        <option value="Pending">Chờ xác nhận</option>
                        <option value="Processing">Đang cắm hoa</option>
                        <option value="Delivering">Đang giao</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GIAO DIỆN THẺ (CARD) DÀNH CHO ĐIỆN THOẠI */}
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                  <span className="font-mono font-black text-pink-600 text-lg">#{order._id.substring(0, 8)}</span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="font-bold text-gray-800 text-lg mb-1">{order.deliveryDetails?.receiverName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded"><Phone size={14} className="text-pink-500"/> {order.deliveryDetails?.receiverPhone}</p>
                  <p className="text-sm text-gray-600 flex items-start gap-1.5 mt-2 line-clamp-2"><MapPin size={14} className="text-pink-500 mt-1 flex-shrink-0"/> {order.deliveryDetails?.shippingAddress}</p>
                </div>

                <div className="bg-pink-50/50 border border-pink-100 p-3 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-bold text-gray-700">Tổng tiền:</p>
                    <p className="text-lg font-black text-pink-600">{order.totalAmount.toLocaleString()}đ</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500">{order.paymentMethod === 'VNPay' ? 'Chuyển khoản' : 'Thanh toán COD'}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {order.paymentStatus === 'Paid' ? 'Đã thu tiền' : 'Chưa thu tiền'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`flex-1 px-2 py-3 rounded-xl text-sm font-bold focus:outline-none text-center ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Chờ xác nhận</option>
                    <option value="Processing">Đang cắm hoa</option>
                    <option value="Delivering">Đang giao</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                  
                  {order.paymentStatus !== 'Paid' && order.paymentMethod === 'VNPay' && (
                    <button onClick={() => handleStatusChange(order._id, order.status, 'Paid')} className="flex-1 text-sm bg-blue-500 text-white px-2 py-3 rounded-xl font-bold shadow-sm">
                      Xác nhận Tiền
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrderList;