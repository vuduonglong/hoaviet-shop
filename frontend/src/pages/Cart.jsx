import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  // GIAO DIỆN KHI GIỎ HÀNG TRỐNG
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-full shadow-sm mb-6 border border-pink-50">
          <ShoppingBag size={80} className="text-pink-200" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-3 text-center">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md text-lg">Hãy tìm những đóa hoa rực rỡ nhất để dành tặng những người thân yêu của bạn nhé!</p>
        <Link to="/" className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg hover:shadow-pink-300 flex items-center gap-2 text-lg">
          <ArrowLeft size={24} /> Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // GIAO DIỆN KHI CÓ HÀNG TRONG GIỎ
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 border-b pb-4">Giỏ Hàng Của Bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="lg:w-2/3">
          
          {/* 1. HIỂN THỊ DẠNG BẢNG TRÊN MÁY TÍNH (ẨN TRÊN MOBILE) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b">
                  <th className="p-5 font-semibold">Sản phẩm</th>
                  <th className="p-5 font-semibold text-center">Đơn giá</th>
                  <th className="p-5 font-semibold text-center w-36">Số lượng</th>
                  <th className="p-5 font-semibold text-right">Thành tiền</th>
                  <th className="p-5 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const atMaxStock = item.stock !== undefined && item.quantity >= item.stock;
                  return (
                    <tr key={item.product} className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" />
                        <div>
                          <Link to={`/product/${item.product}`} className="font-bold text-gray-800 hover:text-pink-600 text-base line-clamp-2">
                            {item.name}
                          </Link>
                          {atMaxStock && (
                            <p className="text-xs text-orange-500 font-medium mt-1">Đã đạt số lượng tồn kho tối đa</p>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-center font-medium text-gray-600">
                        {item.price.toLocaleString()}đ
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center border border-gray-200 rounded-full bg-white">
                          <button onClick={() => updateQuantity(item.product, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 text-gray-400 hover:text-pink-600 disabled:opacity-50 transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product, item.quantity + 1)} disabled={atMaxStock} className="p-2 text-gray-400 hover:text-pink-600 disabled:opacity-30 transition-colors">
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-5 text-right font-black text-pink-600 text-lg">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                      <td className="p-5 text-center">
                        <button onClick={() => removeFromCart(item.product)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" title="Xóa khỏi giỏ hàng">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 2. HIỂN THỊ DẠNG THẺ TRÊN ĐIỆN THOẠI (ẨN TRÊN MÁY TÍNH) */}
          <div className="md:hidden space-y-4">
            {cartItems.map((item) => {
              const atMaxStock = item.stock !== undefined && item.quantity >= item.stock;
              return (
                <div key={item.product} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-between">
                    <Link to={`/product/${item.product}`} className="font-bold text-gray-800 hover:text-pink-600 text-sm line-clamp-2 pr-6">
                      {item.name}
                    </Link>
                    <p className="text-pink-600 font-black mt-1 text-lg">{item.price.toLocaleString()}đ</p>
                    {atMaxStock && (
                      <p className="text-xs text-orange-500 font-medium">Đã đạt số lượng tồn kho tối đa</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white h-9">
                        <button onClick={() => updateQuantity(item.product, item.quantity - 1)} disabled={item.quantity <= 1} className="px-3 text-gray-500 disabled:opacity-50"><Minus size={16} /></button>
                        <span className="w-6 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product, item.quantity + 1)} disabled={atMaxStock} className="px-3 text-gray-500 disabled:opacity-30"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  {/* Nút xóa góc phải */}
                  <button onClick={() => removeFromCart(item.product)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-1 bg-white rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* NÚT QUAY LẠI MUA SẮM */}
          <div className="mt-8 hidden md:block">
            <Link to="/" className="inline-flex items-center text-gray-500 font-medium hover:text-pink-600 transition-colors bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:border-pink-200">
              <ArrowLeft size={18} className="mr-2" /> Tiếp tục lựa hoa
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG TÓM TẮT THANH TOÁN */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-lg shadow-pink-100/50 p-6 md:p-8 border-t-8 border-pink-500 sticky top-24">
            <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-wide">Tổng Đơn Hàng</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between items-center">
                <span>Tạm tính ({cartItems.length} loại hoa):</span>
                <span className="font-bold text-gray-800">{getCartTotal().toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-sm border border-green-100">Miễn phí nội thành</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-gray-800 text-lg">Tổng cộng:</span>
              <span className="font-black text-pink-600 text-3xl">{getCartTotal().toLocaleString()}đ</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-pink-500 text-white font-bold text-lg py-4 rounded-2xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-400/50 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Tiến Hành Đặt Hoa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;