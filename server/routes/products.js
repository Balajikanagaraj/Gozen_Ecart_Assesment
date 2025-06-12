import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all products with pagination, filtering, and search
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('inStock').optional().isBoolean().withMessage('InStock must be boolean'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean')
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
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.currentPrice = {};
      if (req.query.minPrice) filter.currentPrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.currentPrice.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { currentPrice: 1 };
          break;
        case 'price-high':
          sort = { currentPrice: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description');

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Track product visits for dynamic pricing
    if (!req.session.productVisits) {
      req.session.productVisits = {};
    }

    const productId = req.params.id;
    req.session.productVisits[productId] = (req.session.productVisits[productId] || 0) + 1;

    // Calculate dynamic price based on user visits
    const userVisits = req.session.productVisits[productId];
    const dynamicPrice = product.calculateDynamicPrice(userVisits);

    // Update product visit count
    await Product.findByIdAndUpdate(productId, { $inc: { visitCount: 1 } });

    res.json({
      ...product.toObject(),
      dynamicPrice,
      userVisits,
      priceAdjustment: dynamicPrice !== product.basePrice
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Create new product (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10-1000 characters'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative integer'),
  body('category').isMongoId().withMessage('Invalid category ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, basePrice, stock, category, brand, tags, imageUrl } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Handle image (either uploaded file or URL)
    let image = imageUrl;
    let imageType = 'url';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      imageType = 'upload';
    }

    if (!image) {
      return res.status(400).json({ message: 'Product image is required (either upload or URL)' });
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    const product = new Product({
      name,
      description,
      basePrice: parseFloat(basePrice),
      currentPrice: parseFloat(basePrice),
      stock: parseInt(stock),
      category,
      image,
      imageType,
      brand,
      tags: parsedTags,
      createdBy: req.user.userId
    });

    await product.save();
    await product.populate('category', 'name slug');

    // Update category product count
    await Category.findByIdAndUpdate(category, { $inc: { productCount: 1 } });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      updateData.imageType = 'upload';
    } else if (req.body.imageUrl && req.body.imageUrl !== product.image) {
      updateData.image = req.body.imageUrl;
      updateData.imageType = 'url';
    }

    // Handle price update
    if (updateData.basePrice) {
      updateData.basePrice = parseFloat(updateData.basePrice);
      updateData.currentPrice = updateData.basePrice;
    }

    // Handle stock update
    if (updateData.stock !== undefined) {
      updateData.stock = parseInt(updateData.stock);
    }

    // Parse tags
    if (updateData.tags) {
      try {
        updateData.tags = typeof updateData.tags === 'string' ? JSON.parse(updateData.tags) : updateData.tags;
      } catch (e) {
        delete updateData.tags;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('category', 'name slug')
    .limit(8)
    .sort({ createdAt: -1 });

    res.json(featuredProducts);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error fetching featured products' });
  }
});

export default router;