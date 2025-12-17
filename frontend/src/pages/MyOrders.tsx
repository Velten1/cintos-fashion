import { useState, useEffect } from 'react';
import { FaShoppingBag, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'received' | 'production' | 'on_the_way' | 'delivered';
  total: number;
  items: number;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar pedidos da API
    setTimeout(() => {
      setOrders([]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      received: { label: 'Recebido', color: 'blue', icon: FaBox },
      production: { label: 'Em Produção', color: 'yellow', icon: FaShoppingBag },
      on_the_way: { label: 'A Caminho', color: 'purple', icon: FaTruck },
      delivered: { label: 'Entregue', color: 'green', icon: FaCheckCircle },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Meus Pedidos</h1>
          <p className="text-slate/70 text-lg">Acompanhe o status dos seus pedidos</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-12 text-center">
            <FaShoppingBag className="text-6xl text-slate/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark mb-2">Nenhum pedido encontrado</h3>
            <p className="text-slate/70 mb-6">Você ainda não fez nenhum pedido.</p>
            <a
              href="/catalogo"
              className="inline-block bg-gradient-to-r from-blue to-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Começar a Comprar
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark">Pedido #{order.orderNumber}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold bg-${statusConfig.color}-100 text-${statusConfig.color}-700 flex items-center gap-2`}
                        >
                          <StatusIcon className="text-sm" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-slate/70 mb-1">Data: {order.date}</p>
                      <p className="text-slate/70">{order.items} {order.items === 1 ? 'item' : 'itens'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate/70 mb-1">Total</p>
                        <p className="text-2xl font-bold text-dark">
                          R$ {order.total.toFixed(2)}
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue to-dark text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

