import { FaCheck, FaTimes } from 'react-icons/fa';
import type { CreateAddressData, UpdateAddressData } from '../services/addressServices';

interface AddressFormProps {
  formData: CreateAddressData;
  formErrors: Record<string, string>;
  submitting: boolean;
  isEditing: boolean;
  estados: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddressForm = ({
  formData,
  formErrors,
  submitting,
  isEditing,
  estados,
  onChange,
  onSubmit,
  onCancel,
}: AddressFormProps) => {
  return (
    <div className="mb-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">
          {isEditing ? 'Editar Endereço' : 'Novo Endereço'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-blue/20 rounded-lg transition-colors"
        >
          <FaTimes className="text-slate" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Endereço */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark mb-2">
            Nome do Endereço <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Ex: Casa, Trabalho"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        {/* Rua */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark mb-2">
            Rua <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={onChange}
            placeholder="Nome da rua"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.street
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.street && (
            <p className="mt-1 text-sm text-red-600">{formErrors.street}</p>
          )}
        </div>

        {/* Número e Complemento */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Número <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={onChange}
            placeholder="123"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.number
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.number && (
            <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Complemento</label>
          <input
            type="text"
            name="complement"
            value={formData.complement || ''}
            onChange={onChange}
            placeholder="Apto, Bloco, etc."
            className="w-full px-4 py-2 border border-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50"
          />
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Bairro <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={onChange}
            placeholder="Nome do bairro"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.neighborhood
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.neighborhood && (
            <p className="mt-1 text-sm text-red-600">{formErrors.neighborhood}</p>
          )}
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Cidade <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="Nome da cidade"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.city
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.city && (
            <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
          )}
        </div>

        {/* Estado e CEP */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Estado (UF) <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.state
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          >
            <option value="">Selecione</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {formErrors.state && (
            <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            CEP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={onChange}
            placeholder="00000000"
            maxLength={8}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.zipCode
                ? 'border-red-500 focus:ring-red-500'
                : 'border-blue/30 focus:ring-blue/50'
            }`}
          />
          {formErrors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
          )}
        </div>

        {/* Checkbox padrão */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={onChange}
              className="w-4 h-4 text-dark border-blue/30 rounded focus:ring-blue/50"
            />
            <span className="text-sm text-slate/70">
              Definir como endereço padrão
            </span>
          </label>
        </div>
      </div>

      {/* Botões do formulário */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 bg-dark text-light rounded-lg hover:bg-slate transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCheck />
          <span>{submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}</span>
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 bg-slate/20 text-slate rounded-lg hover:bg-slate/30 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AddressForm;

