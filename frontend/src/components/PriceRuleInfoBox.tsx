import { FaInfoCircle } from 'react-icons/fa';

const PriceRuleInfoBox = () => {
  return (
    <div className="bg-slate/10 border border-slate/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2">
        <FaInfoCircle className="text-blue-600 mt-0.5" />
        <div className="text-sm text-slate/80">
          <p className="font-semibold text-dark mb-1">Como funciona:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Configure regras de preço baseadas em quantidade (ex: 1-999 unidades = R$ 2,30 | 1000+ = R$ 1,90)</li>
            <li>O sistema aplicará automaticamente a regra correta quando o cliente escolher a quantidade no carrinho</li>
            <li>O preço unitário será calculado e multiplicado pela quantidade escolhida</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PriceRuleInfoBox;

