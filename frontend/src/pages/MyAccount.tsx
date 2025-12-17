import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingBag,
  FaUser,
  FaMapMarkerAlt,
  FaHeadset,
  FaStar,
  FaHeart,
} from 'react-icons/fa';

const MinhaConta = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'pedidos',
      label: 'Meus Pedidos',
      icon: FaShoppingBag,
      description: 'Veja históricos e acompanhe seus pedidos.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'dados',
      label: 'Meus Dados',
      icon: FaUser,
      description: 'Altere e gerencie suas informações.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'endereco',
      label: 'Endereço',
      icon: FaMapMarkerAlt,
      description: 'Gerencie, edite ou adicione novos endereços de entrega.',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'atendimento',
      label: 'Atendimento',
      icon: FaHeadset,
      description: 'Aqui você pode entrar em contato com o suporte.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'avaliacoes',
      label: 'Avaliações',
      icon: FaStar,
      description: 'Avalie suas compras e visualize suas avaliações e comentários.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'favoritos',
      label: 'Favoritos',
      icon: FaHeart,
      description: 'Consulte sua lista de produtos favoritados.',
      color: 'from-red-500 to-red-600',
    },
  ];

  const handleMenuItemClick = (id: string) => {
    const routes: Record<string, string> = {
      pedidos: '/minha-conta/pedidos',
      dados: '/perfil',
      endereco: '/minha-conta/enderecos',
      atendimento: '/minha-conta/atendimento',
      avaliacoes: '/minha-conta/avaliacoes',
      favoritos: '/minha-conta/favoritos',
    };

    const route = routes[id];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Minha Conta</h1>
          <p className="text-slate/70 text-lg">Gerencie sua conta e preferências</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className="group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-6 text-left hover:scale-105"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-dark transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-slate/70 text-sm">{item.description}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-6 h-6 text-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Placeholder para conteúdo da seção selecionada */}
        {selectedSection && (
          <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6">
            <p className="text-slate/70">
              Seção <strong>{menuItems.find((item) => item.id === selectedSection)?.label}</strong>{' '}
              em desenvolvimento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhaConta;

