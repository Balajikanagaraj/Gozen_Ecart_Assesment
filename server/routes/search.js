import express from 'express';
import { query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Search products with auto-suggestions
router.get('/products', [
  query('q').trim().isLength({ min: 1 }).withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit) || 10;

    // Text search on indexed fields
    const products = await Product.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { brand: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        }
      ]
    })
    .populate('category', 'name slug')
    .limit(limit)
    .sort({ name: 1 });

    res.json(products);
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// Auto-complete suggestions
router.get('/suggestions', [
  query('q').trim().isLength({ min: 1 }).withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit) || 8;

    // Get product name suggestions
    const productSuggestions = await Product.find({
      $and: [
        { isActive: true },
        { name: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('name')
    .limit(limit)
    .sort({ name: 1 });

    // Get category suggestions
    const categorySuggestions = await Category.find({
      $and: [
        { isActive: true },
        { name: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('name')
    .limit(Math.floor(limit / 2));

    // Get brand suggestions
    const brandSuggestions = await Product.distinct('brand', {
      $and: [
        { isActive: true },
        { brand: { $regex: searchQuery, $options: 'i' } },
        { brand: { $ne: null, $ne: '' } }
      ]
    }).limit(Math.floor(limit / 2));

    const suggestions = {
      products: productSuggestions.map(p => ({
        type: 'product',
        value: p.name,
        id: p._id
      })),
      categories: categorySuggestions.map(c => ({
        type: 'category',
        value: c.name,
        id: c._id
      })),
      brands: brandSuggestions.map(brand => ({
        type: 'brand',
        value: brand
      }))
    };

    res.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error getting suggestions' });
  }
});

// Advanced search with filters
router.get('/advanced', [
  query('q').optional().trim(),
  query('category').optional().isMongoId(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('brand').optional().trim(),
  query('inStock').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort').optional().isIn(['name', 'price-low', 'price-high', 'newest', 'rating'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    // Text search
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } },
        { brand: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.currentPrice = {};
      if (req.query.minPrice) filter.currentPrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.currentPrice.$lte = parseFloat(req.query.maxPrice);
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first
    switch (req.query.sort) {
      case 'name':
        sort = { name: 1 };
        break;
      case 'price-low':
        sort = { currentPrice: 1 };
        break;
      case 'price-high':
        sort = { currentPrice: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get filter aggregations for faceted search
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$currentPrice' },
          maxPrice: { $max: '$currentPrice' }
        }
      }
    ]);

    const availableBrands = await Product.distinct('brand', { 
      isActive: true, 
      brand: { $ne: null, $ne: '' } 
    });

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        brands: availableBrands.sort()
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ message: 'Server error during advanced search' });
  }
});

export default router;