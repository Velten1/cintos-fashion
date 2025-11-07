import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import {
  getAllPriceRulesByProduct,
  createPriceRule,
  updatePriceRule,
  deletePriceRule,
  type PriceRule,
  type CreatePriceRuleData,
} from '../services/priceRuleServices';
import PriceRuleForm from './PriceRuleForm';

interface PriceRulesModalProps {
  isOpen: boolean;
  productId: string;
  productName?: string;
  onClose: () => void;
}

const PriceRulesModal = ({ isOpen, productId, productName, onClose }: PriceRulesModalProps) => {
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPriceRule, setEditingPriceRule] = useState<PriceRule | null>(null);
  const [formData, setFormData] = useState<CreatePriceRuleData>({
    productId: productId,
    fabricType: null,
    minQuantity: 1,
    maxQuantity: null,
    price: 0,
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      loadPriceRules();
    }
  }, [isOpen, productId]);

  const loadPriceRules = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getAllPriceRulesByProduct(productId);
      if (response.data.status === 200) {
        setPriceRules(response.data.data || []);
      } else {
        setError(response.data.message || 'Erro ao carregar regras de preço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar regras de preço');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: productId,
      fabricType: null,
      minQuantity: 1,
      maxQuantity: null,
      price: 0,
      active: true,
    });
    setFormErrors({});
    setEditingPriceRule(null);
    setShowForm(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.minQuantity || formData.minQuantity < 1) {
      errors.minQuantity = 'Quantidade mínima deve ser maior ou igual a 1';
    }

    if (formData.maxQuantity !== null && formData.maxQuantity !== undefined) {
      const maxQty = Number(formData.maxQuantity);
      if (maxQty < 1) {
        errors.maxQuantity = 'Quantidade máxima deve ser maior ou igual a 1';
      } else if (maxQty <= formData.minQuantity) {
        errors.maxQuantity = 'Quantidade máxima deve ser maior que a quantidade mínima';
      }
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Preço deve ser maior que zero';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'maxQuantity') {
      if (value === '') {
        setFormData((prev) => ({
          ...prev,
          [name]: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: Number(value),
        }));
      }
    } else if (name === 'fabricType' && value === '') {
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? (name === 'price' ? 0 : 0) : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const dataToSubmit = {
        ...formData,
        productId: productId,
        maxQuantity: formData.maxQuantity ?? null,
        fabricType: formData.fabricType ?? null,
      };

      if (editingPriceRule) {
        const response = await updatePriceRule(editingPriceRule.id, dataToSubmit);
        if (response.data.status === 200) {
          loadPriceRules();
          resetForm();
        } else {
          setError(response.data.message || 'Erro ao atualizar regra de preço');
        }
      } else {
        const response = await createPriceRule(dataToSubmit);
        if (response.data.status === 201) {
          loadPriceRules();
          resetForm();
        } else {
          setError(response.data.message || 'Erro ao criar regra de preço');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar regra de preço');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rule: PriceRule) => {
    setEditingPriceRule(rule);
    setFormData({
      productId: rule.productId,
      fabricType: rule.fabricType,
      minQuantity: rule.minQuantity,
      maxQuantity: rule.maxQuantity,
      price: rule.price,
      active: rule.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta regra de preço?')) {
      return;
    }
    try {
      setError(null);
      const response = await deletePriceRule(id);
      if (response.data.status === 200) {
        loadPriceRules();
      } else {
        setError(response.data.message || 'Erro ao deletar regra de preço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar regra de preço');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue/20 bg-gradient-to-r from-blue/10 to-white">
          <div>
            <h2 className="text-2xl font-bold text-dark">Regras de Preço</h2>
            {productName && (
              <p className="text-sm text-slate mt-1">Produto: {productName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-blue/20 rounded-lg transition-colors"
          >
            <FaTimes className="text-slate text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue/5 via-white to-blue/5">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {showForm ? (
            <PriceRuleForm
              formData={formData}
              formErrors={formErrors}
              submitting={submitting}
              isEditing={!!editingPriceRule}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          ) : (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-dark text-light px-6 py-3 rounded-lg font-semibold hover:bg-slate transition-colors shadow-md"
              >
                <FaPlus className="text-light" />
                <span className="text-light">Nova Regra de Preço</span>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue text-3xl" />
            </div>
          ) : priceRules.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-xl p-8 border-2 border-dashed border-blue/30">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-dark mb-2">Nenhuma regra de preço cadastrada</h3>
                <p className="text-slate/70 mb-6">
                  Este produto ainda não possui regras de preço configuradas. Clique no botão acima para criar a primeira regra.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {priceRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white/70 backdrop-blur-xl rounded-xl border border-blue/40 shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-dark">
                          {rule.minQuantity} {rule.maxQuantity ? `- ${rule.maxQuantity}` : '+'} unidades
                        </h3>
                        {rule.active ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Ativa
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            Inativa
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-blue">
                        R$ {Number(rule.price).toFixed(2).replace('.', ',')}
                      </p>
                      {rule.fabricType && (
                        <p className="text-sm text-slate mt-1">Tecido: {rule.fabricType}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(rule)}
                        className="p-2 text-blue hover:bg-blue/20 rounded-lg transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue/20 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate/70">
              {priceRules.length === 0 
                ? 'Você pode criar regras de preço agora ou depois através do menu "Regras de Preço" na navbar.'
                : `${priceRules.length} regra(s) de preço cadastrada(s) para este produto.`
              }
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-slate/20 text-dark rounded-lg font-semibold hover:bg-slate/30 transition-colors"
              >
                <span className="text-dark">Pular por enquanto</span>
              </button>
              {priceRules.length > 0 && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-dark text-light rounded-lg font-semibold hover:bg-slate transition-colors shadow-md"
                >
                  <span className="text-light">Concluir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRulesModal;

