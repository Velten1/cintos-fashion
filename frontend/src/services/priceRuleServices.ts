import api from '../api/api';

export interface PriceRule {
  id: string;
  productId: string;
  fabricType?: string | null;
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
  };
}

export interface CreatePriceRuleData {
  productId: string;
  fabricType?: string | null;
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
  active?: boolean;
}

export interface UpdatePriceRuleData extends Partial<CreatePriceRuleData> {}

// Busca regras de preço ativas de um produto
export const getPriceRulesByProduct = async (productId: string) => {
  return await api.get(`/price-rules/product/${productId}`);
};

// Busca todas as regras de preço de um produto (ativas e inativas)
export const getAllPriceRulesByProduct = async (productId: string) => {
  return await api.get(`/price-rules/product/${productId}/all`);
};

// Busca uma regra de preço por ID
export const getPriceRuleById = async (id: string) => {
  return await api.get(`/price-rules/${id}`);
};

// Cria uma nova regra de preço
export const createPriceRule = async (priceRuleData: CreatePriceRuleData) => {
  return await api.post('/price-rules', priceRuleData);
};

// Atualiza uma regra de preço existente
export const updatePriceRule = async (id: string, priceRuleData: UpdatePriceRuleData) => {
  return await api.put(`/price-rules/${id}`, priceRuleData);
};

// Deleta uma regra de preço
export const deletePriceRule = async (id: string) => {
  return await api.delete(`/price-rules/${id}`);
};

