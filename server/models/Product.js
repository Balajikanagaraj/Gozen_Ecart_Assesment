import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters long'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currentPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  imageType: {
    type: String,
    enum: ['upload', 'url'],
    default: 'url'
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  visitCount: {
    type: Number,
    default: 0
  },
  priceHistory: [{
    price: Number,
    date: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ currentPrice: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Initialize currentPrice if not set
  if (!this.currentPrice) {
    this.currentPrice = this.basePrice;
  }
  
  next();
});

// Method to calculate dynamic price based on visits
productSchema.methods.calculateDynamicPrice = function(userVisits = 0) {
  let multiplier = 1;
  
  // Increase price by 10% for every 3 visits
  if (userVisits >= 3) {
    const priceIncreaseLevel = Math.floor(userVisits / 3);
    multiplier = 1 + (priceIncreaseLevel * 0.1); // 10% increase per level
  }
  
  // Cap the maximum price increase at 50%
  multiplier = Math.min(multiplier, 1.5);
  
  return Math.round(this.basePrice * multiplier * 100) / 100; // Round to 2 decimal places
};

export default mongoose.model('Product', productSchema);