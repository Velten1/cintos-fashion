import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

/**
 * Busca o carrinho do usuário com todos os items e produtos relacionados
 */
export const getCartByUserId = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

/**
 * Cria um novo carrinho para o usuário
 */
export const createCart = async (userId: string) => {
  return await prisma.cart.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

/**
 * Busca todos os items de um carrinho
 */
export const getCartItemsByCartId = async (cartId: string) => {
  return await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

/**
 * Busca um item específico do carrinho por ID
 */
export const getCartItemById = async (cartItemId: string) => {
  return await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      product: true,
      cart: true,
    },
  });
};

/**
 * Adiciona um item ao carrinho
 */
export const addItemToCart = async (
  cartId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  subtotal: number
) => {
  return await prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
      unitPrice,
      subtotal,
    },
    include: {
      product: true,
    },
  });
};

/**
 * Atualiza a quantidade, preço unitário e subtotal de um item do carrinho
 */
export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
  unitPrice: number,
  subtotal: number
) => {
  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity,
      unitPrice,
      subtotal,
    },
    include: {
      product: true,
    },
  });
};

/**
 * Remove todos os items de um carrinho
 */
export const clearCart = async (cartId: string) => {
  return await prisma.cartItem.deleteMany({
    where: { cartId },
  });
};

/**
 * Remove um item específico do carrinho
 */
export const removeItemFromCart = async (cartItemId: string) => {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

/**
 * Busca um item do carrinho pelo produto (para verificar se já existe)
 */
export const getCartItemByProductId = async (cartId: string, productId: string) => {
  return await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
    include: {
      product: true,
    },
  });
};