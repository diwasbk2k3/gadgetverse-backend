const express = require('express');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { fn, col, Op } = require('sequelize');

const router = express.Router();

// Fetch statistics for the dashboard
router.get('/', async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.count();

    // Get total revenue (sum of all orders total_price)
    const totalRevenue = await Order.sum('total_price');

    // Get total number of orders
    const totalOrders = await Order.count();

    // Get total number of products
    const totalProducts = await Product.count();

    // Send the data to the client
    res.json({
      totalUsers,
      totalRevenue,
      totalOrders,
      totalProducts,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Fetch total orders and total spent money for a specific customer
router.get('/user/:customer_id', async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Get total orders for the customer
    const userTotalOrders = await Order.count({
      where: { customer_id },
    });

    // Get total spent money for the customer
    const userTotalSpent = await Order.sum('total_price', {
      where: { customer_id },
    });

    res.json({
      totalOrders: userTotalOrders || 0, // Default to 0 if no orders
      totalSpent: userTotalSpent || 0, // Default to 0 if no spending
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get top 5 selling products
router.get('/top-selling', async (req, res) => {
  try {
    // Get top 5 selling product IDs
    const topProducts = await Order.findAll({
      attributes: ['product_id', [fn('SUM', col('quantity')), 'total_sold']],
      group: ['product_id'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5,
      raw: true,
    });

    const productIds = topProducts.map(item => item.product_id);

    // Get product details
    const products = await Product.findAll({
      attributes: ['product_id', 'name', 'image_path'],
      where: { product_id: { [Op.in]: productIds } },
      raw: true,
    });

    // Merge data
    const result = topProducts.map(order => ({
      ...order,
      ...products.find(p => p.product_id === order.product_id),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top-selling products' });
  }
});

module.exports = router;