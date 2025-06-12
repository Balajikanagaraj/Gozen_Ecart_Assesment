import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    slug: 'electronics'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    slug: 'clothing'
  },
  {
    name: 'Home & Kitchen',
    description: 'Everything for your home and kitchen needs',
    slug: 'home-kitchen'
  },
  {
    name: 'Books',
    description: 'Wide collection of books and literature',
    slug: 'books'
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    slug: 'sports-outdoors'
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Beauty products and personal care items',
    slug: 'beauty-personal-care'
  },
  {
    name: 'Automotive',
    description: 'Car accessories and automotive parts',
    slug: 'automotive'
  },
  {
    name: 'Toys & Games',
    description: 'Fun toys and games for all ages',
    slug: 'toys-games'
  },
  {
    name: 'Health & Wellness',
    description: 'Health supplements and wellness products',
    slug: 'health-wellness'
  },
  {
    name: 'Office Supplies',
    description: 'Office equipment and stationery',
    slug: 'office-supplies'
  }
];

const products = [
  // Electronics (15 products)
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals who need crystal clear audio quality.',
    basePrice: 89.99,
    stock: 45,
    brand: 'AudioTech',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    tags: ['wireless', 'bluetooth', 'noise-canceling'],
    rating: 4.5,
    reviewCount: 234,
    isFeatured: true
  },
  {
    name: 'Smartphone 128GB',
    description: 'Latest generation smartphone with advanced camera system, fast processor, and long-lasting battery life.',
    basePrice: 699.99,
    stock: 28,
    brand: 'TechMobile',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    tags: ['smartphone', 'camera', 'android'],
    rating: 4.7,
    reviewCount: 456,
    isFeatured: true
  },
  {
    name: 'Gaming Laptop 16GB RAM',
    description: 'High-performance gaming laptop with dedicated graphics card, fast SSD storage, and RGB keyboard lighting.',
    basePrice: 1299.99,
    stock: 12,
    brand: 'GameForce',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    tags: ['gaming', 'laptop', 'rgb'],
    rating: 4.8,
    reviewCount: 189,
    isFeatured: true
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life. Perfect for office work and gaming.',
    basePrice: 29.99,
    stock: 67,
    brand: 'ClickMaster',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg',
    tags: ['wireless', 'ergonomic', 'precision'],
    rating: 4.3,
    reviewCount: 123
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Fast charging USB-C cable with durable braided design. Compatible with most modern devices.',
    basePrice: 19.99,
    stock: 89,
    brand: 'ChargeFast',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    tags: ['usb-c', 'fast-charging', 'durable'],
    rating: 4.2,
    reviewCount: 78
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with powerful bass and waterproof design. Great for outdoor activities.',
    basePrice: 59.99,
    stock: 34,
    brand: 'SoundWave',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    tags: ['bluetooth', 'portable', 'waterproof'],
    rating: 4.4,
    reviewCount: 167
  },
  {
    name: 'Webcam HD 1080p',
    description: 'High-definition webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.',
    basePrice: 79.99,
    stock: 23,
    brand: 'StreamCam',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    tags: ['webcam', 'hd', 'streaming'],
    rating: 4.1,
    reviewCount: 92
  },
  {
    name: 'Tablet 10 inch',
    description: 'Lightweight tablet with high-resolution display and long battery life. Great for reading and entertainment.',
    basePrice: 299.99,
    stock: 19,
    brand: 'TabletPro',
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    tags: ['tablet', 'portable', 'entertainment'],
    rating: 4.6,
    reviewCount: 145
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone connectivity.',
    basePrice: 199.99,
    stock: 41,
    brand: 'WristTech',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    tags: ['smartwatch', 'fitness', 'health'],
    rating: 4.5,
    reviewCount: 203
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and premium sound quality.',
    basePrice: 149.99,
    stock: 56,
    brand: 'AudioTech',
    image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg',
    tags: ['wireless', 'earbuds', 'noise-canceling'],
    rating: 4.7,
    reviewCount: 312
  },
  {
    name: 'External Hard Drive 1TB',
    description: 'Portable external hard drive with fast data transfer speeds and compact design.',
    basePrice: 89.99,
    stock: 33,
    brand: 'DataStore',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    tags: ['storage', 'portable', 'backup'],
    rating: 4.3,
    reviewCount: 87
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with customizable keys and tactile switches.',
    basePrice: 129.99,
    stock: 27,
    brand: 'KeyMaster',
    image: 'https://images.pexels.com/photos/1181216/pexels-photo-1181216.jpeg',
    tags: ['mechanical', 'gaming', 'rgb'],
    rating: 4.6,
    reviewCount: 156
  },
  {
    name: 'Monitor 24 inch',
    description: 'Full HD monitor with IPS panel and ultra-thin bezels. Perfect for work and entertainment.',
    basePrice: 179.99,
    stock: 15,
    brand: 'ViewPro',
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
    tags: ['monitor', 'full-hd', 'ips'],
    rating: 4.4,
    reviewCount: 98
  },
  {
    name: 'Power Bank 20000mAh',
    description: 'High-capacity power bank with fast charging and multiple USB ports.',
    basePrice: 39.99,
    stock: 72,
    brand: 'PowerMax',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    tags: ['power-bank', 'portable', 'fast-charging'],
    rating: 4.2,
    reviewCount: 134
  },
  {
    name: 'VR Headset',
    description: 'Immersive virtual reality headset with high-resolution display and comfortable design.',
    basePrice: 399.99,
    stock: 8,
    brand: 'VirtualVision',
    image: 'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg',
    tags: ['vr', 'gaming', 'immersive'],
    rating: 4.8,
    reviewCount: 67
  },

  // Clothing (15 products)
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors. Perfect for casual wear.',
    basePrice: 24.99,
    stock: 95,
    brand: 'ComfortWear',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    tags: ['cotton', 'casual', 'comfortable'],
    rating: 4.3,
    reviewCount: 245
  },
  {
    name: 'Denim Jeans',
    description: 'Classic blue denim jeans with perfect fit and durable construction.',
    basePrice: 79.99,
    stock: 48,
    brand: 'DenimCraft',
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
    tags: ['denim', 'classic', 'durable'],
    rating: 4.5,
    reviewCount: 189
  },
  {
    name: 'Winter Jacket',
    description: 'Warm winter jacket with water-resistant material and insulated lining.',
    basePrice: 149.99,
    stock: 22,
    brand: 'WarmGuard',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    tags: ['winter', 'warm', 'water-resistant'],
    rating: 4.7,
    reviewCount: 123,
    isFeatured: true
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and breathable material.',
    basePrice: 119.99,
    stock: 36,
    brand: 'RunFast',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    tags: ['running', 'lightweight', 'breathable'],
    rating: 4.6,
    reviewCount: 267
  },
  {
    name: 'Formal Shirt',
    description: 'Professional formal shirt made from premium cotton blend. Perfect for office wear.',
    basePrice: 59.99,
    stock: 41,
    brand: 'OfficePro',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    tags: ['formal', 'professional', 'cotton'],
    rating: 4.4,
    reviewCount: 156
  },
  {
    name: 'Summer Dress',
    description: 'Elegant summer dress with floral pattern and comfortable fit.',
    basePrice: 89.99,
    stock: 29,
    brand: 'SummerStyle',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    tags: ['summer', 'elegant', 'floral'],
    rating: 4.5,
    reviewCount: 198
  },
  {
    name: 'Wool Sweater',
    description: 'Cozy wool sweater perfect for cold weather. Available in various colors.',
    basePrice: 99.99,
    stock: 33,
    brand: 'CozyKnit',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    tags: ['wool', 'cozy', 'winter'],
    rating: 4.6,
    reviewCount: 134
  },
  {
    name: 'Sports Shorts',
    description: 'Comfortable sports shorts with moisture-wicking fabric and elastic waistband.',
    basePrice: 34.99,
    stock: 67,
    brand: 'ActiveWear',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    tags: ['sports', 'moisture-wicking', 'comfortable'],
    rating: 4.2,
    reviewCount: 89
  },
  {
    name: 'Leather Belt',
    description: 'Genuine leather belt with classic buckle design. Perfect accessory for any outfit.',
    basePrice: 49.99,
    stock: 54,
    brand: 'LeatherCraft',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    tags: ['leather', 'accessory', 'classic'],
    rating: 4.4,
    reviewCount: 112
  },
  {
    name: 'Baseball Cap',
    description: 'Adjustable baseball cap with embroidered logo and comfortable fit.',
    basePrice: 29.99,
    stock: 78,
    brand: 'CapStyle',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    tags: ['cap', 'adjustable', 'casual'],
    rating: 4.1,
    reviewCount: 76
  },
  {
    name: 'Yoga Pants',
    description: 'Stretchy yoga pants with high waistband and moisture-wicking fabric.',
    basePrice: 69.99,
    stock: 45,
    brand: 'FlexFit',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    tags: ['yoga', 'stretchy', 'high-waist'],
    rating: 4.5,
    reviewCount: 203
  },
  {
    name: 'Polo Shirt',
    description: 'Classic polo shirt with collar and button placket. Great for casual and semi-formal occasions.',
    basePrice: 44.99,
    stock: 52,
    brand: 'PoloClassic',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    tags: ['polo', 'classic', 'versatile'],
    rating: 4.3,
    reviewCount: 145
  },
  {
    name: 'Hoodie',
    description: 'Comfortable hoodie with kangaroo pocket and adjustable drawstring hood.',
    basePrice: 79.99,
    stock: 38,
    brand: 'StreetWear',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    tags: ['hoodie', 'comfortable', 'casual'],
    rating: 4.4,
    reviewCount: 167
  },
  {
    name: 'Dress Shoes',
    description: 'Elegant dress shoes made from genuine leather. Perfect for formal occasions.',
    basePrice: 159.99,
    stock: 24,
    brand: 'FormalStep',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    tags: ['dress-shoes', 'leather', 'formal'],
    rating: 4.6,
    reviewCount: 98
  },
  {
    name: 'Scarf',
    description: 'Soft cashmere scarf available in multiple colors. Perfect accessory for any season.',
    basePrice: 39.99,
    stock: 61,
    brand: 'SoftTouch',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    tags: ['scarf', 'cashmere', 'accessory'],
    rating: 4.2,
    reviewCount: 87
  },

  // Home & Kitchen (10 products)
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and auto-brew feature.',
    basePrice: 129.99,
    stock: 31,
    brand: 'BrewMaster',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    tags: ['coffee', 'programmable', 'thermal'],
    rating: 4.5,
    reviewCount: 178,
    isFeatured: true
  },
  {
    name: 'Non-Stick Pan Set',
    description: 'Set of 3 non-stick pans with heat-resistant handles and even heat distribution.',
    basePrice: 89.99,
    stock: 26,
    brand: 'CookPro',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    tags: ['non-stick', 'cookware', 'set'],
    rating: 4.4,
    reviewCount: 134
  },
  {
    name: 'Blender',
    description: 'High-speed blender with multiple speed settings and durable glass pitcher.',
    basePrice: 99.99,
    stock: 19,
    brand: 'BlendMax',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    tags: ['blender', 'high-speed', 'glass'],
    rating: 4.3,
    reviewCount: 156
  },
  {
    name: 'Microwave Oven',
    description: 'Compact microwave oven with digital controls and multiple cooking presets.',
    basePrice: 179.99,
    stock: 14,
    brand: 'QuickHeat',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    tags: ['microwave', 'compact', 'digital'],
    rating: 4.2,
    reviewCount: 89
  },
  {
    name: 'Dining Table',
    description: 'Wooden dining table for 6 people with elegant design and sturdy construction.',
    basePrice: 399.99,
    stock: 8,
    brand: 'WoodCraft',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    tags: ['dining', 'wooden', 'elegant'],
    rating: 4.7,
    reviewCount: 67
  },
  {
    name: 'Bed Sheets Set',
    description: 'Soft cotton bed sheets set including pillowcases and fitted sheet.',
    basePrice: 59.99,
    stock: 43,
    brand: 'SleepComfort',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    tags: ['bedding', 'cotton', 'soft'],
    rating: 4.4,
    reviewCount: 198
  },
  {
    name: 'Vacuum Cleaner',
    description: 'Powerful vacuum cleaner with HEPA filter and multiple attachments.',
    basePrice: 199.99,
    stock: 17,
    brand: 'CleanMax',
    image: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg',
    tags: ['vacuum', 'hepa', 'powerful'],
    rating: 4.5,
    reviewCount: 123
  },
  {
    name: 'Throw Pillows',
    description: 'Decorative throw pillows with removable covers. Set of 4 in matching colors.',
    basePrice: 49.99,
    stock: 56,
    brand: 'HomeDecor',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    tags: ['pillows', 'decorative', 'set'],
    rating: 4.1,
    reviewCount: 87
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional kitchen knife set with wooden block and sharpening steel.',
    basePrice: 149.99,
    stock: 22,
    brand: 'SharpEdge',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    tags: ['knives', 'professional', 'wooden-block'],
    rating: 4.6,
    reviewCount: 145
  },
  {
    name: 'Air Purifier',
    description: 'HEPA air purifier with quiet operation and smart air quality monitoring.',
    basePrice: 249.99,
    stock: 13,
    brand: 'PureAir',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    tags: ['air-purifier', 'hepa', 'quiet'],
    rating: 4.7,
    reviewCount: 98
  },

  // Books (8 products)
  {
    name: 'Programming Guide',
    description: 'Comprehensive programming guide covering modern development practices and techniques.',
    basePrice: 49.99,
    stock: 67,
    brand: 'TechBooks',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    tags: ['programming', 'guide', 'technical'],
    rating: 4.6,
    reviewCount: 234
  },
  {
    name: 'Mystery Novel',
    description: 'Thrilling mystery novel with unexpected twists and engaging characters.',
    basePrice: 19.99,
    stock: 89,
    brand: 'PageTurner',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    tags: ['mystery', 'novel', 'thriller'],
    rating: 4.4,
    reviewCount: 156
  },
  {
    name: 'Cookbook',
    description: 'Collection of healthy recipes with step-by-step instructions and nutritional information.',
    basePrice: 34.99,
    stock: 45,
    brand: 'HealthyEats',
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    tags: ['cookbook', 'healthy', 'recipes'],
    rating: 4.5,
    reviewCount: 189
  },
  {
    name: 'Self-Help Book',
    description: 'Motivational self-help book with practical advice for personal development.',
    basePrice: 24.99,
    stock: 72,
    brand: 'LifeChange',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    tags: ['self-help', 'motivation', 'development'],
    rating: 4.3,
    reviewCount: 167
  },
  {
    name: 'History Book',
    description: 'Detailed history book covering important events and their impact on modern society.',
    basePrice: 39.99,
    stock: 34,
    brand: 'HistoryPress',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    tags: ['history', 'educational', 'society'],
    rating: 4.4,
    reviewCount: 98
  },
  {
    name: 'Science Fiction',
    description: 'Epic science fiction novel set in a futuristic world with advanced technology.',
    basePrice: 22.99,
    stock: 58,
    brand: 'SciFiWorld',
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    tags: ['sci-fi', 'futuristic', 'technology'],
    rating: 4.5,
    reviewCount: 123
  },
  {
    name: 'Art Book',
    description: 'Beautiful art book featuring works from renowned artists with detailed analysis.',
    basePrice: 59.99,
    stock: 23,
    brand: 'ArtGallery',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    tags: ['art', 'gallery', 'analysis'],
    rating: 4.7,
    reviewCount: 76
  },
  {
    name: 'Travel Guide',
    description: 'Comprehensive travel guide with insider tips and hidden gems for popular destinations.',
    basePrice: 29.99,
    stock: 41,
    brand: 'WanderGuide',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    tags: ['travel', 'guide', 'destinations'],
    rating: 4.2,
    reviewCount: 134
  },

  // Sports & Outdoors (7 products)
  {
    name: 'Yoga Mat',
    description: 'Premium yoga mat with excellent grip and cushioning for comfortable practice.',
    basePrice: 49.99,
    stock: 56,
    brand: 'YogaPro',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    tags: ['yoga', 'mat', 'grip'],
    rating: 4.5,
    reviewCount: 189
  },
  {
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells set with multiple weight options for home workouts.',
    basePrice: 199.99,
    stock: 18,
    brand: 'FitStrong',
    image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg',
    tags: ['dumbbells', 'adjustable', 'workout'],
    rating: 4.6,
    reviewCount: 145,
    isFeatured: true
  },
  {
    name: 'Tennis Racket',
    description: 'Professional tennis racket with lightweight frame and comfortable grip.',
    basePrice: 129.99,
    stock: 27,
    brand: 'TennisAce',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    tags: ['tennis', 'racket', 'professional'],
    rating: 4.4,
    reviewCount: 98
  },
  {
    name: 'Camping Tent',
    description: 'Waterproof camping tent for 4 people with easy setup and durable materials.',
    basePrice: 179.99,
    stock: 14,
    brand: 'OutdoorLife',
    image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg',
    tags: ['camping', 'tent', 'waterproof'],
    rating: 4.5,
    reviewCount: 123
  },
  {
    name: 'Basketball',
    description: 'Official size basketball with excellent bounce and durable construction.',
    basePrice: 39.99,
    stock: 43,
    brand: 'SportsBall',
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
    tags: ['basketball', 'official', 'durable'],
    rating: 4.3,
    reviewCount: 87
  },
  {
    name: 'Hiking Backpack',
    description: 'Large hiking backpack with multiple compartments and water-resistant material.',
    basePrice: 89.99,
    stock: 31,
    brand: 'TrailMaster',
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg',
    tags: ['hiking', 'backpack', 'water-resistant'],
    rating: 4.4,
    reviewCount: 156
  },
  {
    name: 'Swimming Goggles',
    description: 'Anti-fog swimming goggles with UV protection and comfortable silicone seal.',
    basePrice: 24.99,
    stock: 67,
    brand: 'AquaVision',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
    tags: ['swimming', 'goggles', 'anti-fog'],
    rating: 4.2,
    reviewCount: 134
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-platform');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding process...');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Existing data cleared');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create category mapping
    const categoryMap = {};
    createdCategories.forEach(cat => {
      if (cat.name === 'Electronics') categoryMap.electronics = cat._id;
      if (cat.name === 'Clothing') categoryMap.clothing = cat._id;
      if (cat.name === 'Home & Kitchen') categoryMap.homeKitchen = cat._id;
      if (cat.name === 'Books') categoryMap.books = cat._id;
      if (cat.name === 'Sports & Outdoors') categoryMap.sports = cat._id;
      if (cat.name === 'Beauty & Personal Care') categoryMap.beauty = cat._id;
      if (cat.name === 'Automotive') categoryMap.automotive = cat._id;
      if (cat.name === 'Toys & Games') categoryMap.toys = cat._id;
      if (cat.name === 'Health & Wellness') categoryMap.health = cat._id;
      if (cat.name === 'Office Supplies') categoryMap.office = cat._id;
    });

    // Assign categories to products
    const productsWithCategories = products.map((product, index) => {
      let categoryId;
      
      if (index < 15) categoryId = categoryMap.electronics;
      else if (index < 30) categoryId = categoryMap.clothing;
      else if (index < 40) categoryId = categoryMap.homeKitchen;
      else if (index < 48) categoryId = categoryMap.books;
      else categoryId = categoryMap.sports;

      return {
        ...product,
        category: categoryId,
        currentPrice: product.basePrice,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    // Update category product counts
    for (const category of createdCategories) {
      const productCount = createdProducts.filter(p => 
        p.category.toString() === category._id.toString()
      ).length;
      
      await Category.findByIdAndUpdate(category._id, { productCount });
    }

    console.log('Category product counts updated');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@store.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Store Administrator',
        email: 'admin@store.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created (admin@store.com / admin123)');
    }

    console.log('\nDatabase seeding completed successfully!');
    console.log(`Total categories: ${createdCategories.length}`);
    console.log(`Total products: ${createdProducts.length}`);
    console.log('Admin login: admin@store.com / admin123');

  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

connectDB().then(() => {
  seedDatabase().then(() => {
    mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  });
});