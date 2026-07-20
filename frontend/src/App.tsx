import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/store/Header';
import ProductGrid from './components/store/ProductGrid';
import CartSlideOver from './components/cart/CartSlideOver';
import CheckoutPage from './components/checkout/CheckoutPage';

function AppContent() {
  const [activeView, setActiveView] = useState<'store' | 'flash-sale'>('store');
  const { isOpen } = useCart();

  const isCheckoutView = isOpen;

  if (isCheckoutView) {
    return (
      <>
        <CheckoutPage />
        <CartSlideOver />
      </>
    );
  }

  return (
    <>
      <Header activeView={activeView} onViewChange={setActiveView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeView === 'flash-sale' ? 'Flash Sale' : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeView === 'flash-sale'
              ? 'Limited time deals - grab them before they are gone!'
              : 'Browse our curated collection of premium tech products'}
          </p>
        </div>

        <ProductGrid flashSaleOnly={activeView === 'flash-sale'} />
      </main>

      <CartSlideOver />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      <AppContent />
    </CartProvider>
  );
}
