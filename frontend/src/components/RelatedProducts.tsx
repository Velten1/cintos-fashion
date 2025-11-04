import { Link } from 'react-router-dom';
import { formatarPreco } from '../utils';
import type { Produto } from '../types';

interface RelatedProductsProps {
  produtos: Produto[];
}

const RelatedProducts = ({ produtos }: RelatedProductsProps) => {
  if (produtos.length === 0) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.dataset.fallback === 'true') {
      target.style.display = 'none';
      return;
    }
    target.dataset.fallback = 'true';
    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23D8E1E8' width='400' height='400'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-dark mb-8">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {produtos.map((p) => (
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
                onError={handleImageError}
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
  );
};

export default RelatedProducts;

