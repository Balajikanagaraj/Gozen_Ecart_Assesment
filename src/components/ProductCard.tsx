import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  showDynamicPrice?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showDynamicPrice = false }) => {
  const displayPrice = showDynamicPrice && product.dynamicPrice ? product.dynamicPrice : product.currentPrice;
  const hasDiscount = showDynamicPrice && product.priceAdjustment;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageType === 'upload' ? `http://localhost:5000${product.image}` : product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg';
            }}
          />
          
          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Price Adjusted
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.basePrice.toFixed(2)}
                </span>
              )}
            </div>
            {showDynamicPrice && product.userVisits && product.userVisits > 1 && (
              <span className="text-xs text-orange-600">
                Visited {product.userVisits} times
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {product.stock > 0 ? (
              <span className="text-emerald-600 font-medium">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of stock</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">{product.category.name}</span>
            {product.brand && (
              <span className="text-xs text-gray-500">{product.brand}</span>
            )}
          </div>
          
          <Link
            to={`/products/${product._id}`}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            View Details
          </Link>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;