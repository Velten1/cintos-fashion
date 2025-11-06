import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

/**
 * Busca todas as regras de preço de um produto (apenas ativas)
 */
export const getPriceRulesByProductId = async (productId: string) => {
  return await prisma.priceRule.findMany({
    where: {
      productId,
      active: true,
    },
    orderBy: {
      minQuantity: 'asc', // Ordena por quantidade mínima
    },
  });
};

/**
 * Busca todas as regras de preço de um produto (incluindo inativas)
 */
export const getAllPriceRulesByProductId = async (productId: string) => {
  return await prisma.priceRule.findMany({
    where: {
      productId,
    },
    orderBy: {
      minQuantity: 'asc',
    },
  });
};

/**
 * Busca todas as regras de preço (para debug)
 */
export const getAllPriceRules = async () => {
  return await prisma.priceRule.findMany({
    select: {
      id: true,
      productId: true,
      minQuantity: true,
      maxQuantity: true,
      price: true,
      active: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Busca uma regra de preço por ID
 */
export const getPriceRuleById = async (id: string) => {
  return await prisma.priceRule.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

/**
 * Cria uma nova regra de preço
 */
export const createPriceRule = async (priceRuleData: Prisma.PriceRuleCreateInput) => {
  return await prisma.priceRule.create({
    data: priceRuleData,
  });
};

/**
 * Atualiza uma regra de preço existente
 */
export const updatePriceRule = async (id: string, priceRuleData: Prisma.PriceRuleUpdateInput) => {
  return await prisma.priceRule.update({
    where: { id },
    data: priceRuleData,
  });
};

/**
 * Deleta uma regra de preço
 */
export const deletePriceRule = async (id: string) => {
  return await prisma.priceRule.delete({
    where: { id },
  });
};

/**
 * Verifica se há regras de preço sobrepostas para o mesmo produto
 * 
 * Duas regras se sobrepõem se:
 * - Têm o mesmo fabricType (ou ambas null)
 * - As faixas de quantidade se interceptam
 * 
 * Exemplo de sobreposição:
 * - Regra 1: minQuantity: 1, maxQuantity: 999
 * - Regra 2: minQuantity: 500, maxQuantity: 1500 → SOBREPÕE
 * 
 * Exemplo sem sobreposição:
 * - Regra 1: minQuantity: 1, maxQuantity: 999
 * - Regra 2: minQuantity: 1000, maxQuantity: null → NÃO SOBREPÕE
 */
export const findOverlappingPriceRules = async (
  productId: string,
  minQuantity: number,
  maxQuantity: number | null,
  fabricType: string | null,
  excludeId?: string // ID da regra a excluir da verificação (útil ao editar)
) => {
  // Construir condições de sobreposição
  // Duas faixas se sobrepõem se:
  // (minQuantity <= existing.maxQuantity OU existing.maxQuantity é null) E
  // (maxQuantity >= existing.minQuantity OU maxQuantity é null)
  
  const whereConditions: Prisma.PriceRuleWhereInput = {
    productId,
    active: true,
    fabricType: fabricType || null,
    // Excluir a própria regra se estiver editando
    ...(excludeId && { id: { not: excludeId } }),
    AND: [
      // A nova faixa começa antes ou dentro da faixa existente
      {
        OR: [
          { maxQuantity: null }, // Regra existente sem limite máximo
          { maxQuantity: { gte: minQuantity } }, // Regra existente vai até pelo menos o início da nova
        ],
      },
      // A nova faixa termina depois ou dentro da faixa existente
      {
        OR: [
          maxQuantity === null
            ? { minQuantity: { lte: 999999 } } // Se nova regra não tem limite, verifica se existente começa antes de um número grande
            : { minQuantity: { lte: maxQuantity } }, // Regra existente começa antes ou no fim da nova
        ],
      },
    ],
  };

  return await prisma.priceRule.findMany({
    where: whereConditions,
  });
};
