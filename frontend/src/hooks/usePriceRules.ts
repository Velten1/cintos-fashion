import { useState, useEffect } from 'react';
import {
  getAllPriceRulesByProduct,
  createPriceRule,
  updatePriceRule,
  deletePriceRule,
  type PriceRule,
  type CreatePriceRuleData,
} from '../services/priceRuleServices';
import { getProductById } from '../services/productServices';
import { converterProdutoBackendParaFrontend } from '../utils';

interface UsePriceRulesReturn {
  priceRules: PriceRule[];
  productName: string;
  basePrice: number;
  loading: boolean;
  error: string | null;
  loadPriceRules: () => Promise<void>;
  handleCreate: (data: CreatePriceRuleData) => Promise<boolean>;
  handleUpdate: (id: string, data: CreatePriceRuleData) => Promise<boolean>;
  handleDelete: (id: string) => Promise<boolean>;
}

export const usePriceRules = (productId: string | undefined): UsePriceRulesReturn => {
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductInfo = async () => {
    if (!productId) return;

    try {
      const response = await getProductById(productId);
      if (response.data.status === 200 && response.data.data) {
        const produto = converterProdutoBackendParaFrontend(response.data.data);
        setProductName(produto.nome);
        setBasePrice(produto.preco);
      }
    } catch (err) {
      console.error('Erro ao carregar informações do produto:', err);
    }
  };

  const loadPriceRules = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getAllPriceRulesByProduct(productId);
      if (response.data.status === 200) {
        const rules = response.data.data || [];
        rules.sort((a: PriceRule, b: PriceRule) => a.minQuantity - b.minQuantity);
        setPriceRules(rules);
      } else {
        setError(response.data.message || 'Erro ao carregar regras de preço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar regras de preço');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreatePriceRuleData): Promise<boolean> => {
    try {
      setError(null);
      const response = await createPriceRule(data);
      if (response.data.status === 201) {
        await loadPriceRules();
        return true;
      } else {
        setError(response.data.message || 'Erro ao criar regra de preço');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar regra de preço');
      return false;
    }
  };

  const handleUpdate = async (id: string, data: CreatePriceRuleData): Promise<boolean> => {
    try {
      setError(null);
      const response = await updatePriceRule(id, data);
      if (response.data.status === 200) {
        await loadPriceRules();
        return true;
      } else {
        setError(response.data.message || 'Erro ao atualizar regra de preço');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar regra de preço');
      return false;
    }
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    if (!window.confirm('Tem certeza que deseja deletar esta regra de preço?')) {
      return false;
    }

    try {
      setError(null);
      const response = await deletePriceRule(id);
      if (response.data.status === 200) {
        await loadPriceRules();
        return true;
      } else {
        setError(response.data.message || 'Erro ao deletar regra de preço');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar regra de preço');
      return false;
    }
  };

  useEffect(() => {
    if (productId) {
      loadProductInfo();
      loadPriceRules();
    }
  }, [productId]);

  return {
    priceRules,
    productName,
    basePrice,
    loading,
    error,
    loadPriceRules,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

