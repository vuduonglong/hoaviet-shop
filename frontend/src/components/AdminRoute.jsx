import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminRoute = () => {
  const { userInfo } = useAuthStore();

  // Kiểm tra 1: Chưa đăng nhập -> Đá về trang Login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra 2: Đã đăng nhập nhưng Role không phải Admin -> Đá về Trang chủ
  if (userInfo.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // Đủ điều kiện -> Cho phép đi tiếp vào các trang Admin (Outlet)
  return <Outlet />;
};

export default AdminRoute;