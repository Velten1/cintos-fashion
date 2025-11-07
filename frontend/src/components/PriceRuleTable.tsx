import type { PriceRule } from '../services/priceRuleServices';

interface PriceRuleTableProps {
  priceRules: PriceRule[];
  onEdit: (rule: PriceRule) => void;
  onDelete: (id: string) => void;
}

const PriceRuleTable = ({ priceRules, onEdit, onDelete }: PriceRuleTableProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-blue/40 shadow-md overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue/10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Quantidade</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Preço Unitário</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Tipo de Tecido</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-dark">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-dark">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue/20">
            {priceRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-blue/5 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-dark">
                    {rule.minQuantity} {rule.maxQuantity ? `- ${rule.maxQuantity}` : 'ou mais'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-lg font-bold text-blue-600">
                    R$ {Number(rule.price).toFixed(2).replace('.', ',')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate/70">
                    {rule.fabricType || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {rule.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Ativa
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      Inativa
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(rule)}
                      className="p-2 text-blue-600 hover:bg-blue/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceRuleTable;

