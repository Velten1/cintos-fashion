import { FaPlus } from 'react-icons/fa';

interface PriceRuleHeaderProps {
  productName?: string;
  showForm: boolean;
  onCreateNew: () => void;
}

const PriceRuleHeader = ({ productName, showForm, onCreateNew }: PriceRuleHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold text-dark">Regras de Preço</h1>
        {productName && (
          <p className="text-slate/70 mt-1">
            Produto: <span className="font-semibold text-dark">{productName}</span>
          </p>
        )}
      </div>
      {!showForm && (
        <button
          type="button"
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
        >
          <FaPlus className="text-white" />
          <span className="text-white">Nova Regra</span>
        </button>
      )}
    </div>
  );
};

export default PriceRuleHeader;

