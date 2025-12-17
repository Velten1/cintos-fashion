import { createSupportMessage, deleteSupportMessage, getAllSupportMessages, getSupportMessageById, getSupportMessagesByUserId, updateSupportMessageStatus } from '../repository/supportRepository';

const validateUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

export const createSupportMessageService = async (userId: string, subject: string, message: string) => {
    if (!subject || !message) {
        return {status: 400, message: 'Assunto e mensagem são obrigatórios'};
    }
    const newMessage = await createSupportMessage(userId, subject, message);
    return {status: 201, message: 'Mensagem de suporte criada com sucesso', data: newMessage};
};

export const getAllMessagesService = async () => {
    const messages = await getAllSupportMessages();
    return {status: 200, data: messages};
};

export const getMessagesByIdService = async (id: string) => {
    if (!validateUUID(id)) {
        return {status: 400, message: 'ID inválido'};
    }
    const messages = await getSupportMessageById(id);
   if (!messages) {
    return {status: 404, message: 'Mensagem de suporte não encontrada'};
   }
   return {status: 200, data: messages};    
};

export const updateMessageStatusService = async (id: string, status: string) => {
    if (!validateUUID(id)) {
        return {status: 400, message: 'ID inválido'};
    }
    
    if (!status || typeof status !== 'string') {
        return {status: 400, message: 'Status é obrigatório'};
    }

    // Verifica se a mensagem existe antes de atualizar
    const existingMessage = await getSupportMessageById(id);
    if (!existingMessage) {
        return {status: 404, message: 'Mensagem de suporte não encontrada'};
    }

    const updatedMessage = await updateSupportMessageStatus(id, status);
    return {status: 200, message: 'Status da mensagem de suporte atualizado com sucesso', data: updatedMessage};
};

export const deleteMessageService = async (id: string) => {
    if (!validateUUID(id)) {
        return {status: 400, message: 'ID inválido'};
    }

    // Verifica se a mensagem existe antes de deletar
    const existingMessage = await getSupportMessageById(id);
    if (!existingMessage) {
        return {status: 404, message: 'Mensagem de suporte não encontrada'};
    }

    const deletedMessage = await deleteSupportMessage(id);
    return {status: 200, message: 'Mensagem de suporte deletada com sucesso', data: deletedMessage};
};