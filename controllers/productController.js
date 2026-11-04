const mongoose = require('mongoose');
const Product = require('../models/Product');
const dbStore = require('../data/dbStore');

// Get all products with filters & pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const subcategory = req.query.subcategory || req.query.subCategory;
    const search = req.query.search || req.query.q;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minRating = req.query.minRating || req.query.rating;
    const fastDelivery = req.query.fastDelivery;
    const sort = req.query.sort;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (subcategory && subcategory !== 'All') {
        query.subcategory = subcategory;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      else if (sort === 'price_desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'discount') sortOption = { discount: -1 };

      const totalProducts = await Product.countDocuments(query);
      const skip = (page - 1) * limit;
      const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit);

      return res.status(200).json({
        products,
        totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
        currentPage: page,
        totalProducts
      });
    } else {
      // Use resilient store
      const result = dbStore.getProducts({ page, limit, category, subcategory, search, minPrice, maxPrice, minRating, fastDelivery, sort });
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ product });
    } else {
      const product = dbStore.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ product });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q || req.query.query || '';
    if (mongoose.connection.readyState === 1) {
      const searchPattern = new RegExp(q, 'i');
      const products = await Product.find({
        $or: [{ name: { $regex: searchPattern } }, { description: { $regex: searchPattern } }, { category: { $regex: searchPattern } }]
      });
      return res.status(200).json({ products });
    } else {
      const result = dbStore.getProducts({ search: q, limit: 50 });
      return res.status(200).json({ products: result.products });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find({ category });
      return res.status(200).json({ products });
    } else {
      const result = dbStore.getProducts({ category, limit: 50 });
      return res.status(200).json({ products: result.products });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer Reviews Endpoints
exports.getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = dbStore.getReviews(id);
    return res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, reviewerName, city } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and review comment are required' });
    }

    const result = dbStore.addReview(id, { rating, title, comment, reviewerName, city });
    return res.status(201).json({
      message: 'Review submitted successfully',
      product: result.product,
      reviews: result.reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(req.body);
      return res.status(201).json({ message: 'Product created', product });
    } else {
      const newProd = {
        _id: `prod-${Date.now()}`,
        id: `prod-${Date.now()}`,
        ...req.body
      };
      dbStore.data.products.push(newProd);
      dbStore.save();
      return res.status(201).json({ message: 'Product created', product: newProd });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
