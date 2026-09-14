import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set) => ({
      // ==========================================
      // THÔNG TIN USER
      // ==========================================
      userInfo: null,

      loading: false,
      error: null,

      // ==========================================
      // ĐĂNG KÝ
      // ==========================================
      register: async (name, email, password) => {
        set({
          loading: true,
          error: null
        });

        try {
          const { data } = await axios.post(
            '/api/auth/register',
            {
              name,
              email,
              password
            }
          );

          console.log('Đăng ký thành công:', data);

          // Lưu thông tin user vào Zustand
          set({
            userInfo: data,
            loading: false,
            error: null
          });

          return true;

        } catch (error) {
          console.error(
            'Lỗi đăng ký:',
            error.response?.data || error.message
          );

          set({
            loading: false,
            error:
              error.response?.data?.message ||
              'Đăng ký thất bại'
          });

          return false;
        }
      },

      // ==========================================
      // ĐĂNG NHẬP
      // ==========================================
      login: async (email, password) => {
        set({
          loading: true,
          error: null
        });

        try {
          const { data } = await axios.post(
            '/api/auth/login',
            {
              email,
              password
            }
          );

          console.log('Đăng nhập thành công:', data);

          set({
            userInfo: data,
            loading: false,
            error: null
          });

          return true;

        } catch (error) {
          console.error(
            'Lỗi đăng nhập:',
            error.response?.data || error.message
          );

          set({
            error:
              error.response?.data?.message ||
              'Đăng nhập thất bại',
            loading: false
          });

          return false;
        }
      },

      // ==========================================
      // CẬP NHẬT SỐ ĐIỆN THOẠI
      // ==========================================
      updateProfile: async (token, phone) => {
        set({
          loading: true,
          error: null
        });

        try {
          const { data } = await axios.put(
            '/api/auth/profile',
            {
              phone
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // Cập nhật lại thông tin user
          set({
            userInfo: data,
            loading: false,
            error: null
          });

          return true;

        } catch (error) {
          console.error(
            'Lỗi cập nhật profile:',
            error.response?.data || error.message
          );

          set({
            error:
              error.response?.data?.message ||
              'Cập nhật thất bại',
            loading: false
          });

          return false;
        }
      },

      // ==========================================
      // ĐĂNG XUẤT
      // ==========================================
      logout: () => {
        // Xóa giỏ hàng nếu cần
        localStorage.removeItem('flower-shop-cart');

        set({
          userInfo: null,
          error: null,
          loading: false
        });
      }
    }),
    {
      name: 'flower-shop-auth'
    }
  )
);

export default useAuthStore;