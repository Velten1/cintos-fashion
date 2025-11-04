import api from '../api/api';

// Interface para os dados do produto que o backend espera
export interface CreateProductData {
  name: string;
  description?: string;
  descriptionComplete?: string;
  basePrice: number;
  promotionalPrice?: number;
  category: 'BELTS' | 'BUCKLE' | 'ACCESSORIES';
  typeBelt?: 'CLASSIC' | 'CASUAL' | 'EXECUTIVE' | 'SPORTY' | 'SOCIAL';
  characteristics?: {
    largura: string;
    comprimento: string;
    material: string;
    acabamento: string;
    fivela: {
      tipo: string;
      formato: string;
      dimensoes: string;
    };
    cor: string;
    resistenteAgua?: boolean;
    forro?: string;
    garantia?: string;
  };
  imageUrl?: string;
  images?: string[];
  inPromotion?: boolean;
  bestSelling?: boolean;
  new?: boolean;
  stock?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  categoria?: string | string[];
  typeBelt?: string | string[];
  inPromotion?: boolean | string;
  bestSelling?: boolean | string;
  new?: boolean | string;
  precoMin?: number | string;
  precoMax?: number | string;
  busca?: string;
  active?: boolean | string;
  page?: number | string;
  limit?: number | string;
  sort?: string;
}

// Busca produtos com filtros e paginacao
export const getProducts = async (filters?: ProductFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.categoria) {
    if (Array.isArray(filters.categoria)) {
      filters.categoria.forEach(cat => params.append('categoria', cat));
    } else {
      params.append('categoria', filters.categoria);
    }
  }
  
  if (filters?.typeBelt) {
    if (Array.isArray(filters.typeBelt)) {
      filters.typeBelt.forEach(type => params.append('typeBelt', type));
    } else {
      params.append('typeBelt', filters.typeBelt);
    }
  }
  
  if (filters?.inPromotion !== undefined) {
    params.append('inPromotion', String(filters.inPromotion));
  }
  
  if (filters?.bestSelling !== undefined) {
    params.append('bestSelling', String(filters.bestSelling));
  }
  
  if (filters?.new !== undefined) {
    params.append('new', String(filters.new));
  }
  
  if (filters?.precoMin !== undefined) {
    params.append('precoMin', String(filters.precoMin));
  }
  
  if (filters?.precoMax !== undefined) {
    params.append('precoMax', String(filters.precoMax));
  }
  
  if (filters?.busca) {
    params.append('busca', filters.busca);
  }
  
  if (filters?.active !== undefined) {
    params.append('active', String(filters.active));
  }
  
  if (filters?.page) {
    params.append('page', String(filters.page));
  }
  
  if (filters?.limit) {
    params.append('limit', String(filters.limit));
  }
  
  if (filters?.sort) {
    params.append('sort', filters.sort);
  }

  const queryString = params.toString();
  return await api.get(`/products${queryString ? `?${queryString}` : ''}`);
};

// Busca um produto por ID
export const getProductById = async (id: string) => {
  return await api.get(`/products/${id}`);
};

// Cria um novo produto (admin only)
export const createProduct = async (productData: CreateProductData) => {
  return await api.post('/products', productData);
};

// Atualiza um produto (admin only)
export const updateProduct = async (id: string, productData: UpdateProductData) => {
  return await api.put(`/products/${id}`, productData);
};

// Deleta um produto (admin only - soft delete)
export const deleteProduct = async (id: string) => {
  return await api.delete(`/products/${id}`);
};

