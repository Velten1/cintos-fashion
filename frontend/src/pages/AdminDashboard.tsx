import { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaClock, FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import { AxiosError } from 'axios';
import { getAllSupportMessages, updateMessageStatus, deleteMessage } from '../services/supportServices';
import type { SupportMessage as APISupportMessage } from '../services/supportServices';

interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'closed'>('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await getAllSupportMessages();
      if (response.data?.data && Array.isArray(response.data.data)) {
        // Transforma os dados da API para o formato esperado pelo componente
        const transformedMessages: SupportMessage[] = response.data.data.map((msg: APISupportMessage) => {
          // Normaliza o status para lowercase
          const normalizedStatus = msg.status.toLowerCase() as 'pending' | 'answered' | 'closed';
          return {
            id: msg.id,
            userId: msg.userId,
            userName: msg.user.name,
            userEmail: msg.user.email,
            subject: msg.subject,
            message: msg.message,
            status: normalizedStatus,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
          };
        });
        setMessages(transformedMessages);
      } else {
        setMessages([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Erro ao carregar mensagens. Tente novamente.'
        : error instanceof Error 
        ? error.message 
        : 'Erro ao carregar mensagens. Tente novamente.';
      alert(errorMessage);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, newStatus: SupportMessage['status']) => {
    try {
      await updateMessageStatus(messageId, newStatus);
      // Atualiza a mensagem localmente
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
      // Atualiza também a mensagem selecionada se for a mesma
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      alert(`Status atualizado para: ${newStatus}`);
      // Recarrega as mensagens para garantir sincronização
      await loadMessages();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Erro ao atualizar status. Tente novamente.'
        : error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar status. Tente novamente.';
      alert(errorMessage);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await deleteMessage(messageId);
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        alert('Mensagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
        const errorMessage = error instanceof AxiosError 
          ? error.response?.data?.message || 'Erro ao deletar mensagem. Tente novamente.'
          : error instanceof Error 
          ? error.message 
          : 'Erro ao deletar mensagem. Tente novamente.';
        alert(errorMessage);
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusConfig = (status: SupportMessage['status']) => {
    const configs = {
      pending: { label: 'Pendente', color: 'yellow', icon: FaClock },
      answered: { label: 'Respondida', color: 'blue', icon: FaCheck },
      closed: { label: 'Fechada', color: 'gray', icon: FaTimes },
    };
    return configs[status];
  };

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    answered: messages.filter(m => m.status === 'answered').length,
    closed: messages.filter(m => m.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Painel Administrativo</h1>
          <p className="text-slate/70 text-lg">Gerencie mensagens de atendimento</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate/70 mb-1">Total</p>
                <p className="text-3xl font-bold text-dark">{stats.total}</p>
              </div>
              <FaEnvelope className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate/70 mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <FaClock className="text-4xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate/70 mb-1">Respondidas</p>
                <p className="text-3xl font-bold text-blue-600">{stats.answered}</p>
              </div>
              <FaCheck className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate/70 mb-1">Fechadas</p>
                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <FaTimes className="text-4xl text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue to-dark text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'answered'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Respondidas ({stats.answered})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'closed'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fechadas ({stats.closed})
            </button>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaEnvelope className="text-6xl text-slate/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-slate/70">
              {filter === 'all'
                ? 'Ainda não há mensagens de atendimento.'
                : `Não há mensagens com o status: ${filter}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List Column */}
            <div className="space-y-4">
              {filteredMessages.map((message) => {
                const statusConfig = getStatusConfig(message.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-2xl text-blue-500" />
                        <div>
                          <h3 className="font-bold text-dark">{message.userName}</h3>
                          <p className="text-sm text-slate/70">{message.userEmail}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}
                      >
                        <StatusIcon />
                        {statusConfig.label}
                      </span>
                    </div>

                    <h4 className="font-bold text-dark mb-2">{message.subject}</h4>
                    <p className="text-slate/70 text-sm line-clamp-2 mb-3">{message.message}</p>

                    <div className="flex items-center justify-between text-xs text-slate/70">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {new Date(message.createdAt).toLocaleString('pt-BR')}
                      </span>
                      <button className="text-blue-600 hover:underline flex items-center gap-1">
                        <FaEye />
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Detail Column */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {selectedMessage ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-dark">Detalhes da Mensagem</h2>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-slate/70 hover:text-dark"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FaUser className="text-3xl text-blue-500" />
                      <div>
                        <h3 className="font-bold text-dark">{selectedMessage.userName}</h3>
                        <p className="text-sm text-slate/70">{selectedMessage.userEmail}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate/70">
                      ID do usuário: {selectedMessage.userId}
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate/70 mb-2">
                      Assunto:
                    </label>
                    <p className="text-dark font-semibold">{selectedMessage.subject}</p>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate/70 mb-2">
                      Mensagem:
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-slate/80 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate/70 mb-2">
                      Status:
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'pending')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          selectedMessage.status === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Pendente
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'answered')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          selectedMessage.status === 'answered'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Respondida
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'closed')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          selectedMessage.status === 'closed'
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Fechada
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      Excluir Mensagem
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-slate/70 mb-1">
                      <strong>Criada em:</strong>{' '}
                      {new Date(selectedMessage.createdAt).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-slate/70">
                      <strong>Atualizada em:</strong>{' '}
                      {new Date(selectedMessage.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaEnvelope className="text-6xl text-slate/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-dark mb-2">
                    Selecione uma mensagem
                  </h3>
                  <p className="text-slate/70">
                    Clique em uma mensagem à esquerda para ver os detalhes
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;









