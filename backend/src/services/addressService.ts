import {
  getAllAddressesByUserId,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  findDuplicateAddress,
} from '../repository/addressRepository';
import { normalizeAddressData } from '../utils/addressValidation.util';
import prisma from '../config/prisma';

const ALLOWED_FIELDS = ['name', 'street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'isDefault'];

/**
 * Valida UUID
 */
const validateUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

/**
 * Valida campos desconhecidos
 */
const validateUnknownFields = (addressData: any): string[] => {
  return Object.keys(addressData).filter((key) => !ALLOWED_FIELDS.includes(key));
};

/**
 * Busca todos os endereços de um usuário
 */
export const getAllAddressesService = async (userId: string) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  try {
    const addresses = await getAllAddressesByUserId(userId);
    return { status: 200, data: addresses };
  } catch (error: any) {
    console.error('Erro ao buscar endereços:', error);
    return { status: 500, message: 'Erro ao buscar endereços. Tente novamente mais tarde.' };
  }
};

/**
 * Busca um endereço específico por ID
 */
export const getAddressByIdService = async (id: string, userId: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do endereço inválido.' };
  }

  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  try {
    const address = await getAddressById(id, userId);
    if (!address) {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    return { status: 200, data: address };
  } catch (error: any) {
    console.error('Erro ao buscar endereço:', error);
    return { status: 500, message: 'Erro ao buscar endereço. Tente novamente mais tarde.' };
  }
};

/**
 * Cria um novo endereço
 */
export const createAddressService = async (addressData: any, userId: string) => {
  // Garante que o userId do payload corresponde ao userId autenticado
  if (addressData.userId !== userId) {
    return { status: 403, message: 'Não é possível criar endereço para outro usuário.' };
  }

  // Remove userId para validação (userId não é um campo validado, vem do token)
  const { userId: _, ...dataForValidation } = addressData;

  // Valida campos desconhecidos
  const unknownFields = validateUnknownFields(dataForValidation);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  // Valida e normaliza dados
  const validation = normalizeAddressData(addressData);
  if (!validation.isValid || !validation.normalized) {
    return {
      status: 400,
      message: 'Dados do endereço inválidos.',
      errors: validation.errors,
    };
  }

  try {
    const normalizedData = validation.normalized;

    // Verifica se já existe um endereço idêntico para este usuário
    const duplicateAddress = await findDuplicateAddress(
      normalizedData.userId,
      normalizedData.street,
      normalizedData.number,
      normalizedData.zipCode,
      normalizedData.neighborhood,
      normalizedData.city,
      normalizedData.state,
      normalizedData.complement
    );

    if (duplicateAddress) {
      return {
        status: 400,
        message: 'Já existe um endereço idêntico cadastrado. Não é possível criar endereços duplicados.',
      };
    }

    // Se o endereço está sendo criado como padrão, remove isDefault dos outros endereços do usuário
    if (normalizedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: normalizedData.userId },
        data: { isDefault: false },
      });
    }

    // Prepara dados no formato esperado pelo Prisma
    const { userId, ...addressFields } = normalizedData;
    const addressDataForPrisma = {
      ...addressFields,
      user: {
        connect: { id: userId },
      },
    };

    const address = await createAddress(addressDataForPrisma);
    return { status: 201, data: address };
  } catch (error: any) {
    console.error('Erro ao criar endereço:', error);
    if (error.code === 'P2002') {
      return { status: 400, message: 'Já existe um endereço com esses dados.' };
    }
    if (error.code === 'P2003') {
      return { status: 400, message: 'Usuário não encontrado.' };
    }
    return { status: 500, message: 'Erro ao criar endereço. Tente novamente mais tarde.' };
  }
};

/**
 * Atualiza um endereço existente
 */
export const updateAddressService = async (id: string, userId: string, addressData: any) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do endereço inválido.' };
  }

  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  // Verifica se o endereço existe e pertence ao usuário
  const existingAddress = await getAddressById(id, userId);
  if (!existingAddress) {
    return { status: 404, message: 'Endereço não encontrado.' };
  }

  // Valida campos desconhecidos
  const unknownFields = validateUnknownFields(addressData);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  // Se não há campos para atualizar
  if (Object.keys(addressData).length === 0) {
    return { status: 400, message: 'Nenhum campo foi fornecido para atualização.' };
  }

  // Prepara dados para validação (incluindo dados existentes para campos não fornecidos)
  const dataToValidate = {
    userId,
    name: addressData.name ?? existingAddress.name,
    street: addressData.street ?? existingAddress.street,
    number: addressData.number ?? existingAddress.number,
    complement: addressData.complement !== undefined ? addressData.complement : existingAddress.complement,
    neighborhood: addressData.neighborhood ?? existingAddress.neighborhood,
    city: addressData.city ?? existingAddress.city,
    state: addressData.state ?? existingAddress.state,
    zipCode: addressData.zipCode ?? existingAddress.zipCode,
    isDefault: addressData.isDefault !== undefined ? addressData.isDefault : existingAddress.isDefault,
  };

  // Valida e normaliza dados
  const validation = normalizeAddressData(dataToValidate);
  if (!validation.isValid || !validation.normalized) {
    return {
      status: 400,
      message: 'Dados do endereço inválidos.',
      errors: validation.errors,
    };
  }

  try {
    const normalizedData = validation.normalized;

    // Verifica se ao atualizar, não está criando um endereço duplicado (ignorando o próprio endereço)
    const duplicateAddress = await findDuplicateAddress(
      userId,
      normalizedData.street,
      normalizedData.number,
      normalizedData.zipCode,
      normalizedData.neighborhood,
      normalizedData.city,
      normalizedData.state,
      normalizedData.complement
    );

    // Se encontrou um duplicado e não é o próprio endereço que está sendo atualizado
    if (duplicateAddress && duplicateAddress.id !== id) {
      return {
        status: 400,
        message: 'Já existe outro endereço idêntico cadastrado. Não é possível ter endereços duplicados.',
      };
    }

    // Se o endereço está sendo atualizado como padrão, remove isDefault dos outros endereços
    if (normalizedData.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Remove userId dos dados de atualização (não deve ser atualizado)
    const { userId: _, ...updateData } = normalizedData;

    const updatedAddress = await updateAddress(id, userId, updateData);
    if (!updatedAddress) {
      return { status: 404, message: 'Endereço não encontrado.' };
    }

    return { status: 200, data: updatedAddress };
  } catch (error: any) {
    console.error('Erro ao atualizar endereço:', error);
    if (error.code === 'P2025') {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    if (error.code === 'P2002') {
      return { status: 400, message: 'Já existe um endereço com esses dados.' };
    }
    return { status: 500, message: 'Erro ao atualizar endereço. Tente novamente mais tarde.' };
  }
};

/**
 * Deleta um endereço
 */
export const deleteAddressService = async (id: string, userId: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do endereço inválido.' };
  }

  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  // Verifica se o endereço existe e pertence ao usuário
  const existingAddress = await getAddressById(id, userId);
  if (!existingAddress) {
    return { status: 404, message: 'Endereço não encontrado.' };
  }

  try {
    const deletedAddress = await deleteAddress(id, userId);
    if (!deletedAddress) {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    return { status: 200, message: 'Endereço deletado com sucesso.' };
  } catch (error: any) {
    console.error('Erro ao deletar endereço:', error);
    if (error.code === 'P2025') {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    return { status: 500, message: 'Erro ao deletar endereço. Tente novamente mais tarde.' };
  }
};

/**
 * Define um endereço como padrão
 */
export const setDefaultAddressService = async (id: string, userId: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do endereço inválido.' };
  }

  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  // Verifica se o endereço existe e pertence ao usuário
  const existingAddress = await getAddressById(id, userId);
  if (!existingAddress) {
    return { status: 404, message: 'Endereço não encontrado.' };
  }

  // Se já é o endereço padrão, não precisa fazer nada
  if (existingAddress.isDefault) {
    return { status: 200, data: existingAddress, message: 'Endereço já é o padrão.' };
  }

  try {
    const updatedAddress = await setDefaultAddress(id, userId);
    if (!updatedAddress) {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    return { status: 200, data: updatedAddress, message: 'Endereço definido como padrão com sucesso.' };
  } catch (error: any) {
    console.error('Erro ao definir endereço padrão:', error);
    if (error.code === 'P2025') {
      return { status: 404, message: 'Endereço não encontrado.' };
    }
    return { status: 500, message: 'Erro ao definir endereço padrão. Tente novamente mais tarde.' };
  }
};

