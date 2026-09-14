const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, occasion, sort } = req.query;
    let query = {}; 

    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    
    if (occasion) query.occasions = { $in: [occasion] };

    let sortOption = { createdAt: -1 }; 
    if (sort === 'price_asc') sortOption = { basePrice: 1 }; 
    if (sort === 'price_desc') sortOption = { basePrice: -1 }; 

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9; 
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort(sortOption); 
      
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.body['flashSale[isFlashSale]'] !== undefined) {
      productData.flashSale = {
        isFlashSale: req.body['flashSale[isFlashSale]'] === 'true',
        salePrice: Number(req.body['flashSale[salePrice]']) || 0
      };
    }
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path); 
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy bó hoa này' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    
    Object.assign(product, req.body);

    if (req.body['flashSale[isFlashSale]'] !== undefined) {
      product.flashSale = {
        isFlashSale: req.body['flashSale[isFlashSale]'] === 'true',
        salePrice: Number(req.body['flashSale[salePrice]']) || 0
      };
    }
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(200).json({ message: 'Đã xóa bó hoa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ĐÃ BỔ SUNG: Hàm Xử lý Đánh giá & Chấm sao
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // 1. Kiểm tra xem người này đã đánh giá chưa
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bạn đã đánh giá bó hoa này rồi!' });
      }

      // 2. Tạo đối tượng đánh giá mới
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // 3. Đẩy vào mảng reviews và tính toán lại điểm trung bình
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Cảm ơn bạn đã đánh giá!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct, getCategories, createProductReview };