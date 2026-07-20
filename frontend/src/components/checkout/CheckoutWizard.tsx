import { useState } from 'react';
import { Check, CreditCard, MapPin, User, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderApi } from '../../lib/api';
import type { CheckoutResponse } from '../../types';

const STEPS = [
  { id: 1, name: 'Information', icon: User },
  { id: 2, name: 'Shipping', icon: MapPin },
  { id: 3, name: 'Payment', icon: CreditCard },
];

interface FormData {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  cardNumber: string;
}

export default function CheckoutWizard() {
  const { cart, closeCart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    cardNumber: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.customerName.trim() && formData.customerEmail.trim();
      case 2:
        return formData.shippingAddress.trim();
      case 3:
        return formData.cardNumber.trim().length >= 16;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.checkout({
        sessionId: cart.sessionId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
      });
      setResult(response);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="animate-fade-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">{result.message}</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Order ID</span>
                <p className="font-mono font-medium text-xs mt-1 break-all">{result.orderId}</p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className="font-semibold text-green-600 mt-1">{result.status}</p>
              </div>
              <div>
                <span className="text-gray-500">Total</span>
                <p className="font-bold text-lg mt-1">${result.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Time</span>
                <p className="font-medium mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <button onClick={closeCart} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`hidden sm:block text-sm font-medium ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border p-6 mb-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.shippingAddress}
                onChange={(e) => updateField('shippingAddress', e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
                className="input-field"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) =>
                  updateField(
                    'cardNumber',
                    e.target.value.replace(/\D/g, '').slice(0, 16)
                  )
                }
                placeholder="4242 4242 4242 4242"
                className="input-field"
              />
            </div>
            <p className="text-xs text-gray-400">
              This is a simulated checkout. No real payment is processed.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="btn-secondary"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (currentStep === 3) {
              handleSubmit();
            } else {
              setCurrentStep((s) => s + 1);
            }
          }}
          disabled={!canProceed() || loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === 3 ? (
            `Pay $${cart.totalAmount.toFixed(2)}`
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
}
