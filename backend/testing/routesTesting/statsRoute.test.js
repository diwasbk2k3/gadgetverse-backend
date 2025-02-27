const request = require('supertest');
const express = require('express');
const statsRoute = require('../../routes/statsRoute');
const User = require('../../models/userModel');
const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const { fn, col, Op } = require('sequelize');

jest.mock('../../models/userModel');
jest.mock('../../models/orderModel');
jest.mock('../../models/productModel');

const app = express();
app.use(express.json());
app.use('/stats', statsRoute);

describe('Stats Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch dashboard statistics', async () => {
        User.count.mockResolvedValue(10);
        Order.sum.mockResolvedValue(1000);
        Order.count.mockResolvedValue(5);
        Product.count.mockResolvedValue(20);

        const response = await request(app).get('/stats');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            totalUsers: 10,
            totalRevenue: 1000,
            totalOrders: 5,
            totalProducts: 20,
        });
    });

    it('should handle errors when fetching dashboard statistics', async () => {
        User.count.mockRejectedValue(new Error('Failed to fetch users'));

        const response = await request(app).get('/stats');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch stats' });
    });

    it('should fetch total orders and total spent money for a specific customer', async () => {
        Order.count.mockResolvedValue(3);
        Order.sum.mockResolvedValue(300);

        const response = await request(app).get('/stats/user/C12345');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            totalOrders: 3,
            totalSpent: 300,
        });
    });

    it('should handle errors when fetching user statistics', async () => {
        Order.count.mockRejectedValue(new Error('Failed to fetch orders'));

        const response = await request(app).get('/stats/user/C12345');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch user stats' });
    });

    it('should fetch top 5 selling products', async () => {
        const mockTopProducts = [
            { product_id: 'P123', total_sold: '5' },
            { product_id: 'P456', total_sold: '3' },
        ];

        const mockProducts = [
            { product_id: 'P123', name: 'Product 1', image_path: '/path/to/image1.jpg' },
            { product_id: 'P456', name: 'Product 2', image_path: '/path/to/image2.jpg' },
        ];

        Order.findAll.mockResolvedValue(mockTopProducts);
        Product.findAll.mockResolvedValue(mockProducts);

        const response = await request(app).get('/stats/top-selling');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { product_id: 'P123', total_sold: '5', name: 'Product 1', image_path: '/path/to/image1.jpg' },
            { product_id: 'P456', total_sold: '3', name: 'Product 2', image_path: '/path/to/image2.jpg' },
        ]);
    });

    it('should handle errors when fetching top-selling products', async () => {
        Order.findAll.mockRejectedValue(new Error('Failed to fetch top products'));

        const response = await request(app).get('/stats/top-selling');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch top-selling products' });
    });
});
