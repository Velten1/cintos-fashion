import { FaCheck, FaTimes } from 'react-icons/fa';
import type { CreatePriceRuleData } from '../services/priceRuleServices';

interface PriceRuleFormProps {
  formData: CreatePriceRuleData;
  formErrors: Record<string, string>;
  submitting: boolean;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PriceRuleForm = ({
  formData,
  formErrors,
  submitting,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: PriceRuleFormProps) => {
  return (
    <div className="mb-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">
          {isEditing ? 'Editar Regra de Preço' : 'Nova Regra de Preço'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-blue/20 rounded-lg transition-colors"
        >
          <FaTimes className="text-slate" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantidade Mínima */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Quantidade Mínima <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="minQuantity"
            value={formData.minQuantity || ''}
            onChange={onChange}
            min="1"
            placeholder="Ex: 1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.minQuantity
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.minQuantity && (
            <p className="mt-1 text-sm text-red-600">{formErrors.minQuantity}</p>
          )}
        </div>

        {/* Quantidade Máxima */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Quantidade Máxima (opcional)
          </label>
          <input
            type="number"
            name="maxQuantity"
            value={formData.maxQuantity ?? ''}
            onChange={onChange}
            min="1"
            placeholder="Deixe vazio para sem limite"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.maxQuantity
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.maxQuantity && (
            <p className="mt-1 text-sm text-red-600">{formErrors.maxQuantity}</p>
          )}
        </div>

        {/* Tipo de Tecido */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Tipo de Tecido (opcional)
          </label>
          <input
            type="text"
            name="fabricType"
            value={formData.fabricType || ''}
            onChange={onChange}
            placeholder="Ex: Couro, Algodão"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.fabricType
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.fabricType && (
            <p className="mt-1 text-sm text-red-600">{formErrors.fabricType}</p>
          )}
        </div>

        {/* Preço */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Preço Unitário (R$) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={onChange}
            min="0.01"
            step="0.01"
            placeholder="Ex: 2.30"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.price
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.price && (
            <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
          )}
        </div>

        {/* Ativo */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active !== undefined ? formData.active : true}
              onChange={(e) => {
                const syntheticEvent = {
                  target: { name: 'active', value: String(e.target.checked), type: 'checkbox' },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }}
              className="w-5 h-5 text-blue border-blue/30 rounded focus:ring-blue/50"
            />
            <span className="text-sm font-medium text-dark">Regra ativa</span>
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-dark text-light px-6 py-3 rounded-lg font-semibold hover:bg-slate transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-light">⏳</span>
              <span className="text-light">Salvando...</span>
            </>
          ) : (
            <>
              <FaCheck className="text-light" />
              <span className="text-light">{isEditing ? 'Atualizar Regra' : 'Criar Regra'}</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 bg-slate/20 text-dark border border-slate/30 rounded-lg font-semibold hover:bg-slate/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PriceRuleForm;

