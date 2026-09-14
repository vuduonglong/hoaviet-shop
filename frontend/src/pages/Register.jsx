import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  Flower2,
  User,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Lấy đúng state/action đang có trong authStore (không phải setUserInfo)
  const { register, userInfo, loading, error } = useAuthStore();

  // Nếu đã đăng nhập thì chuyển về trang chủ
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const success = await register(name.trim(), email.trim(), password);

    if (success) {
      alert('Đăng ký thành công! Chào mừng bạn đến với HoaViet.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Flower2 className="h-10 w-10 text-pink-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Đăng Ký Tài Khoản
          </h2>

          <p className="text-gray-500">
            Trở thành thành viên của HoaViet ngay hôm nay
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full border border-gray-300 p-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  placeholder="Nhập họ và tên..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-300 p-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  placeholder="Địa chỉ email của bạn..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="pl-10 w-full border border-gray-300 p-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  placeholder="Ít nhất 6 ký tự..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-300/50 disabled:bg-gray-400 disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-bold text-pink-600 hover:text-pink-500 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;