import { FaPlus } from 'react-icons/fa';

interface PriceRuleEmptyStateProps {
  onCreateNew: () => void;
}

const PriceRuleEmptyState = ({ onCreateNew }: PriceRuleEmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white/50 rounded-xl p-8 border-2 border-dashed border-blue/30">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-bold text-dark mb-2">Nenhuma regra de preço cadastrada</h3>
        <p className="text-slate/70 mb-6">
          Este produto ainda não possui regras de preço configuradas.
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg mx-auto"
        >
          <FaPlus className="text-white" />
          <span className="text-white">Criar Primeira Regra de Preço</span>
        </button>
      </div>
    </div>
  );
};

export default PriceRuleEmptyState;

