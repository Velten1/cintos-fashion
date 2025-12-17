import express from 'express';
import { createSupportMessageController, getAllMessagesController, getMessagesByIdController, updateMessageStatusController, deleteMessageController } from '../controllers/supportController';
import authMiddleware from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// rota para usuario normal criar mensagem de suporte
router.post('/', authMiddleware, createSupportMessageController);

// rota para admin listar todas as mensagens de suporte
router.get('/', authMiddleware, adminMiddleware, getAllMessagesController);

// rota para admin listar mensagem de suporte por id
router.get('/:id', authMiddleware, adminMiddleware, getMessagesByIdController);

// rota para admin atualizar status da mensagem de suporte
router.put('/:id', authMiddleware, adminMiddleware, updateMessageStatusController);

// rota para admin deletar mensagem de suporte
router.delete('/:id', authMiddleware, adminMiddleware, deleteMessageController);

export default router;