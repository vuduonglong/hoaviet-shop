import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import { Plus, Edit, Trash2, Search, Package, AlertCircle } from 'lucide-react';

const AdminProductList = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bó hoa này không? Hành động này không thể hoàn tác!')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        alert('Đã xóa bó hoa thành công!');
        fetchProducts(); 
      } catch (error) {
        alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-pink-500" />
            Quản lý Sản Phẩm
          </h2>
          <p className="text-gray-500 text-sm mt-1">Xem, thêm, sửa, xóa các bó hoa trong hệ thống</p>
        </div>
        
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="w-full md:w-auto bg-pink-500 text-white px-6 py-3 md:py-2.5 rounded-xl font-bold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Thêm hoa mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Tìm kiếm tên bó hoa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
          <Search className="absolute left-3 top-3.5 md:top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {filteredProducts?.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-gray-100">
          <AlertCircle className="mx-auto mb-2 text-gray-400" size={40} />
          <p className="text-gray-500">Không tìm thấy sản phẩm nào!</p>
        </div>
      ) : (
        <>
          {/* GIAO DIỆN BẢNG DÀNH CHO MÁY TÍNH (ẨN TRÊN MOBILE) */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-semibold">Sản phẩm</th>
                  <th className="p-4 font-semibold">Danh mục</th>
                  <th className="p-4 font-semibold">Giá bán</th>
                  <th className="p-4 font-semibold text-center">Tồn kho</th>
                  <th className="p-4 font-semibold text-center">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                        <div>
                          <p className="font-bold text-gray-800 line-clamp-1">{product.name}</p>
                          {product.flashSale?.isFlashSale && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold mt-1 inline-block">Đang Flash Sale</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{product.category?.name || 'Chưa phân loại'}</td>
                    <td className="p-4 font-bold text-pink-600">{product.basePrice?.toLocaleString()}đ</td>
                    <td className="p-4 text-center font-medium text-gray-700">{product.stock}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {product.isAvailable ? 'Đang bán' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => navigate(`/admin/products/${product._id}/edit`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GIAO DIỆN THẺ (CARD) DÀNH CHO ĐIỆN THOẠI (ẨN TRÊN MÁY TÍNH) */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex gap-4">
                  <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                    <p className="text-pink-600 font-black mt-1">{product.basePrice?.toLocaleString()}đ</p>
                    <p className="text-xs text-gray-500 mt-1">Kho: {product.stock} | {product.category?.name}</p>
                    {product.flashSale?.isFlashSale && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold mt-1 inline-block">Flash Sale</span>}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-2 border-t border-gray-50 pt-3">
                  <button onClick={() => navigate(`/admin/products/${product._id}/edit`)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg flex justify-center items-center gap-1.5 text-sm font-bold">
                    <Edit size={16} /> Sửa
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg flex justify-center items-center gap-1.5 text-sm font-bold">
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductList;