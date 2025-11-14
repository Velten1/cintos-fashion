/**
 * EXEMPLO VISUAL - Como ficaria o Toast + Badge Animado
 * 
 * Este arquivo é apenas para demonstração visual.
 * Não é usado no código real, apenas para você ver como ficaria.
 */

import { useState } from 'react';
import Toast from './Toast';

/**
 * EXEMPLO DE USO:
 * 
 * 1. Toast aparece no canto superior direito
 * 2. Badge no carrinho faz animação de "pulso" (scale + bounce)
 * 3. Toast fecha automaticamente em 4 segundos
 * 4. Usuário pode clicar em "Ver carrinho" ou fechar manualmente
 */
const ToastExample = () => {
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    // Simula adicionar ao carrinho
    setShowToast(true);
    
    // Aqui você atualizaria o badge do carrinho também
    // setCartItemsCount(prev => prev + 1);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Exemplo Visual do Toast</h2>
      
      <button
        onClick={handleAddToCart}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Adicionar ao Carrinho (Teste)
      </button>

      {/* Toast de exemplo */}
      <Toast
        message="Item adicionado ao carrinho!"
        type="success"
        show={showToast}
        onClose={() => setShowToast(false)}
        actionButton={{
          label: "Ver carrinho",
          onClick: () => {
            console.log('Navegar para carrinho');
            setShowToast(false);
          }
        }}
        autoClose={4000}
      />

      {/* 
        VISUALIZAÇÃO DO BADGE ANIMADO:
        
        No Navbar, o badge do carrinho ficaria assim:
        
        <Link to="/carrinho" className="relative">
          <FaShoppingCart className="text-xl" />
          {cartItemsCount > 0 && (
            <span className={`
              absolute -top-1 -right-1 
              bg-red-600 text-white 
              text-xs font-bold rounded-full 
              w-5 h-5 flex items-center justify-center
              ${justAddedToCart ? 'animate-pulse scale-125' : ''}
            `}>
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </span>
          )}
        </Link>
        
        Quando item é adicionado:
        - Badge faz animação de "pulso" (scale + bounce)
        - Duração: ~500ms
        - Efeito: badge cresce e volta ao normal
      */}
    </div>
  );
};

export default ToastExample;

