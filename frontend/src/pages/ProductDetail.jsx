import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Minus, Plus, Truck, Heart, Star, UserCircle2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // State cho Form đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hoa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setReviewSuccess(true);
      setComment('');
      setRating(5);
      fetchProduct(); // Tải lại thông tin sản phẩm để cập nhật sao và bình luận mới
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setReviewLoading(false);
    }
  };

  // Hàm vẽ sao dựa trên điểm số
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={18} 
          className={i <= ratingValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  if (loading) return <div className="text-center py-32 text-xl font-medium text-gray-500 flex justify-center items-center gap-3"><div className="w-5 h-5 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div> Đang gói thông tin bó hoa...</div>;
  if (!product) return <div className="text-center py-32 text-xl font-bold text-red-500">Rất tiếc, không tìm thấy bó hoa này!</div>;

  const price = product.flashSale?.isFlashSale ? product.flashSale.salePrice : product.basePrice;

  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-pink-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Trở lại
        </button>

        {/* THÔNG TIN CHÍNH CỦA SẢN PHẨM */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 bg-gray-50/50 flex items-center justify-center">
              <img 
                src={product.images[0] || 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet'} 
                alt={product.name} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/fdf2f8/ec4899?text=HoaViet'; }}
                className="w-full max-w-md h-auto rounded-2xl object-cover shadow-xl transform hover:scale-105 transition-transform duration-500 border border-gray-200" 
              />
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              {product.category && (
                <span className="text-pink-500 font-bold text-sm uppercase tracking-wider mb-2">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h1>
              
              {/* Điểm Đánh giá tổng quan */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm font-bold text-gray-500">({product.numReviews} đánh giá)</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6 bg-pink-50 inline-block w-fit px-6 py-3 rounded-2xl border border-pink-100">
                <span className="text-3xl font-black text-pink-600">{price.toLocaleString()}đ</span>
                {product.flashSale?.isFlashSale && (
                  <span className="text-lg text-gray-400 line-through font-medium">{product.basePrice.toLocaleString()}đ</span>
                )}
              </div>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-6 mb-8 border-t border-b border-gray-100 py-6">
                <div className="flex items-center border-2 border-gray-200 rounded-full bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-500 hover:text-pink-600 transition-colors">
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-gray-800">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-500 hover:text-pink-600 transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-sm text-gray-500 flex flex-col font-medium">
                  <span className="flex items-center gap-2"><Truck size={18} className="text-green-500" /> Giao hỏa tốc 2H nội thành</span>
                  <span className="flex items-center gap-2 mt-1.5"><Heart size={18} className="text-red-400" /> Tươi mới 100% khi nhận</span>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || product.stock === 0}
                className="bg-pink-500 text-white px-8 py-5 rounded-full font-bold text-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-pink-300/50 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:transform-none disabled:shadow-none"
              >
                <ShoppingCart size={26} /> {(!product.isAvailable || product.stock === 0) ? 'Tạm Hết Hàng' : 'Đặt Mua Ngay'}
              </button>
            </div>
          </div>
        </div>

        {/* KHU VỰC ĐÁNH GIÁ & BÌNH LUẬN */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Đánh giá từ Khách hàng ({product.numReviews})</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* CỘT TRÁI: DANH SÁCH BÌNH LUẬN */}
            <div className="lg:w-1/2 space-y-6">
              {product.reviews.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                  <p className="text-gray-500 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá bó hoa này nhé!</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <UserCircle2 size={40} className="text-pink-300" />
                        <div>
                          <p className="font-bold text-gray-800">{review.name}</p>
                          <div className="flex items-center mt-0.5">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-12">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* CỘT PHẢI: FORM VIẾT ĐÁNH GIÁ */}
            <div className="lg:w-1/2">
              <div className="bg-pink-50/50 p-6 md:p-8 rounded-2xl border border-pink-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Gửi đánh giá của bạn</h3>
                
                {userInfo ? (
                  <form onSubmit={submitReviewHandler} className="space-y-4">
                    {reviewError && <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm font-medium">{reviewError}</div>}
                    {reviewSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm font-medium">Cảm ơn bạn đã gửi đánh giá!</div>}

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Bạn chấm bó hoa này mấy sao?</label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:border-pink-500 bg-white font-medium text-gray-700 shadow-sm"
                      >
                        <option value="5">5 - Tuyệt vời quá!</option>
                        <option value="4">4 - Rất tốt</option>
                        <option value="3">3 - Bình thường</option>
                        <option value="2">2 - Hơi thất vọng</option>
                        <option value="1">1 - Không hài lòng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Chia sẻ cảm nhận của bạn</label>
                      <textarea 
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Bó hoa có tươi không? Bạn có ưng ý với cách gói không..."
                        rows="4"
                        className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:border-pink-500 bg-white shadow-sm resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={reviewLoading}
                      className="w-full bg-gray-800 text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition-colors shadow-md disabled:bg-gray-400 flex justify-center items-center"
                    >
                      {reviewLoading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                    <p className="text-gray-600 font-medium mb-4">Vui lòng đăng nhập để viết đánh giá và chia sẻ cảm nhận của bạn.</p>
                    <Link to="/login" className="inline-block bg-pink-500 text-white font-bold px-6 py-2.5 rounded-full hover:bg-pink-600 transition-colors shadow-sm">
                      Đăng Nhập Ngay
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;