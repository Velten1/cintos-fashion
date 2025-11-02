import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { produtosMock, formatarPreco } from '../utils';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  const produto = produtosMock.find((p) => p.id === id);

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Produto não encontrado</h2>
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

  const imagens = produto.imagens || [produto.imagem];
  const formatLabel = (label: string): string => {
    return label
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const produtosRelacionados = produtosMock
    .filter((p) => p.id !== produto.id && p.categoria === produto.categoria)
    .slice(0, 4);

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
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-blue/20 to-blue/10 border border-blue/40">
              <img
                src={imagens[imagemSelecionada]}
                alt={produto.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Se já tentamos o fallback, escondemos a imagem para evitar loop infinito
                  if (target.src.includes('data:image') || target.dataset.fallback === 'true') {
                    target.style.display = 'none';
                    return;
                  }
                  // Primeira tentativa de fallback - usar SVG inline como data URL
                  target.dataset.fallback = 'true';
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect fill='%23D8E1E8' width='600' height='600'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>
            {imagens.length > 1 && (
              <div className="flex gap-4">
                {imagens.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemSelecionada(index)}
                    className={`flex-1 aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      imagemSelecionada === index
                        ? 'border-dark scale-105'
                        : 'border-blue/40 hover:border-dark/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${produto.nome} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.dataset.fallback === 'true') {
                          target.style.display = 'none';
                          return;
                        }
                        target.dataset.fallback = 'true';
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23D8E1E8' width='200' height='200'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
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
            <div className="p-6 bg-white/70 backdrop-blur-md rounded-xl border border-blue/40">
              <h3 className="text-dark font-semibold text-lg mb-4">Características</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate/60 text-sm">Categoria</span>
                  <p className="text-dark font-medium">{formatLabel(produto.categoria)}</p>
                </div>
                {produto.tipoCinto && (
                  <div>
                    <span className="text-slate/60 text-sm">Tipo</span>
                    <p className="text-dark font-medium">{formatLabel(produto.tipoCinto)}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate/60 text-sm">Material</span>
                  <p className="text-dark font-medium">{formatLabel(produto.caracteristicas.material)}</p>
                </div>
                <div>
                  <span className="text-slate/60 text-sm">Cor</span>
                  <p className="text-dark font-medium">{formatLabel(produto.caracteristicas.cor)}</p>
                </div>
                <div>
                  <span className="text-slate/60 text-sm">Acabamento</span>
                  <p className="text-dark font-medium">{formatLabel(produto.caracteristicas.acabamento)}</p>
                </div>
                <div>
                  <span className="text-slate/60 text-sm">Fivela</span>
                  <p className="text-dark font-medium">{formatLabel(produto.caracteristicas.fivela.tipo)}</p>
                </div>
                <div>
                  <span className="text-slate/60 text-sm">Largura</span>
                  <p className="text-dark font-medium">{produto.caracteristicas.largura}</p>
                </div>
                <div>
                  <span className="text-slate/60 text-sm">Comprimento</span>
                  <p className="text-dark font-medium">{produto.caracteristicas.comprimento}</p>
                </div>
                {produto.caracteristicas.garantia && (
                  <div>
                    <span className="text-slate/60 text-sm">Garantia</span>
                    <p className="text-dark font-medium">{produto.caracteristicas.garantia}</p>
                  </div>
                )}
              </div>
            </div>

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
        {produtosRelacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtosRelacionados.map((p) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  className="group bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-blue/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue/20 to-blue/10">
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.dataset.fallback === 'true') {
                          target.style.display = 'none';
                          return;
                        }
                        target.dataset.fallback = 'true';
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23D8E1E8' width='400' height='400'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-dark font-semibold mb-2 line-clamp-2">{p.nome}</h3>
                    <p className="text-lg font-bold text-dark">{formatarPreco(p.preco)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

