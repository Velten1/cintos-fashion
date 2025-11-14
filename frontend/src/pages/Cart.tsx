import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { getCart, updateItemQuantity, removeItem, clearCart, getCartTotal, type Cart as CartType, type CartItem } from '../services/cartServices';
import { formatarPreco } from '../utils';
import { useToast } from '../contexts/ToastContext';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartType | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>({});
  const { showToast } = useToast();

  // Carregar carrinho e total
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cartResponse, totalResponse] = await Promise.all([
        getCart(),
        getCartTotal(),
      ]);

      if (cartResponse.data.status === 200 && cartResponse.data.data) {
        const cartData = cartResponse.data.data as CartType;
        setCart(cartData);
        // Inicializar inputs de quantidade
        const initialQuantities: Record<string, number> = {};
        cartData.items.forEach((item) => {
          initialQuantities[item.id] = item.quantity;
        });
        setQuantityInputs(initialQuantities);
      }

      if (totalResponse.data.status === 200 && totalResponse.data.data) {
        setTotal((totalResponse.data.data as { total: number }).total);
      }
    } catch (err: any) {
      console.error('Erro ao carregar carrinho:', err);
      setError(err.response?.data?.message || 'Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cart?.items.find((i) => i.id === itemId);
    if (!item) return;

    // Verificar se o produto é fabricado sob demanda (fivelas ou botões)
    const isMadeToOrder = item.product.category === 'BUCKLE' || item.product.category === 'ACCESSORIES';
    
    // Validar estoque apenas para produtos que não são fabricados sob demanda
    if (!isMadeToOrder && newQuantity > item.product.stock) {
      setError(`Quantidade máxima disponível: ${item.product.stock}`);
      // Restaurar valor anterior
      setQuantityInputs((prev) => ({ ...prev, [itemId]: item.quantity }));
      return;
    }

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      setError(null);
      const response = await updateItemQuantity(itemId, { quantity: newQuantity });

      if (response.data.status === 200) {
        await loadCart(); // Recarregar carrinho e total (isso vai recalcular o preço)
      } else {
        setError(response.data.message || 'Erro ao atualizar quantidade');
        // Restaurar valor anterior em caso de erro
        setQuantityInputs((prev) => ({ ...prev, [itemId]: item.quantity }));
      }
    } catch (err: any) {
      console.error('Erro ao atualizar quantidade:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar quantidade');
      // Restaurar valor anterior em caso de erro
      setQuantityInputs((prev) => ({ ...prev, [itemId]: item.quantity }));
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleQuantityInputChange = (itemId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantityInputs((prev) => ({ ...prev, [itemId]: numValue }));
  };

  const handleQuantityInputBlur = (itemId: string) => {
    const inputValue = quantityInputs[itemId];
    const item = cart?.items.find((i) => i.id === itemId);
    
    if (!item) return;

    // Verificar se o produto é fabricado sob demanda (fivelas ou botões)
    const isMadeToOrder = item.product.category === 'BUCKLE' || item.product.category === 'ACCESSORIES';

    // Se o valor mudou, atualizar
    if (inputValue !== undefined && inputValue !== item.quantity) {
      if (inputValue < 1) {
        // Restaurar valor mínimo
        setQuantityInputs((prev) => ({ ...prev, [itemId]: 1 }));
        handleUpdateQuantity(itemId, 1);
      } else if (!isMadeToOrder && inputValue > item.product.stock) {
        // Restaurar valor máximo apenas para produtos com estoque limitado
        setQuantityInputs((prev) => ({ ...prev, [itemId]: item.product.stock }));
        handleUpdateQuantity(itemId, item.product.stock);
      } else {
        handleUpdateQuantity(itemId, inputValue);
      }
    } else {
      // Restaurar valor original se não mudou
      setQuantityInputs((prev) => ({ ...prev, [itemId]: item.quantity }));
    }
  };

  const handleQuantityInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      const response = await removeItem(itemId);

      if (response.data.status === 200) {
        await loadCart();
        // Disparar evento para atualizar badge do carrinho
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        showToast('Item removido do carrinho', 'success');
      } else {
        setError(response.data.message || 'Erro ao remover item');
      }
    } catch (err: any) {
      console.error('Erro ao remover item:', err);
      setError(err.response?.data?.message || 'Erro ao remover item');
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleClearCart = async () => {
    try {
      setClearing(true);
      const response = await clearCart();

      if (response.data.status === 200) {
        setCart(null);
        setTotal(0);
        // Disparar evento para atualizar badge do carrinho
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        showToast('Carrinho limpo com sucesso', 'success');
      } else {
        setError(response.data.message || 'Erro ao limpar carrinho');
      }
    } catch (err: any) {
      console.error('Erro ao limpar carrinho:', err);
      setError(err.response?.data?.message || 'Erro ao limpar carrinho');
    } finally {
      setClearing(false);
    }
  };

  const handleContinue = () => {
    // Salvar total no localStorage para usar no checkout/Stripe
    localStorage.setItem('cartTotal', total.toString());
    navigate('/minha-conta/enderecos');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-blue/5 to-light py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto"></div>
            <p className="mt-4 text-slate">Carregando carrinho...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-blue/5 to-light py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadCart}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-blue/5 to-light py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-dark mb-8">Carrinho de Compras</h1>
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-blue/40 p-12 text-center">
            <FaShoppingCart className="text-6xl text-slate/30 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-dark mb-2">Seu carrinho está vazio</h2>
            <p className="text-slate/70 mb-6">Adicione produtos ao carrinho para continuar</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="px-6 py-3 bg-dark text-light rounded-xl font-semibold hover:bg-slate transition-all duration-300"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-blue/5 to-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8">Carrinho de Compras</h1>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Informação sobre o fluxo do pano */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Como funciona?</h3>
            <p className="text-blue-800 text-sm">
              Após finalizar o pedido, você receberá instruções para enviar o tecido/pano que será utilizado na confecção do seu produto. 
              Nossa equipe utilizará o material enviado por você para criar um produto personalizado e único.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => {
              const isUpdating = updatingItems.has(item.id);
              const productImage = item.product.imageUrl || item.product.images?.[0] || '';

              return (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-md rounded-xl border border-blue/40 p-6"
                >
                  <div className="flex gap-4">
                    {/* Imagem do Produto */}
                    <div className="w-24 h-24 flex-shrink-0">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate/20 rounded-lg flex items-center justify-center">
                          <FaShoppingCart className="text-slate/40 text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Informações do Produto */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark mb-1">{item.product.name}</h3>
                      <p className="text-sm text-slate/70 mb-2 line-clamp-2">{item.product.description}</p>
                      <div className="mb-3">
                        <p className="text-lg font-bold text-dark">
                          {formatarPreco(Number(item.unitPrice))} cada
                        </p>
                        {isUpdating && (
                          <p className="text-xs text-blue-600 mt-1">Recalculando preço...</p>
                        )}
                      </div>

                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-blue/30 rounded-lg">
                          <button
                            onClick={() => {
                              const newQty = (quantityInputs[item.id] ?? item.quantity) - 1;
                              setQuantityInputs((prev) => ({ ...prev, [item.id]: newQty }));
                              handleUpdateQuantity(item.id, newQty);
                            }}
                            disabled={isUpdating || (quantityInputs[item.id] ?? item.quantity) <= 1}
                            className="p-2 text-dark hover:bg-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.product.category === 'BUCKLE' || item.product.category === 'ACCESSORIES' ? 999999 : item.product.stock}
                            value={quantityInputs[item.id] ?? item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputBlur(item.id)}
                            onKeyPress={handleQuantityInputKeyPress}
                            disabled={isUpdating}
                            className="w-20 px-2 py-2 font-semibold text-dark text-center border-x border-blue/30 focus:outline-none focus:ring-2 focus:ring-dark disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button
                            onClick={() => {
                              const newQty = (quantityInputs[item.id] ?? item.quantity) + 1;
                              setQuantityInputs((prev) => ({ ...prev, [item.id]: newQty }));
                              handleUpdateQuantity(item.id, newQty);
                            }}
                            disabled={isUpdating || ((item.product.category !== 'BUCKLE' && item.product.category !== 'ACCESSORIES') && (quantityInputs[item.id] ?? item.quantity) >= item.product.stock)}
                            className="p-2 text-dark hover:bg-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Remover item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-slate/70 mb-1">Subtotal</p>
                      <p className="text-xl font-bold text-dark">
                        {formatarPreco(Number(item.subtotal))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Botão Limpar Carrinho */}
            <div className="flex justify-end">
              <button
                onClick={handleClearCart}
                disabled={clearing}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {clearing ? 'Limpando...' : 'Limpar Carrinho'}
              </button>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-blue/40 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate/70">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                  <span>{formatarPreco(total)}</span>
                </div>
                <div className="border-t border-blue/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-dark">Total</span>
                    <span className="text-2xl font-bold text-dark">{formatarPreco(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full px-6 py-4 bg-dark text-light rounded-xl font-semibold hover:bg-slate transition-all duration-300 mb-4"
              >
                Continuar para Endereço
              </button>

              <button
                onClick={() => navigate('/catalogo')}
                className="w-full px-6 py-3 bg-white/70 border border-blue/40 text-dark rounded-xl font-semibold hover:bg-blue/30 transition-all duration-300"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

