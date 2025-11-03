import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSignOutAlt, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { getCurrentUser, logout, editUser } from '../services/authServices';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para edição
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data.status === 200 && response.data.data) {
          setUser(response.data.data);
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        setError('Erro ao carregar dados do usuário');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Continuar mesmo se der erro
    }
    navigate('/login');
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setEditError(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
    setEditError(null);
  };

  const handleSave = async (field: string) => {
    setEditLoading(true);
    setEditError(null);

    try {
      const updateData: any = {};
      updateData[field] = editValue;

      const response = await editUser(updateData);

      if (response.data.status === 200 && response.data.data) {
        // Atualizar estado do usuário com os novos dados
        setUser(response.data.data);
        setEditingField(null);
        setEditValue('');
      } else {
        setEditError(response.data.message || 'Erro ao atualizar');
      }
    } catch (error: any) {
      setEditError(error.response?.data?.message || 'Erro ao atualizar dados');
    } finally {
      setEditLoading(false);
    }
  };

  const formatDisplayValue = (field: string, value: string) => {
    if (!value) return '';
    
    switch (field) {
      case 'cpfCnpj':
        return value.length === 11
          ? value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          : value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      case 'phone':
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      default:
        return value;
    }
  };

  const formatInputValue = (value: string) => {
    // Remove formatação para input
    return value.replace(/\D/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate/70">Carregando...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Usuário não encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Meu Perfil</h1>
          <p className="text-slate/70 text-lg">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-blue/40 shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-dark via-slate to-dark text-light p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-light/20 backdrop-blur-sm flex items-center justify-center border-2 border-light/30">
                  <FaUser className="text-3xl text-light" />
                </div>
                <div className="flex-1">
                  {editingField === 'name' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-light/20 border border-light/30 rounded-lg px-3 py-1 text-light placeholder-light/60 focus:outline-none focus:ring-2 focus:ring-light/50"
                        placeholder="Nome completo"
                        disabled={editLoading}
                      />
                      <button
                        onClick={() => handleSave('name')}
                        disabled={editLoading}
                        className="p-1.5 bg-green-500/80 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <FaCheck className="text-light text-sm" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={editLoading}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <FaTimes className="text-light text-sm" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <button
                        onClick={() => startEditing('name', user.name)}
                        className="p-1.5 hover:bg-light/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaPencilAlt className="text-light/80 text-sm" />
                      </button>
                    </div>
                  )}
                  <p className="text-light/80">
                    {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-light/20 hover:bg-light/30 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <FaSignOutAlt />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Informações */}
          <div className="p-8 space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border border-blue/20">
              <div className="p-3 bg-blue/10 rounded-lg">
                <FaEnvelope className="text-dark text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate/70 mb-1">Email</p>
                {editingField === 'email' ? (
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50 text-dark"
                      placeholder="seu@email.com"
                      disabled={editLoading}
                    />
                    {editError && <p className="text-sm text-red-600">{editError}</p>}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave('email')}
                        disabled={editLoading}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <FaCheck /> Salvar
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={editLoading}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-dark font-medium flex-1">{user.email}</p>
                    <button
                      onClick={() => startEditing('email', user.email)}
                      className="p-1.5 hover:bg-blue/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <FaPencilAlt className="text-blue text-sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CPF/CNPJ */}
            {user.cpfCnpj && (
              <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border border-blue/20">
                <div className="p-3 bg-blue/10 rounded-lg">
                  <FaIdCard className="text-dark text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate/70 mb-1">CPF/CNPJ</p>
                  {editingField === 'cpfCnpj' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50 text-dark"
                        placeholder="00000000000"
                        maxLength={14}
                        disabled={editLoading}
                      />
                      {editError && <p className="text-sm text-red-600">{editError}</p>}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave('cpfCnpj')}
                          disabled={editLoading}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <FaCheck /> Salvar
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={editLoading}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <FaTimes /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-dark font-medium flex-1">
                        {formatDisplayValue('cpfCnpj', user.cpfCnpj)}
                      </p>
                      <button
                        onClick={() => startEditing('cpfCnpj', formatInputValue(user.cpfCnpj))}
                        className="p-1.5 hover:bg-blue/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaPencilAlt className="text-blue text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Telefone */}
            {user.phone && (
              <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border border-blue/20">
                <div className="p-3 bg-blue/10 rounded-lg">
                  <FaPhone className="text-dark text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate/70 mb-1">Telefone</p>
                  {editingField === 'phone' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50 text-dark"
                        placeholder="11999999999"
                        maxLength={11}
                        disabled={editLoading}
                      />
                      {editError && <p className="text-sm text-red-600">{editError}</p>}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave('phone')}
                          disabled={editLoading}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <FaCheck /> Salvar
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={editLoading}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <FaTimes /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-dark font-medium flex-1">
                        {formatDisplayValue('phone', user.phone)}
                      </p>
                      <button
                        onClick={() => startEditing('phone', formatInputValue(user.phone))}
                        className="p-1.5 hover:bg-blue/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaPencilAlt className="text-blue text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Role */}
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border border-blue/20">
              <div className="p-3 bg-blue/10 rounded-lg">
                <FaUser className="text-dark text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate/70 mb-1">Tipo de Conta</p>
                <p className="text-dark font-medium">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </p>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue/20">
              {user.createdAt && (
                <div>
                  <p className="text-sm text-slate/70 mb-1">Membro desde</p>
                  <p className="text-dark font-medium">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
              {user.updatedAt && (
                <div>
                  <p className="text-sm text-slate/70 mb-1">Última atualização</p>
                  <p className="text-dark font-medium">
                    {new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

