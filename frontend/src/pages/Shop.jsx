import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import { ShoppingCart, Search, FilterX, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

const Shop = () => {
  const { products, page, pages, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('Tất cả');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const [categories, setCategories] = useState([]);

  // Lấy danh mục 1 lần khi load trang
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('/api/products/categories/all');
        setCategories(data);
      } catch (error) {}
    };
    fetchCats();
  }, []);

  // Gọi API Backend mỗi khi các tham số lọc thay đổi (Backend sẽ tự lo việc Lọc và Sắp xếp)
  useEffect(() => {
    let minPrice = '';
    let maxPrice = '';
    if (selectedPrice === 'Dưới 500k') { maxPrice = '500000'; }
    if (selectedPrice === '500k - 1 Triệu') { minPrice = '500000'; maxPrice = '1000000'; }
    if (selectedPrice === 'Trên 1 Triệu') { minPrice = '1000000'; }

    fetchProducts({
      keyword: searchTerm,
      category: selectedCategory === 'Tất cả' ? '' : selectedCategory,
      minPrice,
      maxPrice,
      sort: sortOrder,
      page: 1 // Bất cứ khi nào đổi bộ lọc, luôn ép quay về trang 1
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedPrice, sortOrder]);

  // Xử lý khi người dùng bấm nút Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      let minPrice = '';
      let maxPrice = '';
      if (selectedPrice === 'Dưới 500k') { maxPrice = '500000'; }
      if (selectedPrice === '500k - 1 Triệu') { minPrice = '500000'; maxPrice = '1000000'; }
      if (selectedPrice === 'Trên 1 Triệu') { minPrice = '1000000'; }

      fetchProducts({
        keyword: searchTerm,
        category: selectedCategory === 'Tất cả' ? '' : selectedCategory,
        minPrice,
        maxPrice,
        sort: sortOrder,
        page: newPage 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Cửa Hàng Hoa</h1>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Tìm kiếm tên hoa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 shadow-sm"
          />
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* BỘ LỌC */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-pink-500"/> Bộ Lọc
              </h3>
              {(selectedCategory !== 'Tất cả' || selectedPrice !== 'Tất cả' || searchTerm !== '') && (
                <button 
                  onClick={() => { setSelectedCategory('Tất cả'); setSelectedPrice('Tất cả'); setSearchTerm(''); }}
                  className="text-xs text-red-500 flex items-center hover:underline bg-red-50 px-2 py-1 rounded"
                >
                  <FilterX size={14} className="mr-1" /> Xóa lọc
                </button>
              )}
            </div>
            
            <h4 className="font-bold text-gray-700 mb-3">Chủ đề hoa</h4>
            <ul className="space-y-3 text-gray-600 mb-8">
              <li 
                onClick={() => setSelectedCategory('Tất cả')}
                className={`cursor-pointer transition-colors font-medium ${selectedCategory === 'Tất cả' ? 'text-pink-600 font-bold' : 'hover:text-pink-500'}`}
              >
                Tất cả chủ đề
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat._id} 
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`cursor-pointer transition-colors font-medium ${selectedCategory === cat._id ? 'text-pink-600 font-bold' : 'hover:text-pink-500'}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-gray-700 mb-3 border-t border-gray-100 pt-4">Mức giá</h4>
            <ul className="space-y-3 text-gray-600">
              {['Tất cả', 'Dưới 500k', '500k - 1 Triệu', 'Trên 1 Triệu'].map((priceOption, index) => (
                <li 
                  key={index}
                  onClick={() => setSelectedPrice(priceOption)}
                  className={`cursor-pointer transition-colors font-medium ${selectedPrice === priceOption ? 'text-pink-600 font-bold' : 'hover:text-pink-500'}`}
                >
                  {priceOption}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM & PHÂN TRANG */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-end items-center mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-gray-500 text-sm font-medium mr-3">Sắp xếp theo:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-pink-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao xuống Thấp</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-medium text-lg flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              Đang tìm kiếm những bông hoa tươi nhất...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xl text-gray-500 mb-2">Không tìm thấy bó hoa nào phù hợp.</p>
              <button onClick={() => { setSelectedCategory('Tất cả'); setSelectedPrice('Tất cả'); setSearchTerm(''); }} className="text-pink-500 font-bold hover:underline">Thử xóa bộ lọc</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* HIỂN THỊ TRỰC TIẾP DỮ LIỆU TỪ BACKEND TRẢ VỀ */}
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                    <Link to={`/product/${product._id}`} className="relative h-64 overflow-hidden block bg-gray-100">
                      <img 
                        src={product.images[0] || 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet'} 
                        alt={product.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet'; }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.flashSale?.isFlashSale && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">SALE</span>
                      )}
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-pink-600 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-grow">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                        <div>
                          {product.flashSale?.isFlashSale ? (
                            <div className="flex flex-col">
                              <span className="text-red-600 font-extrabold text-lg">{product.flashSale.salePrice.toLocaleString()}đ</span>
                              <span className="text-gray-400 line-through text-xs">{product.basePrice.toLocaleString()}đ</span>
                            </div>
                          ) : (
                            <span className="text-pink-600 font-extrabold text-lg">{product.basePrice.toLocaleString()}đ</span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            addToCart(product, 1); 
                            alert(`Đã thêm ${product.name} vào giỏ!`); 
                          }}
                          className="bg-pink-50 p-2.5 rounded-full text-pink-600 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* THANH PHÂN TRANG */}
              {pages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => handlePageChange(x + 1)}
                      className={`w-10 h-10 rounded-full font-bold transition-colors shadow-sm ${
                        x + 1 === page ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="p-2 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;