// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'flower_shop', allowedFormats: ['jpeg', 'png', 'jpg'] },
});

const upload = multer({ storage });
module.exports = upload; 

// Khi dùng ở route: router.post('/', upload.array('images', 5), createProduct);