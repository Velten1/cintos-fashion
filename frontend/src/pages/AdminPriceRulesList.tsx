import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDollarSign, FaSpinner, FaEdit, FaPlus } from 'react-icons/fa';
import { getProducts } from '../services/productServices';
import { getAllPriceRulesByProduct } from '../services/priceRuleServices';
import { converterProdutoBackendParaFrontend } from '../utils';
import type { Produto } from '../types';

interface ProdutoComRegras extends Produto {
  quantidadeRegras: number;
}

const AdminPriceRulesList = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<ProdutoComRegras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({
        active: 'true',
      });

      if (response.data.status === 200 && response.data.data?.products) {
        const produtosConvertidos = response.data.data.products.map((p: any) =>
          converterProdutoBackendParaFrontend(p)
        );

        // Verificar quantas regras cada produto tem (em paralelo para melhor performance)
        const produtosComRegras = await Promise.all(
          produtosConvertidos.map(async (produto: Produto) => {
            try {
              const rulesResponse = await getAllPriceRulesByProduct(produto.id);
              const quantidadeRegras = rulesResponse.data.status === 200 && rulesResponse.data.data?.length 
                ? rulesResponse.data.data.length 
                : 0;
              return { ...produto, quantidadeRegras };
            } catch (err) {
              return { ...produto, quantidadeRegras: 0 };
            }
          })
        );

        setProdutos(produtosComRegras);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            className="flex items-center gap-2 text-dark hover:text-slate transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">Regras de Preço</h1>
              <p className="text-slate/70">
                Configure preços por quantidade para cada produto. O sistema calculará automaticamente o preço unitário baseado na quantidade escolhida no carrinho.
              </p>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-blue text-3xl" />
            <span className="ml-3 text-slate/70">Carregando produtos...</span>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate/70 text-lg">
              {searchTerm ? 'Nenhum produto encontrado com esse termo.' : 'Nenhum produto cadastrado.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => {
              const temRegras = produto.quantidadeRegras > 0;
              return (
                <div
                  key={produto.id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-dark">{produto.nome}</h3>
                        {temRegras ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            {produto.quantidadeRegras} regra{produto.quantidadeRegras > 1 ? 's' : ''} configurada{produto.quantidadeRegras > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Sem regras
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate/70 line-clamp-2 mb-2">{produto.descricao}</p>
                      {temRegras && (
                        <p className="text-xs text-slate/60 italic">
                          Preço base: R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                    {produto.imagem && (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-blue/20">
                    <div className="text-sm text-slate/70">
                      <p className="font-medium text-dark">Categoria: {produto.categoria}</p>
                      <p>Estoque: {produto.estoque} unidades</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {temRegras ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/produtos/${produto.id}/price-rules`)}
                          className="flex items-center gap-2 px-4 py-2 bg-dark text-light rounded-lg font-semibold hover:bg-slate transition-colors shadow-md"
                          title="Editar Regras de Preço"
                        >
                          <FaEdit className="text-light" />
                          <span className="text-light">Editar Regras</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/produtos/${produto.id}/price-rules`)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                          title="Criar Regras de Preço"
                        >
                          <FaPlus className="text-white" />
                          <span className="text-white">Criar Regra</span>
                        </button>
                      )}
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

export default AdminPriceRulesList;

