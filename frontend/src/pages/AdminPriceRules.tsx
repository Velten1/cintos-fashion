import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import PriceRuleForm from '../components/PriceRuleForm';
import PriceRuleCalculator from '../components/PriceRuleCalculator';
import PriceRuleInfoBox from '../components/PriceRuleInfoBox';
import PriceRuleTable from '../components/PriceRuleTable';
import PriceRulePreview from '../components/PriceRulePreview';
import PriceRuleHeader from '../components/PriceRuleHeader';
import PriceRuleEmptyState from '../components/PriceRuleEmptyState';
import { usePriceRules } from '../hooks/usePriceRules';
import { usePriceRuleForm } from '../hooks/usePriceRuleForm';

const AdminPriceRules = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const {
    priceRules,
    productName,
    basePrice,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = usePriceRules(productId);

  const {
    formData,
    formErrors,
    submitting,
    editingPriceRule,
    showForm,
    setShowForm,
    setEditingPriceRule,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setSubmitting,
  } = usePriceRuleForm(productId);

  const handleSubmit = async () => {
    if (!validateForm() || !productId) {
      return;
    }

    setSubmitting(true);

    const dataToSubmit = {
      ...formData,
      productId,
      maxQuantity: formData.maxQuantity ?? null,
      fabricType: formData.fabricType ?? null,
    };

    const success = editingPriceRule
      ? await handleUpdate(editingPriceRule.id, dataToSubmit)
      : await handleCreate(dataToSubmit);

    if (success) {
      resetForm(productId);
    }

    setSubmitting(false);
  };

  const handleEdit = (rule: any) => {
    setEditingPriceRule(rule);
    setFormData({
      productId: rule.productId,
      fabricType: rule.fabricType,
      minQuantity: rule.minQuantity,
      maxQuantity: rule.maxQuantity,
      price: Number(rule.price),
      active: rule.active,
    });
    setShowForm(true);
  };

  const handleDeleteRule = async (id: string) => {
    await handleDelete(id);
  };

  const handleCreateNew = () => {
    resetForm(productId || '');
    setShowForm(true);
  };

  if (!productId) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate text-lg">ID do produto não fornecido.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/10 via-white to-blue/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/regras-preco')}
            className="flex items-center gap-2 text-blue hover:text-blue/80 mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </button>

          <PriceRuleHeader
            productName={productName}
            showForm={showForm}
            onCreateNew={handleCreateNew}
          />

          {!showForm && priceRules.length > 0 && (
            <PriceRuleCalculator priceRules={priceRules} basePrice={basePrice} />
          )}

          <PriceRuleInfoBox />

          {!showForm && priceRules.length === 0 && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Nenhuma regra de preço cadastrada para este produto.</p>
              <p className="text-sm mt-1">Clique no botão "Nova Regra" acima para criar a primeira regra.</p>
            </div>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <PriceRuleForm
            formData={formData}
            formErrors={formErrors}
            submitting={submitting}
            isEditing={!!editingPriceRule}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => resetForm(productId || '')}
          />
        )}

        {/* Lista de regras */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue text-3xl" />
          </div>
        ) : priceRules.length === 0 ? (
          <PriceRuleEmptyState onCreateNew={handleCreateNew} />
        ) : (
          <>
            <PriceRuleTable
              priceRules={priceRules}
              onEdit={handleEdit}
              onDelete={handleDeleteRule}
            />
            <PriceRulePreview priceRules={priceRules} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPriceRules;

