import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getAllAddressesByUserId = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' }, // Endereços padrão primeiro
      { createdAt: 'desc' }, // Mais recentes primeiro
    ],
  });
};

export const getAddressById = async (id: string, userId: string) => {
  return await prisma.address.findFirst({
    where: {
      id,
      userId, // Garante que o endereço pertence ao usuário
    },
  });
};

export const createAddress = async (addressData: Prisma.AddressCreateInput) => {
  return await prisma.address.create({
    data: addressData,
  });
};

export const updateAddress = async (id: string, userId: string, addressData: Prisma.AddressUpdateInput) => {
  // Verifica se o endereço pertence ao usuário antes de atualizar
  const address = await prisma.address.findFirst({
    where: { id, userId },
  });

  if (!address) {
    return null;
  }

  return await prisma.address.update({
    where: { id },
    data: addressData,
  });
};

export const deleteAddress = async (id: string, userId: string) => {
  // Verifica se o endereço pertence ao usuário antes de deletar
  const address = await prisma.address.findFirst({
    where: { id, userId },
  });

  if (!address) {
    return null;
  }

  return await prisma.address.delete({
    where: { id },
  });
};

export const setDefaultAddress = async (id: string, userId: string) => {
  // Verifica se o endereço pertence ao usuário
  const address = await prisma.address.findFirst({
    where: { id, userId },
  });

  if (!address) {
    return null;
  }

  // Usa transação para garantir consistência
  return await prisma.$transaction(async (tx) => {
    // Remove isDefault de todos os endereços do usuário
    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Define o endereço específico como padrão
    return await tx.address.update({
      where: { id },
      data: { isDefault: true },
    });
  });
};

/**
 * Verifica se já existe um endereço idêntico para o usuário
 */
export const findDuplicateAddress = async (
  userId: string,
  street: string,
  number: string,
  zipCode: string,
  neighborhood: string,
  city: string,
  state: string,
  complement?: string | null
) => {
  return await prisma.address.findFirst({
    where: {
      userId,
      street,
      number,
      zipCode,
      neighborhood,
      city,
      state,
      complement: complement || null,
    },
  });
};
