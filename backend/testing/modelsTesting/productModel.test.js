const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Product model
jest.mock('../../models/productModel', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const ProductMock = dbMock.define('Product', {
    product_id: 'P123',
    name: 'Product A',
    price: 19.99,
    image_path: '/images/productA.jpg',
    category: 'Category A',
    description: 'A great product.',
  });

  return { Product: ProductMock };
});

describe('Product Model', () => {
  it('should create a product successfully', async () => {
    const { Product } = require('../../models/productModel');
    const product = await Product.create({
      product_id: 'P123',
      name: 'Product A',
      price: 19.99,
      image_path: '/images/productA.jpg',
      category: 'Category A',
      description: 'A great product.',
    });
    expect(product.name).toBe('Product A');
    expect(product.price).toBe(19.99);
    expect(product.category).toBe('Category A');
  });

  it('should find a product by product_id', async () => {
    const { Product } = require('../../models/productModel');
    const product = await Product.findOne({ where: { product_id: 'P123' } });
    expect(product).toHaveProperty('product_id', 'P123');
    expect(product).toHaveProperty('name', 'Product A');
  });
});