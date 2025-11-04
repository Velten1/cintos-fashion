import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getAllProducts = async (where: Prisma.ProductWhereInput, orderBy: any[], skip: number, take: number) => {
  return await prisma.product.findMany({ where, orderBy, skip, take });
};

export const getProductsCount = async (where: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ where });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({ where: { id } });
};

export const getProductByName = async (name: string) => {
  const normalizedName = name.trim();
  // Busca todos os produtos e compara case-insensitive (MySQL nao suporta mode: 'insensitive')
  const products = await prisma.product.findMany({
    where: { name: { contains: normalizedName } },
  });
  const lowerName = normalizedName.toLowerCase();
  return products.find((p) => p.name.toLowerCase().trim() === lowerName) || null;
};

export const createProduct = async (productData: any) => {
  return await prisma.product.create({ data: productData });
};

export const editProduct = async (id: string, productData: any) => {
  return await prisma.product.update({ where: { id }, data: productData });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.update({ where: { id }, data: { active: false } });
};
