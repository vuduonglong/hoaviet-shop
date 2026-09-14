const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Product = require('./models/Product');

const importData = async () => {
  try {
    // 1. Kết nối Database (Đã cập nhật chuẩn phiên bản mới)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Kết nối Database thành công! Đang tiến hành nạp dữ liệu...');

    // 2. Xóa sạch dữ liệu cũ
    await Category.deleteMany();
    await Product.deleteMany();

    // 3. Tạo các Danh mục hoa
    const cat1 = await Category.create({ name: 'Hoa Khai Trương', slug: 'hoa-khai-truong' });
    const cat2 = await Category.create({ name: 'Hoa Sinh Nhật', slug: 'hoa-sinh-nhat' });
    const cat3 = await Category.create({ name: 'Hoa Tình Yêu', slug: 'hoa-tinh-yeu' });

    // 4. Tạo các Sản phẩm hoa tươi
    const sampleProducts = [
      {
        name: 'Bó Hoa Hồng Đỏ Cổ Điển',
        slug: 'bo-hoa-hong-do-co-dien',
        description: '99 đóa hồng đỏ thắm tượng trưng cho tình yêu vĩnh cửu. Phù hợp tặng Valentine, kỷ niệm.',
        basePrice: 1200000,
        images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'],
        category: cat3._id,
        stock: 15,
        tags: ['Hoa Hồng', 'Đỏ thắm'],
        occasions: ['Valentine 14/2', 'Sinh nhật'],
        flashSale: { isFlashSale: true, salePrice: 990000, startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 3) }
      },
      {
        name: 'Lẵng Hoa Hướng Dương Rực Rỡ',
        slug: 'lang-hoa-huong-duong-ruc-ro',
        description: 'Mang lại năng lượng tích cực, sự thăng tiến và may mắn. Rất hợp tặng đối tác.',
        basePrice: 850000,
        images: ['https://images.unsplash.com/photo-1554522855-66774a3875be?q=80&w=800&auto=format&fit=crop'],
        category: cat1._id,
        stock: 5,
        tags: ['Hướng dương', 'Vàng rực'],
        occasions: ['Khai trương', 'Chúc mừng']
      },
      {
        name: 'Bó Hoa Cẩm Chướng Mùa Thu',
        slug: 'bo-hoa-cam-chuong-mua-thu',
        description: 'Sự kết hợp nhẹ nhàng, tinh tế và đầy nữ tính của hoa cẩm chướng pastel.',
        basePrice: 650000,
        images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop'],
        category: cat2._id,
        stock: 20,
        tags: ['Cẩm chướng', 'Pastel'],
        occasions: ['8/3', '20/10', 'Sinh nhật Mẹ']
      },
      {
        name: 'Chậu Lan Hồ Điệp Trắng Tinh Khôi',
        slug: 'chau-lan-ho-diep-trang-tinh-khoi',
        description: 'Tôn vinh sự thanh cao, sang trọng và thuần khiết. Món quà đẳng cấp dành cho VIP.',
        basePrice: 3500000,
        images: ['https://images.unsplash.com/photo-1528699636254-20a67e42d766?q=80&w=800&auto=format&fit=crop'],
        category: cat1._id,
        stock: 3,
        tags: ['Lan Hồ Điệp', 'Cao cấp'],
        occasions: ['Khai trương', 'Tân gia']
      }
    ];

    await Product.insertMany(sampleProducts);
    
    console.log('✅ Đã nạp thành công các bó hoa tuyệt đẹp vào Database!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
};

importData();