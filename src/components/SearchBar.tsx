import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchService, SearchSuggestions } from '../services/searchService';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    products: [],
    categories: [],
    brands: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const data = await searchService.getSuggestions(query.trim());
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions({ products: [], categories: [], brands: [] });
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions({ products: [], categories: [], brands: [] });
        setShowSuggestions(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      navigate(`/category/${suggestion.id}`);
    } else {
      handleSearch(suggestion.value);
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions({ products: [], categories: [], brands: [] });
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const totalSuggestions = suggestions.products.length + suggestions.categories.length + suggestions.brands.length;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands, categories..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.trim().length > 1) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <span className="mt-2 block">Searching...</span>
            </div>
          ) : totalSuggestions > 0 ? (
            <div className="py-2">
              {/* Product Suggestions */}
              {suggestions.products.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Products
                  </div>
                  {suggestions.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                    >
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 truncate">{product.value}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Category Suggestions */}
              {suggestions.categories.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Categories
                  </div>
                  {suggestions.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSuggestionClick(category)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                    >
                      <div className="h-4 w-4 bg-blue-100 rounded flex-shrink-0"></div>
                      <span className="text-gray-900 truncate">{category.value}</span>
                      <span className="text-xs text-gray-500 ml-auto">Category</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Brand Suggestions */}
              {suggestions.brands.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Brands
                  </div>
                  {suggestions.brands.map((brand, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(brand)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                    >
                      <div className="h-4 w-4 bg-emerald-100 rounded flex-shrink-0"></div>
                      <span className="text-gray-900 truncate">{brand.value}</span>
                      <span className="text-xs text-gray-500 ml-auto">Brand</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No suggestions found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;