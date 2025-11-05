import express from 'express';
import {
  getAllAddressesController,
  getAddressByIdController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from '../controllers/addressController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Todas as rotas de endereços requerem autenticação
router.use(authMiddleware);

// GET /api/addresses - Lista todos os endereços do usuário autenticado
router.get('/', getAllAddressesController);

// GET /api/addresses/:id - Busca um endereço específico
router.get('/:id', getAddressByIdController);

// POST /api/addresses - Cria um novo endereço
router.post('/', createAddressController);

// PUT /api/addresses/:id - Atualiza um endereço existente
router.put('/:id', updateAddressController);

// DELETE /api/addresses/:id - Deleta um endereço
router.delete('/:id', deleteAddressController);

// PATCH /api/addresses/:id/default - Define um endereço como padrão
router.patch('/:id/default', setDefaultAddressController);

export default router;

