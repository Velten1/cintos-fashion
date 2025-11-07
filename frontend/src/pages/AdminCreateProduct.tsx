import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productServices';
import type { CreateProductData } from '../services/productServices';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import ProductFormBasic from '../components/ProductFormBasic';
import ProductFormCharacteristics from '../components/ProductFormCharacteristics';
import ProductFormImages from '../components/ProductFormImages';
import ProductFormFlags from '../components/ProductFormFlags';

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    descriptionComplete: '',
    basePrice: '',
    promotionalPrice: '',
    category: 'BELTS' as 'BELTS' | 'BUCKLE' | 'ACCESSORIES',
    typeBelt: '',
    characteristics: {
      largura: '',
      comprimento: '',
      material: '',
      acabamento: '',
      fivela: {
        tipo: '',
        formato: '',
        dimensoes: '',
      },
      cor: '',
      resistenteAgua: false,
      forro: '',
      garantia: '',
    },
    imageUrl: '',
    images: [] as string[],
    inPromotion: false,
    bestSelling: false,
    new: false,
    stock: '',
    active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('characteristics.')) {
      const field = name.replace('characteristics.', '');
      if (field.startsWith('fivela.')) {
        const fivelaField = field.replace('fivela.', '');
        setFormData({
          ...formData,
          characteristics: {
            ...formData.characteristics,
            fivela: {
              ...formData.characteristics.fivela,
              [fivelaField]: value,
            },
          },
        });
      } else {
        setFormData({
          ...formData,
          characteristics: {
            ...formData.characteristics,
            [field]: type === 'checkbox' ? checked : value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.name.trim().length < 3) {
      setError('Nome do produto deve ter no mínimo 3 caracteres');
      return;
    }

    const basePrice = parseFloat(formData.basePrice);
    if (!basePrice || basePrice <= 0) {
      setError('Preço base deve ser maior que zero');
      return;
    }

    const promotionalPrice = formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : undefined;
    if (promotionalPrice && promotionalPrice >= basePrice) {
      setError('Preço promocional deve ser menor que o preço base');
      return;
    }

    const productData: CreateProductData = {
      name: formData.name.trim(),
      basePrice,
      category: formData.category,
    };

    if (formData.description?.trim()) {
      productData.description = formData.description.trim();
    }

    if (formData.descriptionComplete?.trim()) {
      productData.descriptionComplete = formData.descriptionComplete.trim();
    }

    if (promotionalPrice && promotionalPrice > 0) {
      productData.promotionalPrice = promotionalPrice;
    }

    if (formData.typeBelt) {
      productData.typeBelt = formData.typeBelt as any;
    }

    // Características
    if (
      formData.characteristics.largura ||
      formData.characteristics.comprimento ||
      formData.characteristics.material ||
      formData.characteristics.acabamento ||
      formData.characteristics.fivela.tipo ||
      formData.characteristics.cor
    ) {
      productData.characteristics = {
        largura: formData.characteristics.largura || '',
        comprimento: formData.characteristics.comprimento || '',
        material: formData.characteristics.material || '',
        acabamento: formData.characteristics.acabamento || '',
        fivela: {
          tipo: formData.characteristics.fivela.tipo || '',
          formato: formData.characteristics.fivela.formato || '',
          dimensoes: formData.characteristics.fivela.dimensoes || '',
        },
        cor: formData.characteristics.cor || '',
        resistenteAgua: formData.characteristics.resistenteAgua,
        forro: formData.characteristics.forro || undefined,
        garantia: formData.characteristics.garantia || undefined,
      };
    }

    if (formData.imageUrl?.trim()) {
      productData.imageUrl = formData.imageUrl.trim();
    }

    if (formData.images.length > 0) {
      productData.images = formData.images;
    }

    if (formData.inPromotion) {
      productData.inPromotion = true;
    }

    if (formData.bestSelling) {
      productData.bestSelling = true;
    }

    if (formData.new) {
      productData.new = true;
    }

    if (formData.stock) {
      productData.stock = parseInt(formData.stock);
    }

    setLoading(true);
    try {
      const response = await createProduct(productData);
      if (response.data.status === 201) {
        const product = response.data.data;
        const productId = product?.id;
        if (productId) {
          // Perguntar se quer criar regras de preço agora
          const criarRegras = window.confirm(
            'Produto criado com sucesso!\n\nDeseja configurar regras de preço agora?\n\n' +
            'Clique em "OK" para ir direto para a página de regras de preço.\n' +
            'Clique em "Cancelar" para ir ao catálogo (você pode criar regras depois pelo menu "Regras de Preço").'
          );
          
          if (criarRegras) {
            navigate(`/admin/produtos/${productId}/price-rules`);
          } else {
            navigate('/catalogo');
          }
        } else {
          setError('Produto criado, mas não foi possível obter o ID. Navegando para o catálogo...');
          setTimeout(() => navigate('/catalogo'), 2000);
        }
      } else {
        setError(response.data.message || 'Erro ao criar produto');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/catalogo')}
            className="flex items-center gap-2 text-dark hover:text-slate transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </button>
          <h1 className="text-3xl font-bold text-dark">Cadastrar Novo Produto</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-2xl border border-blue/40 p-8 space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Informações Básicas */}
          <ProductFormBasic formData={formData} onChange={handleChange} />

          {/* Características */}
          <ProductFormCharacteristics characteristics={formData.characteristics} onChange={handleChange} />

          {/* Imagens */}
          <ProductFormImages
            imageUrl={formData.imageUrl}
            images={formData.images}
            newImageUrl={newImageUrl}
            onImageUrlChange={handleChange}
            onNewImageUrlChange={setNewImageUrl}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
          />

          {/* Estoque e Flags */}
          <ProductFormFlags formData={formData} onChange={handleChange} />

          {/* Botões */}
          <div className="flex gap-4 pt-4 border-t border-blue/20">
            <button
              type="button"
              onClick={() => navigate('/catalogo')}
              className="flex-1 px-6 py-3 bg-slate/20 text-dark rounded-lg font-semibold hover:bg-slate/30 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-dark text-light rounded-lg font-semibold hover:bg-slate transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Salvar Produto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
