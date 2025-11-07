import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getTotal,
} from '../controllers/cartController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// GET /api/cart - Busca o carrinho do usuário
router.get('/', getCart);

// POST /api/cart/items - Adiciona um item ao carrinho
router.post('/items', addItem);

// PUT /api/cart/items/:itemId - Atualiza a quantidade de um item
router.put('/items/:itemId', updateItem);

// DELETE /api/cart/items/:itemId - Remove um item do carrinho
router.delete('/items/:itemId', removeItem);

// DELETE /api/cart/clear - Limpa todos os items do carrinho
router.delete('/clear', clearCart);

// GET /api/cart/total - Calcula o total do carrinho
router.get('/total', getTotal);

export default router;

