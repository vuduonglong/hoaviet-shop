import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { MapPin, CreditCard, Truck, QrCode } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCartStore();
  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  const [deliveryDetails, setDeliveryDetails] = useState({
    receiverName: userInfo?.name || '',
    receiverPhone: userInfo?.phone || '',
    shippingAddress: '',
    deliveryDate: '',
    messageCard: '', 
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // ĐÃ VÁ LỖI TẠI ĐÂY: Bỏ dependency để nó không tự động đá ra ngoài khi xóa giỏ hàng
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Bạn chưa đăng nhập!</h2>
        <p className="text-gray-600 mb-6 text-center">Vui lòng đăng nhập để hệ thống ghi nhận đơn hàng cho bạn nhé.</p>
        <Link to="/login" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 shadow-md">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        deliveryDetails: deliveryDetails,
        paymentMethod: paymentMethod, 
      };

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      const { data } = await axios.post('/api/orders', orderData, config);

      clearCart();
      // Truyền dữ liệu tổng tiền và phương thức sang trang Success để in mã QR
      navigate(`/order-success/${data.order._id}`, {
        state: { 
          totalAmount: data.order.totalAmount,
          paymentMethod: paymentMethod 
        }
      });
      
    } catch (error) {
      alert('Lỗi đặt hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Thanh Toán Đơn Hàng</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={submitOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="text-pink-500 mr-2" size={24} /> 
              Thông tin giao hoa
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tên người nhận *</label>
                  <input required type="text" name="receiverName" value={deliveryDetails.receiverName} onChange={handleChange} placeholder="VD: Nguyễn Văn A" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Số điện thoại *</label>
                  <input required type="text" name="receiverPhone" value={deliveryDetails.receiverPhone} onChange={handleChange} placeholder="VD: 0901234567" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Địa chỉ giao hàng chi tiết *</label>
                <input required type="text" name="shippingAddress" value={deliveryDetails.shippingAddress} onChange={handleChange} placeholder="Số nhà, Tên đường, Phường/Xã..." className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Ngày giao hoa mong muốn *</label>
                <input required type="date" name="deliveryDate" value={deliveryDetails.deliveryDate} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Lời nhắn (ghi trên thiệp)</label>
                <textarea name="messageCard" value={deliveryDetails.messageCard} onChange={handleChange} placeholder="Gửi gắm yêu thương..." className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"></textarea>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center pt-6 border-t">
              <CreditCard className="text-pink-500 mr-2" size={24} /> 
              Phương thức thanh toán
            </h2>
            
            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-pink-600" />
                <div className="ml-3">
                  <span className="block font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                  <span className="text-sm text-gray-500">Giao hoa tới tận tay rồi mới trả tiền.</span>
                </div>
                <Truck className="ml-auto text-gray-400" size={24} />
              </label>
              
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPay' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="VNPay" checked={paymentMethod === 'VNPay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-pink-600" />
                <div className="ml-3">
                  <span className="block font-bold text-gray-800">Chuyển khoản (MB Bank / MoMo)</span>
                  <span className="text-sm text-gray-500">Hệ thống tự động tạo mã QR quét cực nhanh.</span>
                </div>
                <QrCode className="ml-auto text-pink-500" size={24} />
              </label>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-pink-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-pink-600 transition-colors shadow-lg disabled:bg-gray-400">
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hoa'}
            </button>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border-t-4 border-pink-500">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Đơn hàng của bạn</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-semibold">{getCartTotal().toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-end border-t mt-4 pt-4">
                <span className="font-bold text-gray-800 text-lg">Tổng cộng:</span>
                <span className="font-bold text-pink-600 text-2xl">{getCartTotal().toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;