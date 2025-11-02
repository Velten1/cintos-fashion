import { Link } from 'react-router-dom';
import type { Produto } from '../types';
import { formatarPreco } from '../utils';

interface ProductCardProps {
  produto: Produto;
}

const ProductCard = ({ produto }: ProductCardProps) => {
  return (
    <Link
      to={`/produto/${produto.id}`}
      className="group relative bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-blue/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-dark/30"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
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

      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue/20 to-blue/10">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Se já tentamos o fallback, escondemos a imagem para evitar loop infinito
            if (target.src.includes('data:image') || target.dataset.fallback === 'true') {
              target.style.display = 'none';
              return;
            }
            // Primeira tentativa de fallback - usar SVG inline como data URL
            target.dataset.fallback = 'true';
            target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23D8E1E8' width='400' height='400'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-dark font-semibold text-lg mb-1 group-hover:text-slate transition-colors line-clamp-2">
            {produto.nome}
          </h3>
          <p className="text-slate/70 text-sm line-clamp-2">{produto.descricao}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {produto.precoOriginal && produto.emPromocao ? (
              <>
                <span className="text-lg font-bold text-dark">{formatarPreco(produto.preco)}</span>
                <span className="text-xs text-slate/60 line-through">{formatarPreco(produto.precoOriginal)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-dark">{formatarPreco(produto.preco)}</span>
            )}
          </div>
          <div className="px-3 py-1.5 bg-dark/10 backdrop-blur-sm rounded-lg text-xs text-dark font-medium">
            Ver detalhes
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

