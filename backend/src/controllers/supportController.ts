import { Request, Response } from 'express';
import { createSupportMessageService, getAllMessagesService, getMessagesByIdService, updateMessageStatusService, deleteMessageService } from '../services/supportService';

export const createSupportMessageController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { subject, message } = req.body;
        const result = await createSupportMessageService(userId, subject, message);
        return res.status(result.status).json(result);
    } catch (error: any) {
        console.error('Erro ao criar mensagem de suporte:', error);
        return res.status(500).json({ message: 'Erro ao criar mensagem de suporte', error: error.message });
    }   
};

export const getAllMessagesController = async (req: Request, res: Response) => {
    try {
        const result = await getAllMessagesService();
        return res.status(result.status).json(result);
    } catch (error: any) {
        console.error('Erro ao recuperar mensagens de suporte:', error);
        return res.status(500).json({ message: 'Erro ao recuperar mensagens de suporte', error: error.message });
    }
};

export const getMessagesByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório' });
        }
        const result = await getMessagesByIdService(id);
        return res.status(result.status).json(result);
    } catch (error: any) {
        console.error('Erro ao recuperar mensagem de suporte:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Mensagem de suporte não encontrada' });
        }
        return res.status(500).json({ message: 'Erro ao recuperar mensagem de suporte', error: error.message });
    }
};

export const updateMessageStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório' });
        }
        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório' });
        }

        const result = await updateMessageStatusService(id, status);
        return res.status(result.status).json(result);
    } catch (error: any) {
        console.error('Erro ao atualizar status da mensagem de suporte:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Mensagem de suporte não encontrada' });
        }
        return res.status(500).json({ message: 'Erro ao atualizar status da mensagem de suporte', error: error.message });
    }
};

export const deleteMessageController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório' });
        }
        const result = await deleteMessageService(id);
        return res.status(result.status).json(result);
    } catch (error: any) {
        console.error('Erro ao deletar mensagem de suporte:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Mensagem de suporte não encontrada' });
        }
        return res.status(500).json({ message: 'Erro ao deletar mensagem de suporte', error: error.message });
    }
};