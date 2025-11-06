import { Request, Response } from 'express';
import {
  getPriceRulesByProductService,
  getAllPriceRulesByProductService,
  getPriceRuleByIdService,
  createPriceRuleService,
  updatePriceRuleService,
  deletePriceRuleService,
} from '../services/priceRulesService';

const ALLOWED_FIELDS = ['productId', 'fabricType', 'minQuantity', 'maxQuantity', 'price', 'active'];

/**
 * Valida campos para criação/atualização de PriceRule
 */
const validatePriceRuleInput = (body: any, isUpdate: boolean = false): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Para criação, productId é obrigatório
  if (!isUpdate && (!body.productId || typeof body.productId !== 'string' || body.productId.trim().length === 0)) {
    errors.push('ID do produto é obrigatório e deve ser uma string válida.');
  }

  // Para atualização, verificar se pelo menos um campo válido foi fornecido
  if (isUpdate) {
    const hasValidField = ALLOWED_FIELDS.some((field) => body[field] !== undefined);
    if (!hasValidField) {
      errors.push('Nenhum campo válido foi fornecido para atualização.');
    }
  }

  // Validar minQuantity se fornecido
  if (body.minQuantity !== undefined) {
    if (typeof body.minQuantity !== 'number' && typeof body.minQuantity !== 'string') {
      errors.push('Quantidade mínima deve ser um número.');
    } else {
      const minQty = typeof body.minQuantity === 'string' ? parseInt(body.minQuantity, 10) : Number(body.minQuantity);
      if (isNaN(minQty) || minQty < 1) {
        errors.push('Quantidade mínima deve ser um número maior ou igual a 1.');
      }
    }
  }

  // Validar maxQuantity se fornecido
  if (body.maxQuantity !== undefined && body.maxQuantity !== null && body.maxQuantity !== '') {
    if (typeof body.maxQuantity !== 'number' && typeof body.maxQuantity !== 'string') {
      errors.push('Quantidade máxima deve ser um número.');
    } else {
      const maxQty = typeof body.maxQuantity === 'string' ? parseInt(body.maxQuantity, 10) : Number(body.maxQuantity);
      if (isNaN(maxQty) || maxQty < 1) {
        errors.push('Quantidade máxima deve ser um número maior ou igual a 1.');
      }
    }
  }

  // Validar price se fornecido
  if (body.price !== undefined) {
    if (typeof body.price !== 'number' && typeof body.price !== 'string') {
      errors.push('Preço deve ser um número.');
    } else {
      const price = typeof body.price === 'string' ? parseFloat(body.price) : Number(body.price);
      if (isNaN(price) || price <= 0) {
        errors.push('Preço deve ser um número maior que zero.');
      }
    }
  }

  // Validar active se fornecido
  if (body.active !== undefined && body.active !== null) {
    if (typeof body.active !== 'boolean' && body.active !== 'true' && body.active !== 'false') {
      errors.push('Campo active deve ser um booleano (true ou false).');
    }
  }

  // Validar fabricType se fornecido
  if (body.fabricType !== undefined && body.fabricType !== null && body.fabricType !== '') {
    if (typeof body.fabricType !== 'string') {
      errors.push('Tipo de tecido deve ser uma string.');
    }
  }

  // Validar campos desconhecidos
  const bodyKeys = Object.keys(body);
  const invalidKeys = bodyKeys.filter((key) => !ALLOWED_FIELDS.includes(key));
  if (invalidKeys.length > 0) {
    errors.push(`Campos desconhecidos: ${invalidKeys.join(', ')}.`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * GET /api/price-rules/product/:productId - Lista regras de preço de um produto (apenas ativas)
 */
export const getPriceRulesByProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'ID do produto é obrigatório.' });
    }

    const response = await getPriceRulesByProductService(productId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar regras de preço:', error);
    return res.status(500).json({ message: 'Erro ao buscar regras de preço.', error: error.message });
  }
};

/**
 * GET /api/price-rules/product/:productId/all - Lista todas as regras de preço de um produto (incluindo inativas) - Admin
 */
export const getAllPriceRulesByProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'ID do produto é obrigatório.' });
    }

    const response = await getAllPriceRulesByProductService(productId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar regras de preço:', error);
    return res.status(500).json({ message: 'Erro ao buscar regras de preço.', error: error.message });
  }
};

/**
 * GET /api/price-rules/:id - Busca uma regra de preço específica
 */
export const getPriceRuleByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID da regra de preço é obrigatório.' });
    }

    const response = await getPriceRuleByIdService(id);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar regra de preço:', error);
    return res.status(500).json({ message: 'Erro ao buscar regra de preço.', error: error.message });
  }
};

/**
 * POST /api/price-rules - Cria uma nova regra de preço (Admin)
 */
export const createPriceRuleController = async (req: Request, res: Response) => {
  try {
    // Validação de input
    const validation = validatePriceRuleInput(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Dados de entrada inválidos. Por favor, preencha os campos corretamente.',
        errors: validation.errors,
      });
    }

    const response = await createPriceRuleService(req.body);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao criar regra de preço:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo';
      return res.status(400).json({ message: `Já existe uma regra de preço com esse ${field}.` });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Produto não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro ao criar regra de preço.', error: error.message });
  }
};

/**
 * PUT /api/price-rules/:id - Atualiza uma regra de preço existente (Admin)
 */
export const updatePriceRuleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID da regra de preço é obrigatório.' });
    }

    // Validação de input
    const validation = validatePriceRuleInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Dados de entrada inválidos. Por favor, preencha os campos corretamente.',
        errors: validation.errors,
      });
    }

    const response = await updatePriceRuleService(id, req.body);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao atualizar regra de preço:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo';
      return res.status(400).json({ message: `Já existe uma regra de preço com esse ${field}.` });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Regra de preço não encontrada.' });
    }
    return res.status(500).json({ message: 'Erro ao atualizar regra de preço.', error: error.message });
  }
};

/**
 * DELETE /api/price-rules/:id - Deleta uma regra de preço (Admin)
 */
export const deletePriceRuleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID da regra de preço é obrigatório.' });
    }

    const response = await deletePriceRuleService(id);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao deletar regra de preço:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Regra de preço não encontrada.' });
    }
    return res.status(500).json({ message: 'Erro ao deletar regra de preço.', error: error.message });
  }
};

