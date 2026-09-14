import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
// Layouts & Components
import MainLayout from './layouts/MainLayout';
import AdminRoute from './components/AdminRoute';
// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';
import AdminProductList from './pages/AdminProductList';
import AdminProductForm from './pages/AdminProductForm';
import About from './pages/About';
import AdminOrderList from './pages/AdminOrderList';
import AdminUserList from './pages/AdminUserList';

// --- Component báo đặt hàng thành công ---
const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const { totalAmount, paymentMethod } = location.state || {};
  const BANK_ID = 'MB'; 
  const ACCOUNT_NO = '0663150800000'; 
  const ACCOUNT_NAME = 'VU DUONG LONG'; 
  const transferContent = `Thanh toan don hoa ${id?.substring(0, 8)}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${transferContent}&accountName=${ACCOUNT_NAME}`;
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50">
      <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công! 🎉</h2>
        <p className="text-gray-600 mb-6">Mã đơn hàng: <strong className="font-mono text-pink-600">{id}</strong></p>
        
        {paymentMethod === 'VNPay' && totalAmount && (
          <div className="bg-pink-50 p-6 rounded-xl border border-pink-200 mb-8 inline-block w-full">
            <h3 className="text-lg font-bold text-pink-600 mb-4">Vui lòng quét mã QR để thanh toán</h3>
            <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
              <img src={qrUrl} alt="Mã QR Thanh Toán" className="w-64 h-64 mx-auto" />
            </div>
            <div className="mt-4 text-left text-sm text-gray-700 bg-white p-4 rounded-lg border">
              <p className="mb-2"><strong>Ngân hàng:</strong> MB Bank</p>
              <p className="mb-2"><strong>Chủ tài khoản:</strong> {ACCOUNT_NAME}</p>
              <p className="mb-2"><strong>Số tài khoản:</strong> {ACCOUNT_NO}</p>
              <p className="mb-2"><strong>Số tiền:</strong> <span className="font-bold text-pink-600">{totalAmount.toLocaleString()}đ</span></p>
              <p><strong>Nội dung:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{transferContent}</span></p>
            </div>
          </div>
        )}

        {paymentMethod === 'COD' && (
           <p className="text-gray-600 mb-8 text-sm bg-gray-100 p-4 rounded-lg">
             Chúng tôi sẽ liên hệ với bạn để xác nhận. Bạn sẽ thanh toán bằng tiền mặt khi nhận hoa.
           </p>
        )}

        <Link to="/myorders" className="inline-block w-full bg-pink-500 text-white font-bold px-6 py-3 rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg">
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="cart" element={<Cart />} />
          <Route path="shop" element={<Shop />} />
          <Route path="myorders" element={<MyOrders />} />
        </Route>

       {/* --- ADMIN ROUTES --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/orders" element={<AdminOrderList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;