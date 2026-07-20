import { useState } from 'react';
import { ShoppingCart, Zap, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const effectivePrice = product.flashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const handleAddToCart = async () => {
    try {
      await addToCart(
        {
          id: product.id,
          name: product.name,
          price: effectivePrice,
          imageUrl: product.imageUrl,
        },
        quantity
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setQuantity(1);
    } catch {
      // error handled by context
    }
  };

  return (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.flashSale && (
          <div className="absolute top-3 left-3">
            <span className="badge-flash">
              <Zap className="w-3 h-3" />
              Flash Sale
            </span>
          </div>
        )}
        {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              Only {product.stockQuantity} left
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ${effectivePrice.toFixed(2)}
          </span>
          {product.flashSale && product.flashSalePrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 px-2 py-2 rounded-lg border border-gray-300 text-sm bg-white"
          >
            {[...Array(Math.min(product.stockQuantity, 10))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddToCart}
            disabled={loading || product.stockQuantity === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              added
                ? 'bg-green-500 text-white'
                : product.stockQuantity === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stockQuantity === 0
              ? 'Out of Stock'
              : added
              ? 'Added!'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
