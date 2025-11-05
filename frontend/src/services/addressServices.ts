import api from '../api/api';

// Interface para dados de endereço
export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  name: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

// Busca todos os endereços do usuário autenticado
export const getAddresses = async () => {
  return await api.get('/addresses');
};

// Busca um endereço específico por ID
export const getAddressById = async (id: string) => {
  return await api.get(`/addresses/${id}`);
};

// Cria um novo endereço
export const createAddress = async (addressData: CreateAddressData) => {
  return await api.post('/addresses', addressData);
};

// Atualiza um endereço existente
export const updateAddress = async (id: string, addressData: UpdateAddressData) => {
  return await api.put(`/addresses/${id}`, addressData);
};

// Deleta um endereço
export const deleteAddress = async (id: string) => {
  return await api.delete(`/addresses/${id}`);
};

// Define um endereço como padrão
export const setDefaultAddress = async (id: string) => {
  return await api.patch(`/addresses/${id}/default`);
};

