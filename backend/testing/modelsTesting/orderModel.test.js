const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Order model
jest.mock('../../models/orderModel', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const OrderMock = dbMock.define('Order', {
    order_id: 'O123',
    customer_id: 'C456',
    product_id: 'P789',
    product_name: 'Product A',
    quantity: 2,
    price: 19.99,
    total_price: 39.98,
    phone: '123-456-7890',
    email: 'customer@example.com',
    location: 'Location A',
  });

  return { Order: OrderMock };
});

describe('Order Model', () => {
  it('should create an order successfully', async () => {
    const { Order } = require('../../models/orderModel');
    const order = await Order.create({
      order_id: 'O123',
      customer_id: 'C456',
      product_id: 'P789',
      product_name: 'Product A',
      quantity: 2,
      price: 19.99,
      total_price: 39.98,
      phone: '123-456-7890',
      email: 'customer@example.com',
      location: 'Location A',
    });
    expect(order.order_id).toBe('O123');
    expect(order.customer_id).toBe('C456');
    expect(order.total_price).toBe(39.98);
  });

  it('should find an order by order_id', async () => {
    const { Order } = require('../../models/orderModel');
    const order = await Order.findOne({ where: { order_id: 'O123' } });
    expect(order).toHaveProperty('order_id', 'O123');
    expect(order).toHaveProperty('product_name', 'Product A');
    expect(order).toHaveProperty('total_price', 39.98);
  });
});