import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartSlideOver() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl animate-slide-in">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cart.items.length})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 rounded-lg bg-gray-50"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">
                            ${item.subtotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  ${cart.totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="w-full btn-primary text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
