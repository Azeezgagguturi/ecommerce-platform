export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  flashSale: boolean;
  flashSalePrice: number | null;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}

export interface Cart {
  sessionId: string;
  userId: string | null;
  items: CartItem[];
  totalAmount: number;
}

export interface CheckoutResponse {
  orderId: string;
  status: string;
  totalAmount: number;
  message: string;
  timestamp: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: Record<string, string>;
}
