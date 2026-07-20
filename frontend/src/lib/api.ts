const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error ${response.status}`,
    }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const productApi = {
  getAll: (category?: string) => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<import('../types').Product[]>(`/products${params}`);
  },
  getById: (id: string) =>
    request<import('../types').Product>(`/products/${id}`),
  getFlashSale: () =>
    request<import('../types').Product[]>('/products/flash-sale'),
};

export const orderApi = {
  getCart: (sessionId: string) =>
    request<import('../types').Cart>(`/orders/cart/${sessionId}`),

  addToCart: (data: {
    sessionId: string;
    productId: string;
    quantity: number;
    productName: string;
    productPrice: string;
    imageUrl: string;
  }) =>
    request<import('../types').Cart>('/orders/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  removeFromCart: (sessionId: string, productId: string) =>
    request<import('../types').Cart>(`/orders/cart/${sessionId}/${productId}`, {
      method: 'DELETE',
    }),

  updateQuantity: (sessionId: string, productId: string, quantity: number) =>
    request<import('../types').Cart>(
      `/orders/cart/${sessionId}/${productId}?quantity=${quantity}`,
      { method: 'PUT' }
    ),

  checkout: (data: {
    sessionId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
  }) =>
    request<import('../types').CheckoutResponse>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
