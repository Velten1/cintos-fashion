import express from 'express';
import {
  getPriceRulesByProductController,
  getAllPriceRulesByProductController,
  getPriceRuleByIdController,
  createPriceRuleController,
  updatePriceRuleController,
  deletePriceRuleController,
} from '../controllers/priceRulesController';
import authMiddleware from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// IMPORTANTE: Rotas específicas devem vir ANTES das rotas genéricas
// GET /api/price-rules/product/:productId/all - Lista todas as regras (incluindo inativas) - MAIS ESPECÍFICA
router.get('/product/:productId/all', authMiddleware, adminMiddleware, getAllPriceRulesByProductController);

// GET /api/price-rules/product/:productId - Lista regras ativas de um produto
router.get('/product/:productId', authMiddleware, getPriceRulesByProductController);

// GET /api/price-rules/:id - Busca uma regra específica - DEVE VIR POR ÚLTIMO
router.get('/:id', authMiddleware, adminMiddleware, getPriceRuleByIdController);

// POST /api/price-rules - Cria uma nova regra de preço
router.post('/', authMiddleware, adminMiddleware, createPriceRuleController);

// PUT /api/price-rules/:id - Atualiza uma regra de preço
router.put('/:id', authMiddleware, adminMiddleware, updatePriceRuleController);

// DELETE /api/price-rules/:id - Deleta uma regra de preço
router.delete('/:id', authMiddleware, adminMiddleware, deletePriceRuleController);

export default router;

