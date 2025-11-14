import { useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaShoppingCart } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: number; // em milissegundos
}

/**
 * Componente Toast de exemplo para visualização
 * 
 * Como ficaria visualmente:
 * 
 * ┌─────────────────────────────────────────┐
 * │  ✓  Item adicionado ao carrinho!  [X] │
 * │      [Ver carrinho →]                   │
 * └─────────────────────────────────────────┘
 * 
 * Posição: canto superior direito
 * Animação: slide in da direita, fade out após 3-4s
 * Badge no carrinho: pulso/scale quando item é adicionado
 */
const Toast = ({ 
  message, 
  type = 'success', 
  show, 
  onClose, 
  actionButton,
  autoClose = 4000 
}: ToastProps) => {
  useEffect(() => {
    if (show && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: <FaCheckCircle className="text-white" />,
    error: <FaTimes className="text-white" />,
    info: <FaShoppingCart className="text-white" />
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        ${bgColor} 
        text-white 
        rounded-lg 
        shadow-2xl 
        p-4 
        min-w-[300px] 
        max-w-[400px]
        flex 
        items-start 
        gap-3
        backdrop-blur-sm
        relative
      `}>
        {/* Ícone */}
        <div className="flex-shrink-0 text-xl mt-0.5">
          {icon}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
          
          {/* Botão de ação (opcional) */}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
            >
              {actionButton.label}
              <FaShoppingCart className="text-xs" />
            </button>
          )}
        </div>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      {/* Barra de progresso (opcional, mostra tempo restante) */}
      {autoClose > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-white/60"
            style={{ 
              animation: `shrink ${autoClose}ms linear forwards`,
              transformOrigin: 'right',
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;

