import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Package, Upload, ArrowLeft, Save, Tag } from 'lucide-react';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const { userInfo } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); 
  
  // ĐÃ BỔ SUNG: isFlashSale và salePrice vào state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    stock: '',
    category: '',
    isFlashSale: false,
    salePrice: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // 1. Gọi API lấy danh mục thật từ MongoDB
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories/all');
        setCategories(data);
      } catch (error) {
        console.error('Lỗi lấy danh mục hoa', error);
      }
    };
    fetchCategories();

    // 2. NẾU LÀ CHẾ ĐỘ SỬA: Lấy thông tin cũ đổ vào Form
    if (isEditMode) {
      const fetchProductDetails = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            name: data.name,
            slug: data.slug,
            description: data.description,
            basePrice: data.basePrice,
            stock: data.stock,
            category: data.category?._id || data.category,
            // Đổ dữ liệu Flash Sale cũ ra (nếu có)
            isFlashSale: data.flashSale?.isFlashSale || false,
            salePrice: data.flashSale?.salePrice || '',
          });
          setImagePreview(data.images[0]); 
        } catch (error) {
          alert('Không thể tải thông tin sản phẩm này!');
        }
      };
      fetchProductDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const generateSlug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      setFormData({ ...formData, name: value, slug: generateSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug);
      submitData.append('description', formData.description);
      submitData.append('basePrice', formData.basePrice);
      submitData.append('stock', formData.stock);
      submitData.append('category', formData.category);
      
      // ĐÃ BỔ SUNG: Gửi thông tin Flash Sale về Backend
      submitData.append('flashSale[isFlashSale]', formData.isFlashSale);
      submitData.append('flashSale[salePrice]', formData.salePrice || 0);

      if (imageFile) {
        submitData.append('images', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${userInfo?.token}`
        }
      };

      if (isEditMode) {
        await axios.put(`/api/products/${id}`, submitData, config);
        alert('Cập nhật hoa thành công!');
      } else {
        await axios.post('/api/products', submitData, config);
        alert('Thêm hoa mới thành công!');
      }
      
      navigate('/admin/products'); 
      
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/products')} className="flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-8 border-b pb-4">
            <Package className="text-pink-500" />
            {isEditMode ? 'Sửa Thông Tin Bó Hoa' : 'Thêm Bó Hoa Mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tên bó hoa *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Đường dẫn (Slug) *</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-500" readOnly />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Giá bán Gốc (VNĐ) *</label>
                <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Số lượng tồn kho *</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Danh mục *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500">
                <option value="">-- Chọn danh mục hoa --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* KHU VỰC CẤU HÌNH FLASH SALE MỚI */}
            <div className="bg-pink-50/50 p-5 rounded-xl border border-pink-100 mt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isFlashSale"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData({...formData, isFlashSale: e.target.checked})}
                  className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                />
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <Tag size={18} className="text-pink-500" />
                  Bật chương trình Giảm giá (Flash Sale)
                </span>
              </label>

              {formData.isFlashSale && (
                <div className="mt-4 animate-fade-in-down">
                  <label className="block text-gray-700 font-medium mb-2">Giá Khuyến Mãi (VNĐ) *</label>
                  <input 
                    type="number" 
                    name="salePrice" 
                    value={formData.salePrice} 
                    onChange={handleChange} 
                    required={formData.isFlashSale}
                    className="w-full md:w-1/2 border border-pink-200 p-3 rounded-lg focus:outline-none focus:border-pink-500 bg-white" 
                    placeholder="Nhập giá sau khi đã giảm..."
                  />
                  <p className="text-xs text-pink-600 mt-2 italic">* Giá này sẽ đè lên giá gốc và hiển thị nhãn SALE ngoài trang chủ.</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Mô tả chi tiết *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Ảnh sản phẩm (Để trống nếu giữ ảnh cũ)</label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 relative hover:bg-gray-100 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <Upload size={24} />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Nhấp để đổi ảnh" />
                </div>
                {isEditMode && imagePreview && (
                  <span className="text-sm text-gray-500 italic">Nhấp vào ảnh để tải hình mới</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 mt-8">
              <Save size={20} />
              {loading ? 'Đang lưu...' : (isEditMode ? 'Lưu Cập Nhật' : 'Lưu Sản Phẩm')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;