import express from 'express';
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from '../controllers/productController';
import authMiddleware from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

router.get('/', getProductsController);
router.get('/:id', getProductByIdController);

// Rotas protegidas - so admin pode acessar
// POST /api/products - cria um novo produto
router.post('/', authMiddleware, adminMiddleware, createProductController);

// PUT /api/products/:id - atualiza um produto existente
router.put('/:id', authMiddleware, adminMiddleware, updateProductController);

// DELETE /api/products/:id - deleta um produto (soft delete)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProductController);

export default router;
