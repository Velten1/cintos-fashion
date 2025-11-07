import { useState } from 'react';
import type { PriceRule, CreatePriceRuleData } from '../services/priceRuleServices';

interface UsePriceRuleFormReturn {
  formData: CreatePriceRuleData;
  formErrors: Record<string, string>;
  submitting: boolean;
  editingPriceRule: PriceRule | null;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  setEditingPriceRule: (rule: PriceRule | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validateForm: () => boolean;
  resetForm: (productId: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<CreatePriceRuleData>>;
  setSubmitting: (submitting: boolean) => void;
}

export const usePriceRuleForm = (productId: string | undefined): UsePriceRuleFormReturn => {
  const [formData, setFormData] = useState<CreatePriceRuleData>({
    productId: productId || '',
    fabricType: null,
    minQuantity: 1,
    maxQuantity: null,
    price: 0,
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [editingPriceRule, setEditingPriceRule] = useState<PriceRule | null>(null);
  const [showForm, setShowForm] = useState(false);

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
        [name]: value === '' ? 0 : Number(value),
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

  const resetForm = (productId: string) => {
    setFormData({
      productId: productId || '',
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

  return {
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
  };
};

