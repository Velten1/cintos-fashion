import { Request, Response } from 'express';
import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from '../services/productService';
import { findUserById } from '../repository/authRepository';
import { UserRole } from '@prisma/client';

const ALLOWED_KEYS = ['categoria', 'typeBelt', 'inPromotion', 'bestSelling', 'new', 'precoMin', 'precoMax', 'busca', 'active', 'page', 'limit', 'sort'];
const BOOLEAN_FIELDS = ['inPromotion', 'bestSelling', 'new', 'active'];
const VALID_CATEGORIES = ['BELTS', 'BUCKLE', 'ACCESSORIES'];
const VALID_TYPES = ['CLASSIC', 'CASUAL', 'EXECUTIVE', 'SPORTY', 'SOCIAL'];
const VALID_SORTS = ['preco_asc', 'preco_desc', 'nome_asc', 'nome_desc', 'recente', 'mais_vendido'];
const ALLOWED_FIELDS = ['name', 'description', 'descriptionComplete', 'basePrice', 'promotionalPrice', 'category', 'typeBelt', 'characteristics', 'imageUrl', 'images', 'inPromotion', 'bestSelling', 'new', 'stock', 'active'];

const validateQueryParams = (query: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const queryKeys = Object.keys(query);
  const invalidKeys = queryKeys.filter((key) => !ALLOWED_KEYS.includes(key));

  if (invalidKeys.length > 0) {
    errors.push(`Parâmetros desconhecidos: ${invalidKeys.join(', ')}.`);
  }

  for (const field of BOOLEAN_FIELDS) {
    if (query[field] !== undefined && query[field] !== null && query[field] !== '') {
      const value = String(query[field]).toLowerCase().trim();
      if (value !== 'true' && value !== 'false') {
        errors.push(`'${field}' deve ser 'true' ou 'false', recebeu '${query[field]}'.`);
      }
    }
  }

  if (query.categoria) {
    const value = String(query.categoria).toUpperCase().trim();
    if (!VALID_CATEGORIES.includes(value)) {
      errors.push(`'categoria' deve ser: ${VALID_CATEGORIES.join(', ')}, recebeu '${query.categoria}'.`);
    }
  }

  if (query.typeBelt) {
    const value = String(query.typeBelt).toUpperCase().trim();
    if (!VALID_TYPES.includes(value)) {
      errors.push(`'typeBelt' deve ser: ${VALID_TYPES.join(', ')}, recebeu '${query.typeBelt}'.`);
    }
  }

  if (query.precoMin) {
    const value = parseFloat(String(query.precoMin));
    if (isNaN(value) || value < 0) {
      errors.push(`'precoMin' deve ser número >= 0, recebeu '${query.precoMin}'.`);
    }
  }

  if (query.precoMax) {
    const value = parseFloat(String(query.precoMax));
    if (isNaN(value) || value < 0) {
      errors.push(`'precoMax' deve ser número >= 0, recebeu '${query.precoMax}'.`);
    }
  }

  // Valida se precoMin nao é maior que precoMax
  if (query.precoMin && query.precoMax) {
    const min = parseFloat(String(query.precoMin));
    const max = parseFloat(String(query.precoMax));
    if (!isNaN(min) && !isNaN(max) && min > max) {
      errors.push(`'precoMin' não pode ser maior que 'precoMax'.`);
    }
  }

  if (query.sort) {
    const value = String(query.sort).toLowerCase().trim();
    if (!VALID_SORTS.includes(value)) {
      errors.push(`'sort' deve ser: ${VALID_SORTS.join(', ')}, recebeu '${query.sort}'.`);
    }
  }

  if (query.page) {
    const value = parseInt(String(query.page), 10);
    if (isNaN(value) || value < 1) {
      errors.push(`'page' deve ser número > 0, recebeu '${query.page}'.`);
    }
  }

  if (query.limit) {
    const value = parseInt(String(query.limit), 10);
    if (isNaN(value) || value < 1 || value > 100) {
      errors.push(`'limit' deve ser número entre 1 e 100, recebeu '${query.limit}'.`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

const checkIsAdmin = async (req: Request): Promise<boolean> => {
  const userId = (req as any).userId;
  if (!userId) return false;
  const user = await findUserById(userId);
  return user?.role === UserRole.ADMIN;
};

const handlePrismaError = (error: any, res: Response): boolean => {
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'campo';
    res.status(400).json({ message: `Já existe um produto com esse ${field}` });
    return true;
  }
  if (error.code === 'P2025') {
    res.status(404).json({ message: 'Produto não encontrado' });
    return true;
  }
  return false;
};

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const validation = validateQueryParams(req.query);
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Parâmetros de query inválidos.', errors: validation.errors });
    }

    const filters = {
      categoria: req.query.categoria,
      typeBelt: req.query.typeBelt,
      inPromotion: req.query.inPromotion,
      bestSelling: req.query.bestSelling,
      new: req.query.new,
      precoMin: req.query.precoMin,
      precoMax: req.query.precoMax,
      busca: req.query.busca,
      active: req.query.active,
    };

    const response = await getProductsService(filters, { page: req.query.page, limit: req.query.limit }, { sort: req.query.sort }, await checkIsAdmin(req));
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID do produto é obrigatório' });

    const response = await getProductByIdService(id, await checkIsAdmin(req));
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

export const createProductController = async (req: Request, res: Response) => {
  try {
    const { name, basePrice, category } = req.body;
    if (!name || !basePrice || !category) {
      return res.status(400).json({ message: 'Nome, preço base e categoria são obrigatórios' });
    }

    const response = await createProductService(req.body);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    if (handlePrismaError(error, res)) return;
    return res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID do produto é obrigatório' });

    const hasValidField = ALLOWED_FIELDS.some((field) => req.body[field] !== undefined);
    if (!hasValidField) {
      return res.status(400).json({ message: 'Nenhum campo válido foi fornecido para atualização' });
    }

    const response = await updateProductService(id, req.body);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    if (handlePrismaError(error, res)) return;
    return res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID do produto é obrigatório' });

    const response = await deleteProductService(id);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    if (handlePrismaError(error, res)) return;
    return res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
  }
};
