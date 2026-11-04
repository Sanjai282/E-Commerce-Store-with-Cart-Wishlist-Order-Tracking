const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const sampleProducts = require('./data/productsData');

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(' Connected to MongoDB successfully!');

    // Clear existing products
    await Product.deleteMany({});
    console.log(' Cleared existing products collection');

    // Insert rich Indian products
    const formatted = sampleProducts.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      stock: p.stock,
      rating: p.rating,
      mrp: p.mrp,
      discount: p.discount,
      badge: p.badge,
      hsnCode: p.hsnCode,
      gstRate: p.gstRate,
      brand: p.brand,
      origin: p.origin,
      warranty: p.warranty,
      specifications: p.specifications
    }));

    const result = await Product.insertMany(formatted);
    console.log(` Successfully seeded ${result.length} authentic Indian products!`);

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding MongoDB:', error.message);
    console.log('ℹ Note: The app also contains a built-in persistent storage layer in data/store.json, so it functions even without MongoDB.');
    process.exit(1);
  }
}

seedDatabase();
