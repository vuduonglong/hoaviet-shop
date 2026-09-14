import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, User, Flower2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  
  // ĐÃ SỬA LỖI: Lấy trực tiếp mảng cartItems ra dùng, không gọi hàm nữa
  const { cartItems, setActiveCart } = useCartStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // KHI USER THAY ĐỔI: Tự động đổi giỏ hàng sang đúng người đó
  useEffect(() => {
    setActiveCart(userInfo?._id);
  }, [userInfo, setActiveCart]);

  // ĐÃ SỬA LỖI: Đếm số lượng an toàn trực tiếp từ mảng cartItems
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    setActiveCart('guest'); // Trả về giỏ hàng của khách vãng lai
    navigate('/');
    setIsOpen(false);
  };

  // Hàm kiểm tra link đang active để đổi màu
  const isActive = (path) => {
    return location.pathname === path ? "text-pink-600 font-black" : "text-gray-600 font-bold hover:text-pink-500";
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* KHU VỰC LOGO */}
          <Link to="/" className="flex items-center space-x-2 text-pink-600 group">
            <Flower2 size={32} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="font-black text-2xl tracking-wide">HoaViet</span>
          </Link>

          {/* KHU VỰC MENU TRUNG TÂM (CHỈ HIỆN TRÊN MÁY TÍNH) */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors`}>Trang chủ</Link>
            <Link to="/shop" className={`${isActive('/shop')} transition-colors`}>Cửa hàng</Link>
            <Link to="/about" className={`${isActive('/about')} transition-colors`}>Về chúng tôi</Link>
          </div>

          {/* KHU VỰC TÀI KHOẢN VÀ GIỎ HÀNG (CHỈ HIỆN TRÊN MÁY TÍNH) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-50">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="flex items-center space-x-4">
                <Link to="/myorders" className="text-sm font-bold text-gray-700 hover:text-pink-600 hover:underline flex items-center gap-1.5 transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <User size={16} className="text-pink-500" />
                  {userInfo.name}
                </Link>
                
                {/* HIỂN THỊ MENU CHO ADMIN */}
                {userInfo.role === 'Admin' && (
                  <div className="flex gap-4 border-l-2 pl-4 border-gray-200">
                    <Link to="/admin" className="text-xs font-black uppercase text-blue-600 hover:text-blue-800 transition-colors">Thống kê</Link>
                    <Link to="/admin/orders" className="text-xs font-black uppercase text-pink-600 hover:text-pink-800 transition-colors">Đơn hàng</Link>
                    <Link to="/admin/products" className="text-xs font-black uppercase text-green-600 hover:text-green-800 transition-colors">Hoa</Link>
                  </div>
                )}

                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Đăng xuất">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="flex items-center space-x-1.5 text-gray-600 font-bold px-4 py-2 hover:text-pink-600 transition-colors">
                  <User size={18} /> <span>Đăng nhập</span>
                </Link>
                <Link to="/register" className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-md hover:shadow-pink-300">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* KHU VỰC MENU ĐIỆN THOẠI (NÚT BẤM) */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-800 p-2">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 p-1 focus:outline-none">
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* LỚP MÀN ĐEN CHE PHỦ KHI MỞ MENU MOBILE */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* DANH SÁCH MENU TRƯỢT XUỐNG DÀNH CHO MOBILE */}
      <div className={`fixed top-16 left-0 right-0 bg-white z-50 md:hidden transition-all duration-300 ease-in-out border-t border-gray-100 shadow-2xl ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="flex flex-col p-4 space-y-2">
          <Link onClick={() => setIsOpen(false)} to="/" className="p-3 text-lg font-bold text-gray-800 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors">Trang chủ</Link>
          <Link onClick={() => setIsOpen(false)} to="/shop" className="p-3 text-lg font-bold text-gray-800 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors">Cửa hàng Hoa</Link>
          <Link onClick={() => setIsOpen(false)} to="/about" className="p-3 text-lg font-bold text-gray-800 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors">Về chúng tôi</Link>
          
          {userInfo ? (
            <div className="mt-4 p-4 border border-pink-100 bg-pink-50/50 rounded-2xl">
              <Link onClick={() => setIsOpen(false)} to="/myorders" className="flex items-center gap-3 font-bold text-pink-600 mb-4 pb-4 border-b border-pink-100">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 shadow-inner">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-normal">Tài khoản của tôi</p>
                  <p className="text-lg">{userInfo.name}</p>
                </div>
              </Link>
              
              {userInfo.role === 'Admin' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link onClick={() => setIsOpen(false)} to="/admin" className="p-3 text-center text-sm font-bold text-blue-600 bg-blue-50 rounded-xl">Thống kê</Link>
                  <Link onClick={() => setIsOpen(false)} to="/admin/orders" className="p-3 text-center text-sm font-bold text-pink-600 bg-pink-100 rounded-xl">Đơn hàng</Link>
                  <Link onClick={() => setIsOpen(false)} to="/admin/products" className="p-3 text-center text-sm font-bold text-green-600 bg-green-50 rounded-xl">Quản lý Hoa</Link>
                  <Link onClick={() => setIsOpen(false)} to="/admin/users" className="p-3 text-center text-sm font-bold text-purple-600 bg-purple-50 rounded-xl">Tài khoản</Link>
                </div>
              )}
              
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-bold bg-white rounded-xl border border-red-100 hover:bg-red-50 transition-colors shadow-sm">
                <LogOut size={20} /> Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link onClick={() => setIsOpen(false)} to="/login" className="flex-1 text-center p-3.5 border-2 border-pink-500 text-pink-500 rounded-full font-bold hover:bg-pink-50 transition-colors">Đăng nhập</Link>
              <Link onClick={() => setIsOpen(false)} to="/register" className="flex-1 text-center p-3.5 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;