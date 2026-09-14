import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  page: 1,
  pages: 1,
  total: 0,
  loading: false,
  
  // ĐÃ NÂNG CẤP: Hàm fetch động nhận thông số lọc, phân trang và sắp xếp
  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const { keyword = '', category = '', minPrice = '', maxPrice = '', sort = '', page = 1 } = params;
      
      // Xây dựng đường dẫn gọi API động
      let query = `/api/products?page=${page}`;
      if (keyword) query += `&keyword=${keyword}`;
      if (category && category !== 'Tất cả') query += `&category=${category}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;
      if (sort) query += `&sort=${sort}`;

      const { data } = await axios.get(query);
      
      // Cập nhật cả danh sách sản phẩm lẫn thông tin trang
      set({ 
        products: data.products || data, 
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0,
        loading: false 
      });
      
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách hoa:', error);
      set({ loading: false });
    }
  }
}));

export default useProductStore;