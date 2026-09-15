import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';

const Home = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="text-center py-20 text-xl font-medium text-gray-500">Đang chuẩn bị những bó hoa đẹp nhất...</div>;

  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Banner Lộng Lẫy */}
      <div className="relative bg-pink-100 py-20 px-4 sm:px-6 lg:px-8 mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Gửi Trao Yêu Thương <br/><span className="text-pink-600">Qua Từng Đóa Hoa</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              HoaViet mang đến những thiết kế hoa tươi tinh tế nhất, giúp bạn truyền tải trọn vẹn cảm xúc trong những dịp đặc biệt.
            </p>
            <Link to="/shop" className="bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200">
              Khám Phá Ngay
            </Link>
          </div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop" alt="Banner Hoa" className="rounded-[40px] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white" />
          </div>
        </div>
      </div>

      {/* Danh sách Sản phẩm Mới Nhất */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoa Đẹp Mỗi Ngày</h2>
            <p className="text-gray-500">Tuyển tập những mẫu hoa được yêu thích nhất</p>
          </div>
          <Link to="/shop" className="text-pink-600 font-bold hover:underline hidden sm:block">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.slice(0, 8).map((product) => {
            const outOfStock = !product.isAvailable || product.stock === 0;

            return (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                <Link to={`/product/${product._id}`} className="relative h-64 block overflow-hidden bg-gray-100">

                  <img
                    src={product.images[0] || 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet';
                    }}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${outOfStock ? 'grayscale opacity-70' : ''}`}
                  />

                  {/* Nhãn Hết hàng ưu tiên hiển thị trước nhãn SALE */}
                  {outOfStock ? (
                    <span className="absolute top-3 right-3 bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      Hết hàng
                    </span>
                  ) : product.flashSale?.isFlashSale && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      SALE
                    </span>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      {product.flashSale?.isFlashSale ? (
                        <div className="flex flex-col">
                          <span className="text-red-600 font-extrabold text-lg">
                            {product.flashSale.salePrice.toLocaleString()}đ
                          </span>
                          <span className="text-gray-400 line-through text-xs">
                            {product.basePrice.toLocaleString()}đ
                          </span>
                        </div>
                      ) : (
                        <span className="text-pink-600 font-extrabold text-lg">
                          {product.basePrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (outOfStock) return;
                        addToCart(product, 1);
                        alert('Đã thêm thành công!');
                      }}
                      disabled={outOfStock}
                      title={outOfStock ? 'Sản phẩm tạm hết hàng' : 'Thêm vào giỏ hàng'}
                      className={`p-2.5 rounded-full transition-all transform ${
                        outOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white hover:scale-110'
                      }`}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;