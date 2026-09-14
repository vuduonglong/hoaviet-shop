import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, User as UserIcon, Mail, ShieldCheck, MapPin, Phone, Edit2, Check, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phục vụ việc sửa SĐT
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  
  const { userInfo, updateProfile } = useAuthStore();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchMyOrders();
      setNewPhone(userInfo.phone || ''); // Đổ số cũ vào form
    }
  }, [userInfo]);

  const handleSavePhone = async () => {
    if (!newPhone) return alert("Vui lòng nhập số điện thoại");
    const success = await updateProfile(userInfo.token, newPhone);
    if (success) {
      alert("Cập nhật số điện thoại thành công!");
      setIsEditingPhone(false);
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

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'Processing': return 'Đang cắm hoa';
      case 'Delivering': return 'Đang giao hàng';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Đang tải dữ liệu tài khoản...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <UserIcon className="mr-3 text-pink-500" size={32} />
        Tài Khoản Của Tôi
      </h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-4xl font-black shadow-inner flex-shrink-0">
          {userInfo?.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start gap-2">
            {userInfo?.name}
            {userInfo?.role === 'Admin' && <ShieldCheck className="text-blue-500" size={20} title="Quản trị viên" />}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-600">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Mail size={18} className="text-pink-400" /> {userInfo?.email}
            </p>
            
            {/* KHU VỰC CẬP NHẬT SỐ ĐIỆN THOẠI */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone size={18} className="text-pink-400" /> 
              {isEditingPhone ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-pink-500 w-32 text-sm"
                    placeholder="Nhập SĐT..."
                  />
                  <button onClick={handleSavePhone} className="text-green-500 hover:text-green-600 bg-green-50 p-1 rounded">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setIsEditingPhone(false)} className="text-red-500 hover:text-red-600 bg-red-50 p-1 rounded">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{userInfo?.phone || 'Chưa cập nhật SĐT'}</span>
                  <button 
                    onClick={() => setIsEditingPhone(true)} 
                    className="text-pink-500 hover:text-pink-600 transition-colors p-1"
                    title="Cập nhật Số điện thoại"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>

            <p className="flex items-center justify-center md:justify-start gap-2">
              <MapPin size={18} className="text-pink-400" /> Vai trò: <strong className="text-pink-600">{userInfo?.role}</strong>
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Package className="mr-3 text-pink-500" size={28} />
        Lịch Sử Mua Hàng
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-5 font-semibold">Mã Đơn / Ngày</th>
                  <th className="p-5 font-semibold">Sản phẩm</th>
                  <th className="p-5 font-semibold text-center">Tổng Tiền</th>
                  <th className="p-5 font-semibold text-center">Thanh Toán</th>
                  <th className="p-5 font-semibold text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b last:border-b-0 hover:bg-pink-50/30 transition-colors align-top">
                    <td className="p-5">
                      <p className="font-mono font-bold text-pink-600 text-sm">#{order._id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                      <ul className="list-disc list-inside">
                        {order.orderItems.map(item => (
                          <li key={item._id} className="truncate max-w-[200px]" title={item.name}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-5 text-center">
                      <p className="font-bold text-gray-800">{order.totalAmount.toLocaleString()}đ</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentMethod === 'VNPay' ? 'Chuyển khoản' : 'COD'} - {order.paymentStatus === 'Paid' ? 'Đã thu' : 'Chưa thu'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;