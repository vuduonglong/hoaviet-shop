import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AIChatbox from '../components/AIChatbox';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header dùng chung */}
      <Navbar />
      
      {/* Nội dung thay đổi theo từng trang sẽ render ở đây */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* TRỢ LÝ ẢO LUÔN HIỂN THỊ */}
      <AIChatbox />

      {/* Footer dùng chung */}
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-pink-400 mb-2">HoaViet - Gửi trao yêu thương</h3>
          <p className="text-gray-400 text-sm">Hệ thống đặt hoa online uy tín, giao nhanh trong 2h.</p>
          <p className="text-gray-500 text-xs mt-4">© 2026 HoaViet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;