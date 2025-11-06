import {
  getPriceRulesByProductId,
  getAllPriceRulesByProductId,
  getPriceRuleById,
  createPriceRule,
  updatePriceRule,
  deletePriceRule,
  findOverlappingPriceRules,
  getAllPriceRules,
} from '../repository/priceRulesRepository';
import prisma from '../config/prisma';

const ALLOWED_FIELDS = ['productId', 'fabricType', 'minQuantity', 'maxQuantity', 'price', 'active'];

/**
 * Valida UUID
 */
const validateUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

/**
 * Valida campos desconhecidos
 */
const validateUnknownFields = (priceRuleData: any): string[] => {
  return Object.keys(priceRuleData).filter((key) => !ALLOWED_FIELDS.includes(key));
};

/**
 * Valida dados de uma PriceRule
 */
const validatePriceRuleData = (priceRuleData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar productId
  if (!priceRuleData.productId || typeof priceRuleData.productId !== 'string') {
    errors.push('ID do produto é obrigatório e deve ser uma string válida.');
  } else if (!validateUUID(priceRuleData.productId)) {
    errors.push('ID do produto inválido.');
  }

  // Validar minQuantity
  if (priceRuleData.minQuantity === undefined || priceRuleData.minQuantity === null) {
    errors.push('Quantidade mínima é obrigatória.');
  } else {
    const minQty = typeof priceRuleData.minQuantity === 'string' 
      ? parseInt(priceRuleData.minQuantity, 10) 
      : Number(priceRuleData.minQuantity);
    
    if (isNaN(minQty) || minQty < 1) {
      errors.push('Quantidade mínima deve ser um número maior ou igual a 1.');
    }
  }

  // Validar maxQuantity (opcional, mas se fornecido deve ser válido)
  if (priceRuleData.maxQuantity !== undefined && priceRuleData.maxQuantity !== null && priceRuleData.maxQuantity !== '') {
    const maxQty = typeof priceRuleData.maxQuantity === 'string' 
      ? parseInt(priceRuleData.maxQuantity, 10) 
      : Number(priceRuleData.maxQuantity);
    
    if (isNaN(maxQty) || maxQty < 1) {
      errors.push('Quantidade máxima deve ser um número maior ou igual a 1.');
    } else {
      const minQty = typeof priceRuleData.minQuantity === 'string' 
        ? parseInt(priceRuleData.minQuantity, 10) 
        : Number(priceRuleData.minQuantity);
      
      if (!isNaN(minQty) && maxQty <= minQty) {
        errors.push('Quantidade máxima deve ser maior que a quantidade mínima.');
      }
    }
  }

  // Validar price
  if (priceRuleData.price === undefined || priceRuleData.price === null || priceRuleData.price === '') {
    errors.push('Preço é obrigatório.');
  } else {
    const price = typeof priceRuleData.price === 'string' 
      ? parseFloat(priceRuleData.price) 
      : Number(priceRuleData.price);
    
    if (isNaN(price) || price <= 0) {
      errors.push('Preço deve ser um número maior que zero.');
    }
    if (price > 999999.99) {
      errors.push('Preço não pode ser maior que R$ 999.999,99.');
    }
  }

  // Validar active (opcional, default true)
  if (priceRuleData.active !== undefined && priceRuleData.active !== null) {
    if (typeof priceRuleData.active !== 'boolean' && 
        priceRuleData.active !== 'true' && 
        priceRuleData.active !== 'false') {
      errors.push('Campo active deve ser um booleano (true ou false).');
    }
  }

  // Validar fabricType (opcional)
  if (priceRuleData.fabricType !== undefined && 
      priceRuleData.fabricType !== null && 
      priceRuleData.fabricType !== '') {
    if (typeof priceRuleData.fabricType !== 'string') {
      errors.push('Tipo de tecido deve ser uma string.');
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Busca todas as regras de preço de um produto (apenas ativas)
 */
export const getPriceRulesByProductService = async (productId: string) => {
  if (!validateUUID(productId)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  // Verificar se o produto existe
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  try {
    const priceRules = await getPriceRulesByProductId(productId);
    return { status: 200, data: priceRules };
  } catch (error: any) {
    console.error('Erro ao buscar regras de preço:', error);
    return { status: 500, message: 'Erro ao buscar regras de preço. Tente novamente mais tarde.' };
  }
};

/**
 * Busca todas as regras de preço de um produto (incluindo inativas) - para admin
 */
export const getAllPriceRulesByProductService = async (productId: string) => {
  if (!validateUUID(productId)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  // Verificar se o produto existe
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  try {
    const priceRules = await getAllPriceRulesByProductId(productId);
    return { status: 200, data: priceRules };
  } catch (error: any) {
    console.error('Erro ao buscar regras de preço:', error);
    return { status: 500, message: 'Erro ao buscar regras de preço. Tente novamente mais tarde.' };
  }
};

/**
 * Busca uma regra de preço por ID
 */
export const getPriceRuleByIdService = async (id: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID da regra de preço inválido.' };
  }

  try {
    const priceRule = await getPriceRuleById(id);
    if (!priceRule) {
      return { status: 404, message: 'Regra de preço não encontrada.' };
    }
    return { status: 200, data: priceRule };
  } catch (error: any) {
    console.error('Erro ao buscar regra de preço:', error);
    return { status: 500, message: 'Erro ao buscar regra de preço. Tente novamente mais tarde.' };
  }
};

/**
 * Cria uma nova regra de preço
 */
export const createPriceRuleService = async (priceRuleData: any) => {
  // Valida campos desconhecidos
  const unknownFields = validateUnknownFields(priceRuleData);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  // Valida dados
  const validation = validatePriceRuleData(priceRuleData);
  if (!validation.isValid) {
    return {
      status: 400,
      message: 'Dados da regra de preço inválidos.',
      errors: validation.errors,
    };
  }

  // Verificar se o produto existe
  const product = await prisma.product.findUnique({
    where: { id: priceRuleData.productId },
    select: { id: true },
  });

  if (!product) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  // Normalizar dados
  const normalizedData: any = {
    product: {
      connect: { id: priceRuleData.productId },
    },
    minQuantity: typeof priceRuleData.minQuantity === 'string' 
      ? parseInt(priceRuleData.minQuantity, 10) 
      : Number(priceRuleData.minQuantity),
    maxQuantity: priceRuleData.maxQuantity === null || priceRuleData.maxQuantity === '' || priceRuleData.maxQuantity === undefined
      ? null
      : (typeof priceRuleData.maxQuantity === 'string' 
          ? parseInt(priceRuleData.maxQuantity, 10) 
          : Number(priceRuleData.maxQuantity)),
    price: typeof priceRuleData.price === 'string' 
      ? parseFloat(priceRuleData.price) 
      : Number(priceRuleData.price),
    active: priceRuleData.active !== undefined && priceRuleData.active !== null
      ? (priceRuleData.active === true || priceRuleData.active === 'true')
      : true,
  };

  // Adicionar fabricType se fornecido
  if (priceRuleData.fabricType !== undefined && 
      priceRuleData.fabricType !== null && 
      priceRuleData.fabricType !== '') {
    normalizedData.fabricType = priceRuleData.fabricType.trim();
  }

  // Verificar sobreposição de regras
  const overlappingRules = await findOverlappingPriceRules(
    priceRuleData.productId,
    normalizedData.minQuantity,
    normalizedData.maxQuantity,
    normalizedData.fabricType || null
  );

  if (overlappingRules.length > 0) {
    return {
      status: 400,
      message: 'Já existe uma regra de preço sobreposta para este produto e tipo de tecido.',
      errors: ['Não é possível criar regras com faixas de quantidade que se sobrepõem.'],
    };
  }

  try {
    const priceRule = await createPriceRule(normalizedData);
    return { status: 201, data: priceRule };
  } catch (error: any) {
    console.error('Erro ao criar regra de preço:', error);
    if (error.code === 'P2002') {
      return { status: 400, message: 'Já existe uma regra de preço com esses dados.' };
    }
    if (error.code === 'P2003') {
      return { status: 400, message: 'Produto não encontrado.' };
    }
    return { status: 500, message: 'Erro ao criar regra de preço. Tente novamente mais tarde.' };
  }
};

/**
 * Atualiza uma regra de preço existente
 */
export const updatePriceRuleService = async (id: string, priceRuleData: any) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID da regra de preço inválido.' };
  }

  // Verificar se a regra existe
  const existingRule = await getPriceRuleById(id);
  if (!existingRule) {
    return { status: 404, message: 'Regra de preço não encontrada.' };
  }

  // Valida campos desconhecidos
  const unknownFields = validateUnknownFields(priceRuleData);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  // Se não há campos para atualizar
  if (Object.keys(priceRuleData).length === 0) {
    return { status: 400, message: 'Nenhum campo foi fornecido para atualização.' };
  }

  // Preparar dados para validação (usar valores existentes para campos não fornecidos)
  const dataToValidate = {
    productId: priceRuleData.productId ?? existingRule.productId,
    minQuantity: priceRuleData.minQuantity !== undefined ? priceRuleData.minQuantity : existingRule.minQuantity,
    maxQuantity: priceRuleData.maxQuantity !== undefined ? priceRuleData.maxQuantity : existingRule.maxQuantity,
    price: priceRuleData.price !== undefined ? priceRuleData.price : existingRule.price,
    fabricType: priceRuleData.fabricType !== undefined ? priceRuleData.fabricType : existingRule.fabricType,
    active: priceRuleData.active !== undefined ? priceRuleData.active : existingRule.active,
  };

  // Valida dados
  const validation = validatePriceRuleData(dataToValidate);
  if (!validation.isValid) {
    return {
      status: 400,
      message: 'Dados da regra de preço inválidos.',
      errors: validation.errors,
    };
  }

  // Normalizar dados
  const normalizedData: any = {};

  if (priceRuleData.minQuantity !== undefined) {
    normalizedData.minQuantity = typeof priceRuleData.minQuantity === 'string' 
      ? parseInt(priceRuleData.minQuantity, 10) 
      : Number(priceRuleData.minQuantity);
  }

  if (priceRuleData.maxQuantity !== undefined) {
    normalizedData.maxQuantity = priceRuleData.maxQuantity === null || priceRuleData.maxQuantity === ''
      ? null
      : (typeof priceRuleData.maxQuantity === 'string' 
          ? parseInt(priceRuleData.maxQuantity, 10) 
          : Number(priceRuleData.maxQuantity));
  }

  if (priceRuleData.price !== undefined) {
    normalizedData.price = typeof priceRuleData.price === 'string' 
      ? parseFloat(priceRuleData.price) 
      : Number(priceRuleData.price);
  }

  if (priceRuleData.active !== undefined) {
    normalizedData.active = priceRuleData.active === true || priceRuleData.active === 'true';
  }

  if (priceRuleData.fabricType !== undefined) {
    normalizedData.fabricType = priceRuleData.fabricType === null || priceRuleData.fabricType === ''
      ? null
      : priceRuleData.fabricType.trim();
  }

  // Verificar sobreposição de regras (excluindo a própria regra)
  const finalMinQty = normalizedData.minQuantity ?? existingRule.minQuantity;
  const finalMaxQty = normalizedData.maxQuantity !== undefined ? normalizedData.maxQuantity : existingRule.maxQuantity;
  const finalFabricType = normalizedData.fabricType !== undefined ? normalizedData.fabricType : existingRule.fabricType;

  const overlappingRules = await findOverlappingPriceRules(
    existingRule.productId,
    finalMinQty,
    finalMaxQty,
    finalFabricType || null,
    id // Excluir a própria regra
  );

  if (overlappingRules.length > 0) {
    return {
      status: 400,
      message: 'Já existe uma regra de preço sobreposta para este produto e tipo de tecido.',
      errors: ['Não é possível atualizar para uma faixa de quantidade que se sobrepõe com outra regra.'],
    };
  }

  try {
    const updatedRule = await updatePriceRule(id, normalizedData);
    return { status: 200, data: updatedRule };
  } catch (error: any) {
    console.error('Erro ao atualizar regra de preço:', error);
    if (error.code === 'P2025') {
      return { status: 404, message: 'Regra de preço não encontrada.' };
    }
    if (error.code === 'P2002') {
      return { status: 400, message: 'Já existe uma regra de preço com esses dados.' };
    }
    return { status: 500, message: 'Erro ao atualizar regra de preço. Tente novamente mais tarde.' };
  }
};

/**
 * Deleta uma regra de preço
 */
export const deletePriceRuleService = async (id: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID da regra de preço inválido.' };
  }

  // Verificar se a regra existe
  const existingRule = await getPriceRuleById(id);
  if (!existingRule) {
    return { status: 404, message: 'Regra de preço não encontrada.' };
  }

  try {
    await deletePriceRule(id);
    return { status: 200, message: 'Regra de preço deletada com sucesso.' };
  } catch (error: any) {
    console.error('Erro ao deletar regra de preço:', error);
    if (error.code === 'P2025') {
      return { status: 404, message: 'Regra de preço não encontrada.' };
    }
    return { status: 500, message: 'Erro ao deletar regra de preço. Tente novamente mais tarde.' };
  }
};

