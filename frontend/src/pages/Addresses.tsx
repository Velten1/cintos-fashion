import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type CreateAddressData,
  type UpdateAddressData,
} from '../services/addressServices';
import AddressForm from '../components/AddressForm';
import AddressList from '../components/AddressList';
import EmptyAddresses from '../components/EmptyAddresses';

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    name: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  // Carregar endereços
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAddresses();
      if (response.data.status === 200) {
        setAddresses(response.data.data || []);
      } else {
        setError(response.data.message || 'Erro ao carregar endereços');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    });
    setFormErrors({});
    setEditingAddress(null);
    setShowForm(false);
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Nome do endereço é obrigatório';
    if (!formData.street.trim()) errors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) errors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) errors.city = 'Cidade é obrigatória';
    if (!formData.state) errors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{8}$/.test(formData.zipCode.replace(/\D/g, ''))) {
      errors.zipCode = 'CEP deve conter 8 dígitos';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers;
    }
    return numbers.slice(0, 8);
  };

  // Handler de mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'zipCode') {
      setFormData({ ...formData, [name]: formatCEP(value) });
    } else if (name === 'isDefault') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Criar endereço
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await createAddress(formData);
      if (response.data.status === 201) {
        await loadAddresses();
        resetForm();
      } else {
        setError(response.data.message || 'Erro ao criar endereço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar endereço');
      if (err.response?.data?.errors) {
        const errors: Record<string, string> = {};
        err.response.data.errors.forEach((error: string) => {
          const fieldMatch = error.match(/^(.*?)(?: é| deve| inválido)/i);
          if (fieldMatch) {
            const field = fieldMatch[1].toLowerCase().replace(/\s/g, '');
            errors[field] = error;
          }
        });
        setFormErrors(errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Editar endereço
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setShowForm(true);
    setFormErrors({});
  };

  // Atualizar endereço
  const handleUpdate = async () => {
    if (!editingAddress || !validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      const updateData: UpdateAddressData = { ...formData };
      const response = await updateAddress(editingAddress.id, updateData);
      if (response.data.status === 200) {
        await loadAddresses();
        resetForm();
      } else {
        setError(response.data.message || 'Erro ao atualizar endereço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar endereço');
      if (err.response?.data?.errors) {
        const errors: Record<string, string> = {};
        err.response.data.errors.forEach((error: string) => {
          const fieldMatch = error.match(/^(.*?)(?: é| deve| inválido)/i);
          if (fieldMatch) {
            const field = fieldMatch[1].toLowerCase().replace(/\s/g, '');
            errors[field] = error;
          }
        });
        setFormErrors(errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Deletar endereço
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este endereço?')) return;

    try {
      setError(null);
      const response = await deleteAddress(id);
      if (response.data.status === 200) {
        await loadAddresses();
      } else {
        setError(response.data.message || 'Erro ao deletar endereço');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar endereço');
    }
  };

  // Definir como padrão
  const handleSetDefault = async (id: string) => {
    try {
      setError(null);
      const response = await setDefaultAddress(id);
      if (response.data.status === 200) {
        await loadAddresses();
      } else {
        setError(response.data.message || 'Erro ao definir endereço padrão');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao definir endereço padrão');
    }
  };

  // Handler de submit do formulário
  const handleSubmit = () => {
    if (editingAddress) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate/70">Carregando endereços...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/minha-conta')}
            className="flex items-center gap-2 text-slate/70 hover:text-dark mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar para Minha Conta</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Endereços</h1>
              <p className="text-slate/70 text-lg">Gerencie seus endereços de entrega</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-dark text-light rounded-lg hover:bg-slate transition-colors"
              >
                <FaPlus />
                <span>Novo Endereço</span>
              </button>
            )}
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <AddressForm
            formData={formData}
            formErrors={formErrors}
            submitting={submitting}
            isEditing={!!editingAddress}
            estados={estados}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Lista de endereços */}
        {addresses.length === 0 && !showForm ? (
          <EmptyAddresses onAddClick={() => setShowForm(true)} />
        ) : (
          addresses.length > 0 && <AddressList
            addresses={addresses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        )}
      </div>
    </div>
  );
};

export default Addresses;
