const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require('../models/productModel');

const router = express.Router();

// Set up Multer storage and destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads'); // directory to store uploaded images
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // create folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `product_${Date.now()}${ext}`;
    cb(null, filename); // set the file name
  }
});

// File filter function to allow only .png and .jpg
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only .png and .jpg files are allowed!'), false);
  }
};

// Apply storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Utility function to generate product IDs
function generateProductId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `P${randomNum}`;
}

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { product_id: id } });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
router.post('/', upload.single('productImage'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null; // save the image URL in the DB
    const product_id = generateProductId();

    const newProduct = await Product.create({
      product_id,
      name,
      price,
      image_path,
      category,
      description
    });

    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Products
router.put('/:id', upload.single('productImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body; // Destructuring the values from the form
    const image_path = req.file ? `/uploads/${req.file.filename}` : null; // Handle the image upload if available

    // Find the product by ID
    const product = await Product.findOne({ where: { product_id: id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product fields
    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;

    // If there's a new image, update the image_path; otherwise, retain the old one
    if (image_path) {
      product.image_path = image_path;
    }

    // Save the updated product to the database
    await product.save();

    // Send the updated product in the response
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { product_id: id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;