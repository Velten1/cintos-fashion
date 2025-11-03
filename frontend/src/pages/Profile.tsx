import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSignOutAlt } from 'react-icons/fa';
import { getCurrentUser, logout } from '../services/authServices';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
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
                <p className="text-dark font-medium">{user.email}</p>
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
                  <p className="text-dark font-medium">
                    {user.cpfCnpj.length === 11
                      ? user.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      : user.cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                  </p>
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
                  <p className="text-dark font-medium">
                    {user.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                  </p>
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

