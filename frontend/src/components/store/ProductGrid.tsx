import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { productApi } from '../../lib/api';
import { MOCK_PRODUCTS } from '../../lib/mockData';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductGridProps {
  flashSaleOnly?: boolean;
}

export default function ProductGrid({ flashSaleOnly = false }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [usingMock, setUsingMock] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Product[];
      if (flashSaleOnly) {
        data = await productApi.getFlashSale();
      } else {
        data = await productApi.getAll(selectedCategory || undefined);
      }
      setProducts(data);
      setUsingMock(false);
    } catch {
      console.warn('Backend unavailable, using mock product data');
      const mock = flashSaleOnly
        ? MOCK_PRODUCTS.filter((p) => p.flashSale)
        : MOCK_PRODUCTS;
      setProducts(mock);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [flashSaleOnly, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="ml-3 text-gray-500">Loading products...</span>
      </div>
    );
  }

  if (error && !usingMock) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={loadProducts} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {usingMock && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          Backend unavailable — showing demo data. Start the backend services for full functionality.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {!flashSaleOnly && categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {flashSaleOnly
              ? 'No flash sale items available right now.'
              : 'No products found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
