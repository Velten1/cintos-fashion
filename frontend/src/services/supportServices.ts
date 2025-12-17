import api from '../api/api';

// Interface para criar mensagem de suporte
export interface CreateSupportMessageData {
  subject: string;
  message: string;
}

// Interface para atualizar status da mensagem
export interface UpdateMessageStatusData {
  status: string;
}

// Interface da mensagem de suporte retornada pela API
export interface SupportMessage {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
}

// Interface da resposta da API
export interface SupportMessageResponse {
  status: number;
  message: string;
  data?: SupportMessage | SupportMessage[];
}

// Cria uma nova mensagem de suporte (usuário autenticado)
export const sendSupportMessage = async (data: CreateSupportMessageData) => {
  return await api.post<SupportMessageResponse>('/support', data);
};

// Busca todas as mensagens de suporte (admin only)
export const getAllSupportMessages = async () => {
  return await api.get<SupportMessageResponse>('/support');
};

// Busca uma mensagem de suporte por ID (admin only)
export const getSupportMessageById = async (id: string) => {
  return await api.get<SupportMessageResponse>(`/support/${id}`);
};

// Atualiza o status de uma mensagem de suporte (admin only)
export const updateMessageStatus = async (messageId: string, status: string) => {
  return await api.put<SupportMessageResponse>(`/support/${messageId}`, { status });
};

// Deleta uma mensagem de suporte (admin only)
export const deleteMessage = async (messageId: string) => {
  return await api.delete<SupportMessageResponse>(`/support/${messageId}`);
};

