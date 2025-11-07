import api from '../api/api';

// Interfaces
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    basePrice: string;
    promotionalPrice: string | null;
    category: string;
    imageUrl: string | null;
    images: string[] | null;
    stock: number;
    active: boolean;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddItemToCartData {
  productId: string;
  quantity: number;
  fabricType?: string;
  characteristics?: Record<string, unknown>;
}

export interface UpdateItemQuantityData {
  quantity: number;
}

export interface CartTotal {
  total: number;
}

export interface CartResponse {
  status: number;
  message?: string;
  data?: Cart | CartItem | CartTotal;
  debug?: {
    priceCalculation: {
      appliedRule?: string;
      basePrice?: number;
      unitPrice: number;
      subtotal: number;
      quantity: number;
    };
  };
}

// Busca o carrinho do usuário
export const getCart = async () => {
  return await api.get('/cart');
};

// Adiciona um item ao carrinho
export const addItemToCart = async (data: AddItemToCartData) => {
  return await api.post('/cart/items', data);
};

// Atualiza a quantidade de um item
export const updateItemQuantity = async (itemId: string, data: UpdateItemQuantityData) => {
  return await api.put(`/cart/items/${itemId}`, data);
};

// Remove um item do carrinho
export const removeItem = async (itemId: string) => {
  return await api.delete(`/cart/items/${itemId}`);
};

// Limpa todos os items do carrinho
export const clearCart = async () => {
  return await api.delete('/cart/clear');
};

// Calcula o total do carrinho
export const getCartTotal = async () => {
  return await api.get('/cart/total');
};

