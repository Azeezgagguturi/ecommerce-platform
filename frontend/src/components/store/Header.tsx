import { ShoppingCart, Zap, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  activeView: 'store' | 'flash-sale';
  onViewChange: (view: 'store' | 'flash-sale') => void;
}

export default function Header({ activeView, onViewChange }: HeaderProps) {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onViewChange('store')}
              className="flex items-center gap-2 text-xl font-bold text-brand-700"
            >
              <Store className="w-7 h-7" />
              FlashMart
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onViewChange('store')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'store'
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => onViewChange('flash-sale')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'flash-sale'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-4 h-4" />
                Flash Sale
              </button>
            </nav>
          </div>

          <button
            onClick={openCart}
            className="relative p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-600 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
