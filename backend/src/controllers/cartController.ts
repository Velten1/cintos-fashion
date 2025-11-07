import { Request, Response } from 'express';
import {
  getCartService,
  addItemToCartService,
  updateItemQuantityService,
  removeItemService,
  clearCartService,
  getCartTotalService,
} from '../services/cartService';

/**
 * GET /api/cart - Busca o carrinho do usuário
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const response = await getCartService(userId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao buscar carrinho.', error: errorMessage });
  }
};

/**
 * POST /api/cart/items - Adiciona um item ao carrinho
 */
export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const { productId, quantity, fabricType, characteristics } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'ID do produto é obrigatório.' });
    }

    if (!quantity) {
      return res.status(400).json({ message: 'Quantidade é obrigatória.' });
    }

    const response = await addItemToCartService(userId, productId, quantity, fabricType, characteristics);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao adicionar item ao carrinho.', error: errorMessage });
  }
};

/**
 * PUT /api/cart/items/:itemId - Atualiza a quantidade de um item no carrinho
 */
export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ message: 'ID do item é obrigatório.' });
    }

    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: 'Quantidade é obrigatória.' });
    }

    const response = await updateItemQuantityService(userId, itemId, quantity);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao atualizar item do carrinho.', error: errorMessage });
  }
};

/**
 * DELETE /api/cart/items/:itemId - Remove um item do carrinho
 */
export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ message: 'ID do item é obrigatório.' });
    }

    const response = await removeItemService(userId, itemId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao remover item do carrinho.', error: errorMessage });
  }
};

/**
 * DELETE /api/cart/clear - Limpa todos os items do carrinho
 */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const response = await clearCartService(userId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao limpar carrinho.', error: errorMessage });
  }
};

/**
 * GET /api/cart/total - Calcula o total do carrinho
 */
export const getTotal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const response = await getCartTotalService(userId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error('Erro ao calcular total do carrinho:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({ message: 'Erro ao calcular total do carrinho.', error: errorMessage });
  }
};

