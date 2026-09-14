import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Users, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';

const AdminUserList = () => {
  const { userInfo } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách user từ Backend
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.role === 'Admin') {
      fetchUsers();
    }
  }, [userInfo]);

  // Hàm đổi quyền (Role) hoặc khóa/mở khóa tài khoản
  const handleUpdateUser = async (userId, newRole, newActiveStatus) => {
    try {
      await axios.put(`/api/auth/users/${userId}`, 
        { role: newRole, isActive: newActiveStatus },
        { headers: { Authorization: `Bearer ${userInfo?.token}` }}
      );
      alert('Cập nhật quyền tài khoản thành công!');
      fetchUsers();
    } catch (error) {
      alert('Lỗi cập nhật: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách người dùng...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-pink-500" />
            Quản Lý Người Dùng & Phân Quyền
          </h2>
          <p className="text-gray-500 text-sm mt-1">Phân quyền tài khoản (Admin, Staff, Customer) và quản lý trạng thái hoạt động</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                <th className="p-4 font-semibold">Họ và tên</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Số điện thoại</th>
                <th className="p-4 font-semibold text-center">Vai trò (Role)</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác đổi quyền</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors align-middle">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                      <Shield size={16} className={u.role === 'Admin' ? 'text-pink-600' : 'text-gray-400'} />
                      {u.name}
                    </td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4 text-gray-600 font-mono">{u.phone || 'Chưa cập nhật'}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'Admin' ? 'bg-pink-100 text-pink-800' : u.role === 'Staff' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* Dropdown thay đổi Role */}
                        <select 
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u._id, e.target.value, u.isActive)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white font-medium focus:outline-none focus:border-pink-500"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Staff">Staff</option>
                          <option value="Admin">Admin</option>
                        </select>

                        {/* Nút Khóa / Mở khóa tài khoản */}
                        <button 
                          onClick={() => handleUpdateUser(u._id, u.role, u.isActive === false ? true : false)}
                          className={`p-2 rounded text-white text-xs font-bold ${u.isActive !== false ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                          title={u.isActive !== false ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {u.isActive !== false ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
                    Không có người dùng nào trong hệ thống!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;