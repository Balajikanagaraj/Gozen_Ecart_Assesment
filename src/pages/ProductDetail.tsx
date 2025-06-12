import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { productService, Product } from '../services/productService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const productData = await productService.getProduct(productId);
      setProduct(productData);
      setSelectedImage(productData.imageType === 'upload' 
        ? `http://localhost:5000${productData.image}` 
        : productData.image
      );
    } catch (error: any) {
      setError(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.dynamicPrice || product.currentPrice;
  const hasDiscount = product.priceAdjustment && product.dynamicPrice && product.dynamicPrice !== product.basePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link to={`/category/${product.category._id}`} className="hover:text-blue-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            {product.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-semibold">This product is currently out of stock</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {product.category.name}
                </span>
                {product.isFeatured && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {product.brand && (
                <p className="text-lg text-gray-600 mb-4">by {product.brand}</p>
              )}

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {product.userVisits && product.userVisits > 1 && (
                  <div className="mt-2">
                    <p className="text-sm text-orange-600">
                      ⚡ Dynamic pricing active - You've visited this product {product.userVisits} times
                    </p>
                    {hasDiscount && (
                      <p className="text-xs text-orange-500">
                        Price increased due to high interest
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="font-medium">
                      {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  disabled={product.stock === 0}
                  className={`flex-1 inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
                    product.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                </button>
                
                <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors duration-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <Truck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $50</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% Protected</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <RotateCcw className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day policy</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Visit Count */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                This product has been viewed {product.visitCount} times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;