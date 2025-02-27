const express = require('express');
const Order = require('../models/orderModel');

const router = express.Router();

// Function to generate unique order ID
function generateOrderId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `O${randomNum}`;
}

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);
    const { product_id, product_name, quantity, price, phone, location, customer_id, email } = req.body;
    // Validate data
    if (!customer_id || !email || !product_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const order_id = generateOrderId();
    const total_price = quantity * price;
    const newOrder = await Order.create({
      order_id,
      customer_id,
      product_id,
      product_name,
      quantity,
      price,
      total_price,
      phone,
      email,
      location,
    });
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});


// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get orders for a specific customer
router.get('/customer-orders', async (req, res) => {
  try {
    // Get customer_id from query parameter
    const customer_id = req.query.customer_id;
    if (!customer_id) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    // Find orders by customer_id
    const orders = await Order.findAll({
      where: { customer_id: customer_id }
    });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }
    res.json(orders);
  } catch (err) {
    console.error('Error fetching customer orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

module.exports = router;