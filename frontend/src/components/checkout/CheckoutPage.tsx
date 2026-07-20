import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CheckoutWizard from '../checkout/CheckoutWizard';

export default function CheckoutPage() {
  const { cart, closeCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={closeCart}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Checkout
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        ) : (
          <CheckoutWizard />
        )}
      </div>
    </div>
  );
}
