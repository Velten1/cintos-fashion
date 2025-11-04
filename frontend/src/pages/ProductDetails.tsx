import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import { getProductById, getProducts } from '../services/productServices';
import { getCurrentUser } from '../services/authServices';
import { converterProdutoBackendParaFrontend, formatarPreco } from '../utils';
import type { Produto } from '../types';
import EditProductModal from '../components/EditProductModal';
import ProductImages from '../components/ProductImages';
import ProductCharacteristics from '../components/ProductCharacteristics';
import RelatedProducts from '../components/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [imagemSelecionada, setImagemSelecionada] = useState(0);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data.status === 200 && response.data.data) {
          setIsAdmin(response.data.data.role === 'ADMIN');
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getProductById(id);

        if (response.data.status === 200 && response.data.data) {
          const produtoConvertido = converterProdutoBackendParaFrontend(response.data.data);
          setProduto(produtoConvertido);

          const categoriaBackend = produtoConvertido.categoria === 'cintos' ? 'BELTS' :
                                   produtoConvertido.categoria === 'fivelas' ? 'BUCKLE' : 'ACCESSORIES';

          const relacionadosResponse = await getProducts({
            categoria: categoriaBackend,
            active: 'true',
            limit: '5',
          });

          if (relacionadosResponse.data.status === 200 && relacionadosResponse.data.data?.products) {
            const relacionados = relacionadosResponse.data.data.products
              .map((p: any) => converterProdutoBackendParaFrontend(p))
              .filter((p: Produto) => p.id !== produtoConvertido.id)
              .slice(0, 4);
            setProdutosRelacionados(relacionados);
          }
        } else {
          setError('Produto não encontrado');
        }
      } catch (err: any) {
        console.error('Erro ao buscar produto:', err);
        setError(err.response?.data?.message || 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto mb-4"></div>
          <p className="text-slate/70 text-lg">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Produto não encontrado</h2>
          <p className="text-slate/70 mb-6">{error || 'O produto que você está procurando não existe.'}</p>
          <Link
            to="/catalogo"
            className="px-6 py-3 bg-dark/10 backdrop-blur-sm border border-dark/20 rounded-xl text-dark font-semibold hover:bg-dark/20 transition-all duration-300"
          >
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const imagens = produto.imagens && produto.imagens.length > 0 ? produto.imagens : [produto.imagem];

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate/70">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-dark transition-colors">Início</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-dark transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-dark">{produto.nome}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <ProductImages
            imagens={imagens}
            imagemSelecionada={imagemSelecionada}
            onSelectImage={setImagemSelecionada}
            produtoNome={produto.nome}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {produto.emPromocao && (
                    <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      PROMOÇÃO
                    </span>
                  )}
                  {produto.maisVendido && (
                    <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      MAIS VENDIDO
                    </span>
                  )}
                  {produto.novo && (
                    <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      NOVO
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 bg-blue/20 hover:bg-blue/30 rounded-lg text-dark transition-colors"
                    title="Editar produto"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-3">{produto.nome}</h1>
              <p className="text-slate/70 text-lg leading-relaxed">{produto.descricao}</p>
            </div>

            {/* Price */}
            <div className="p-6 bg-white/70 backdrop-blur-md rounded-xl border border-blue/40">
              <div className="flex items-baseline gap-4">
                {produto.precoOriginal && produto.emPromocao ? (
                  <>
                    <span className="text-3xl font-bold text-dark">{formatarPreco(produto.preco)}</span>
                    <span className="text-lg text-slate/60 line-through">
                      {formatarPreco(produto.precoOriginal)}
                    </span>
                    <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-lg text-sm font-semibold">
                      {Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-dark">{formatarPreco(produto.preco)}</span>
                )}
              </div>
              {produto.estoque > 0 ? (
                <p className="text-green-600 text-sm mt-2 font-medium flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Em estoque ({produto.estoque} disponíveis)
                </p>
              ) : (
                <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                  <FaTimesCircle className="text-red-600" />
                  Fora de estoque
                </p>
              )}
            </div>

            {/* Description */}
            {produto.descricaoCompleta && (
              <div className="p-6 bg-white/70 backdrop-blur-md rounded-xl border border-blue/40">
                <h3 className="text-dark font-semibold text-lg mb-3">Descrição</h3>
                <p className="text-slate/70 leading-relaxed">{produto.descricaoCompleta}</p>
              </div>
            )}

            {/* Características */}
            <ProductCharacteristics produto={produto} />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={produto.estoque === 0}
                className="flex-1 px-6 py-4 bg-dark text-light rounded-xl font-semibold hover:bg-slate transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {produto.estoque > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </button>
              <button className="px-6 py-4 bg-white/70 backdrop-blur-md border border-blue/40 text-dark rounded-xl font-semibold hover:bg-blue/30 transition-all duration-300">
                Favoritar
              </button>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <RelatedProducts produtos={produtosRelacionados} />
      </div>

      {/* Modal de Edição */}
      {produto && (
        <EditProductModal
          produto={produto}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onProductUpdated={(updatedProduto) => {
            setProduto(updatedProduto);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;
