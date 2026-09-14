import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      carts: { guest: [] }, // Kho lưu trữ nhiều giỏ hàng khác nhau
      activeCartId: 'guest', // ID người đang thao tác hiện tại
      cartItems: [], // Mảng sản phẩm trực tiếp để giao diện tự động render

      // Chuyển đổi giỏ hàng khi người dùng đăng nhập/đăng xuất
      setActiveCart: (userId) => set((state) => {
        const id = userId || 'guest';
        const userCart = state.carts[id] || [];
        return {
          activeCartId: id,
          cartItems: userCart,
          carts: { ...state.carts, [id]: userCart }
        };
      }),

      // Thêm sản phẩm vào giỏ
      addToCart: (product, quantity = 1) => set((state) => {
        const id = state.activeCartId;
        const currentItems = state.cartItems;
        // Kiểm tra xem sản phẩm đã có trong giỏ chưa (hỗ trợ cả 2 chuẩn dữ liệu _id và product)
        const productId = product._id || product.product;
        const existingItem = currentItems.find((item) => item.product === productId);

        let newItems;
        if (existingItem) {
          // Nếu đã có, chỉ cộng dồn số lượng
          newItems = currentItems.map((item) =>
            item.product === productId
              ? { ...item, quantity: Math.max(1, item.quantity + quantity) } // Đảm bảo số lượng luôn >= 1
              : item
          );
        } else {
          // Nếu chưa có, thêm sản phẩm mới hoàn toàn
          newItems = [
            ...currentItems,
            {
              product: productId,
              name: product.name,
              price: product.flashSale?.isFlashSale ? product.flashSale.salePrice : (product.basePrice || product.price),
              image: product.images ? product.images[0] : product.image,
              quantity: quantity > 0 ? quantity : 1,
            },
          ];
        }
        
        // Lưu lại vào cả mảng hiển thị và kho lưu trữ chung
        return { 
            cartItems: newItems,
            carts: { ...state.carts, [id]: newItems } 
        };
      }),

      // Xóa 1 sản phẩm khỏi giỏ
      removeFromCart: (productId) => set((state) => {
        const id = state.activeCartId;
        const newItems = state.cartItems.filter((item) => item.product !== productId);
        return {
            cartItems: newItems,
            carts: { ...state.carts, [id]: newItems }
        };
      }),

      // Xóa toàn bộ giỏ hàng (Dùng sau khi thanh toán thành công)
      clearCart: () => set((state) => {
         const id = state.activeCartId;
         return {
             cartItems: [],
             carts: { ...state.carts, [id]: [] }
         }
      }),

      // Tính tổng tiền thanh toán
      getCartTotal: () => {
        const items = get().cartItems;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'flower-shop-smart-cart', // Tên bộ nhớ cục bộ (LocalStorage)
    }
  )
);

export default useCartStore;