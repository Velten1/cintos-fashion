import { useState, useEffect } from 'react';
import { FaCalculator } from 'react-icons/fa';
import type { PriceRule } from '../services/priceRuleServices';

interface PriceRuleCalculatorProps {
  priceRules: PriceRule[];
  basePrice: number;
}

const PriceRuleCalculator = ({ priceRules, basePrice }: PriceRuleCalculatorProps) => {
  const [testQuantity, setTestQuantity] = useState<string>('');
  const [testResult, setTestResult] = useState<{ unitPrice: number; total: number } | null>(null);

  const calculateTestPrice = () => {
    if (!testQuantity) {
      setTestResult(null);
      return;
    }

    const qty = parseInt(testQuantity);
    if (isNaN(qty) || qty <= 0) {
      setTestResult(null);
      return;
    }

    // Encontrar regra aplicável
    const sortedRules = [...priceRules].sort((a, b) => b.minQuantity - a.minQuantity);
    let unitPrice = basePrice;

    for (const rule of sortedRules) {
      if (!rule.active) continue;
      if (qty >= rule.minQuantity) {
        if (rule.maxQuantity === null || rule.maxQuantity === undefined || qty <= rule.maxQuantity) {
          unitPrice = Number(rule.price);
          break;
        }
      }
    }

    setTestResult({
      unitPrice,
      total: unitPrice * qty,
    });
  };

  useEffect(() => {
    calculateTestPrice();
  }, [testQuantity, priceRules, basePrice]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FaCalculator className="text-blue-600" />
        <h3 className="font-semibold text-dark">Teste de Preço</h3>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-dark mb-1">
            Quantidade para testar:
          </label>
          <input
            type="number"
            value={testQuantity}
            onChange={(e) => setTestQuantity(e.target.value)}
            min="1"
            placeholder="Ex: 500"
            className="w-full px-3 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50"
          />
        </div>
        {testResult && (
          <div className="text-right">
            <p className="text-sm text-slate/70">Preço Unitário:</p>
            <p className="text-lg font-bold text-blue-600">
              R$ {testResult.unitPrice.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-slate/70">Total ({testQuantity} unidades):</p>
            <p className="text-xl font-bold text-dark">
              R$ {testResult.total.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceRuleCalculator;

