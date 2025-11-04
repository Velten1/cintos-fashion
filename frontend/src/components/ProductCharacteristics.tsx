import type { Produto } from '../types';

interface ProductCharacteristicsProps {
  produto: Produto;
}

const ProductCharacteristics = ({ produto }: ProductCharacteristicsProps) => {
  const formatLabel = (label: string): string => {
    return label
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
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
        {produto.caracteristicas.largura && (
          <div>
            <span className="text-slate/60 text-sm">Largura</span>
            <p className="text-dark font-medium">{produto.caracteristicas.largura}</p>
          </div>
        )}
        {produto.caracteristicas.comprimento && (
          <div>
            <span className="text-slate/60 text-sm">Comprimento</span>
            <p className="text-dark font-medium">{produto.caracteristicas.comprimento}</p>
          </div>
        )}
        {produto.caracteristicas.garantia && (
          <div>
            <span className="text-slate/60 text-sm">Garantia</span>
            <p className="text-dark font-medium">{produto.caracteristicas.garantia}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCharacteristics;

