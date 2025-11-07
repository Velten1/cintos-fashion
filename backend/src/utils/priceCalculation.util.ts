import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * Interface para dados de cálculo de preço
 */
export interface PriceCalculationInput {
  productId: string;
  quantity: number;
  characteristics?: Record<string, unknown>; // Características específicas (tamanho, dimensões, aro, etc.)
  fabricType?: string; // Tipo de tecido (se aplicável)
}

/**
 * Interface para resultado do cálculo
 */
export interface PriceCalculationResult {
  unitPrice: number;
  subtotal: number;
  appliedRule?: string; // Descrição da regra aplicada
  basePrice?: number; // Preço base usado como referência
}

/**
 * Valores de ajuste para produtos com aro
 */
const ARO_ADJUSTMENTS = {
  BUCKLE: 1.50, // Fivelas com aro: +R$ 1,50
  ACCESSORIES: 0.15, // Botões com aro: +R$ 0,15
};

/**
 * Verifica se o produto tem aro baseado nas características
 */
const hasAro = (characteristics?: Record<string, unknown>): boolean => {
  if (!characteristics) {
    return false;
  }
  
  // Verifica se tem aro nas características
  // Pode estar em characteristics.temAro ou characteristics.aro
  return (
    characteristics.temAro === true ||
    characteristics.aro === true ||
    (typeof characteristics.temAro === 'string' && characteristics.temAro.toLowerCase() === 'true') ||
    (typeof characteristics.aro === 'string' && characteristics.aro.toLowerCase() === 'true')
  );
};

/**
 * Busca e aplica PriceRule baseado na quantidade
 * 
 * A lógica garante que:
 * - Quantidade <= 999: aplica regra com maxQuantity >= quantidade ou maxQuantity = null
 * - Quantidade >= 1000: aplica regra com minQuantity <= quantidade e (maxQuantity >= quantidade ou maxQuantity = null)
 * 
 * Ordena por minQuantity desc para pegar a regra mais específica (maior minQuantity que se aplica)
 */
const findApplicablePriceRule = async (
  productId: string,
  quantity: number,
  fabricType?: string
): Promise<{ price: number; rule: Prisma.PriceRuleGetPayload<{}> } | null> => {
  const priceRules = await prisma.priceRule.findMany({
    where: {
      productId,
      active: true,
      fabricType: fabricType || null,
      minQuantity: { lte: quantity },
      OR: [
        { maxQuantity: null },
        { maxQuantity: { gte: quantity } },
      ],
    },
    orderBy: {
      minQuantity: 'desc', // Pega a regra com maior minQuantity que se aplica
    },
    take: 1,
  });

  if (priceRules.length > 0) {
    return {
      price: Number(priceRules[0].price),
      rule: priceRules[0],
    };
  }

  return null;
};

/**
 * Calcula ajuste de preço para produtos com aro
 */
const calculateAroAdjustment = (
  category: string,
  characteristics?: Record<string, unknown>
): number => {
  if (!hasAro(characteristics)) {
    return 0;
  }

  // Aplicar ajuste baseado na categoria
  if (category === 'BUCKLE') {
    return ARO_ADJUSTMENTS.BUCKLE;
  }
  
  if (category === 'ACCESSORIES') {
    return ARO_ADJUSTMENTS.ACCESSORIES;
  }

  return 0;
};

/**
 * Função principal para calcular preço de um produto
 * 
 * Ordem de prioridade:
 * 1. PriceRules do produto (baseado em quantidade e fabricType)
 * 2. Preço promocional (se ativo)
 * 3. Preço base
 * 4. Ajuste de aro (se aplicável)
 */
export const calculateProductPrice = async (
  input: PriceCalculationInput
): Promise<PriceCalculationResult> => {
  const { productId, quantity, characteristics, fabricType } = input;

  // Validar quantidade
  if (quantity <= 0) {
    throw new Error('Quantidade deve ser maior que zero');
  }

  // Buscar produto
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      priceRules: {
        where: { active: true },
        orderBy: { minQuantity: 'asc' },
      },
    },
  });

  if (!product) {
    throw new Error('Produto não encontrado');
  }

  if (!product.active) {
    throw new Error('Produto não está ativo');
  }

  let unitPrice: number;
  let appliedRule: string | undefined;

  // 1. Buscar PriceRule aplicável
  const priceRule = await findApplicablePriceRule(productId, quantity, fabricType);
  
  if (priceRule) {
    unitPrice = priceRule.price;
    const maxQty = priceRule.rule?.maxQuantity 
      ? `${priceRule.rule.maxQuantity}` 
      : 'sem limite';
    appliedRule = `Regra de quantidade: ${quantity} unidades (faixa: ${priceRule.rule?.minQuantity}-${maxQty})`;
  }
  // 2. Preço promocional (se ativo)
  else if (product.inPromotion && product.promotionalPrice) {
    unitPrice = Number(product.promotionalPrice);
    appliedRule = 'Preço promocional';
  }
  // 3. Preço base (fallback)
  else {
    unitPrice = Number(product.basePrice);
    appliedRule = 'Preço base';
  }

  // 4. Aplicar ajuste de aro (se aplicável)
  const aroAdjustment = calculateAroAdjustment(product.category, characteristics);
  
  if (aroAdjustment > 0) {
    unitPrice += aroAdjustment;
    const aroType = product.category === 'BUCKLE' ? 'fivela' : 'botão';
    appliedRule += ` + ajuste de aro (${aroType}: +R$ ${aroAdjustment.toFixed(2)})`;
  }

  // Arredondar para 2 casas decimais
  unitPrice = Math.round(unitPrice * 100) / 100;

  // Calcular subtotal
  const subtotal = Math.round(unitPrice * quantity * 100) / 100;

  return {
    unitPrice,
    subtotal,
    appliedRule,
    basePrice: Number(product.basePrice),
  };
};

/**
 * Calcula o preço total de múltiplos itens
 */
export const calculateTotalPrice = async (
  items: PriceCalculationInput[]
): Promise<{ total: number; items: Array<PriceCalculationResult & { productId: string; quantity: number }> }> => {
  const calculations = await Promise.all(
    items.map(async (item) => {
      const result = await calculateProductPrice(item);
      return {
        ...result,
        productId: item.productId,
        quantity: item.quantity,
      };
    })
  );

  const total = calculations.reduce((sum, item) => sum + item.subtotal, 0);
  
  return {
    total: Math.round(total * 100) / 100,
    items: calculations,
  };
};

/**
 * Valida se a quantidade está dentro do estoque disponível
 */
export const validateStock = async (productId: string, quantity: number): Promise<boolean> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    return false;
  }

  return quantity <= product.stock;
};
