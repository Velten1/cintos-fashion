import type { PriceRule } from '../services/priceRuleServices';

interface PriceRulePreviewProps {
  priceRules: PriceRule[];
}

const PriceRulePreview = ({ priceRules }: PriceRulePreviewProps) => {
  const activeRules = priceRules
    .filter(r => r.active)
    .sort((a, b) => a.minQuantity - b.minQuantity);

  if (activeRules.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue/10 to-white rounded-xl border border-blue/40 p-6 mb-6">
      <h3 className="font-semibold text-dark mb-4">Preview das Regras de Preço</h3>
      <div className="space-y-2">
        {activeRules.map((rule, index, array) => (
          <div key={rule.id} className="flex items-center gap-3 text-sm">
            <span className="font-medium text-dark w-32">
              {rule.minQuantity} {rule.maxQuantity ? `- ${rule.maxQuantity}` : '+'} unid.:
            </span>
            <span className="font-bold text-blue-600">
              R$ {Number(rule.price).toFixed(2).replace('.', ',')}
            </span>
            {index < array.length - 1 && <span className="text-slate/50">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceRulePreview;

