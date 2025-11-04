import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productServices';
import type { CreateProductData } from '../services/productServices';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

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
        navigate('/catalogo');
      } else {
        setError(response.data.message || 'Erro ao criar produto');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-blue/20 to-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/60 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-dark" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Cadastrar Produto</h1>
            <p className="text-sm text-slate/70">Preencha os dados do produto</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-2xl p-6 lg:p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark mb-1.5">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Ex: Cinto Executivo em Couro"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark mb-1.5">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Descrição do produto"
            />
          </div>

          {/* Descrição Completa */}
          <div>
            <label htmlFor="descriptionComplete" className="block text-sm font-medium text-dark mb-1.5">
              Descrição Completa
            </label>
            <textarea
              id="descriptionComplete"
              name="descriptionComplete"
              value={formData.descriptionComplete}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Descrição detalhada do produto"
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-dark mb-1.5">
                Preço Base (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="promotionalPrice" className="block text-sm font-medium text-dark mb-1.5">
                Preço Promocional (R$)
              </label>
              <input
                type="number"
                id="promotionalPrice"
                name="promotionalPrice"
                value={formData.promotionalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categoria e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-dark mb-1.5">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              >
                <option value="BELTS">Cintos</option>
                <option value="BUCKLE">Fivelas</option>
                <option value="ACCESSORIES">Acessórios</option>
              </select>
            </div>

            <div>
              <label htmlFor="typeBelt" className="block text-sm font-medium text-dark mb-1.5">
                Tipo de Cinto
              </label>
              <select
                id="typeBelt"
                name="typeBelt"
                value={formData.typeBelt}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              >
                <option value="">Selecione...</option>
                <option value="CLASSIC">Clássico</option>
                <option value="CASUAL">Casual</option>
                <option value="EXECUTIVE">Executivo</option>
                <option value="SPORTY">Esportivo</option>
                <option value="SOCIAL">Social</option>
              </select>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-4 border-t border-blue/20 pt-4">
            <h3 className="text-lg font-semibold text-dark">Características</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="characteristics.largura" className="block text-sm font-medium text-dark mb-1.5">
                  Largura (cm)
                </label>
                <input
                  type="text"
                  id="characteristics.largura"
                  name="characteristics.largura"
                  value={formData.characteristics.largura}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: 3.5cm"
                />
              </div>

              <div>
                <label htmlFor="characteristics.comprimento" className="block text-sm font-medium text-dark mb-1.5">
                  Comprimento (cm)
                </label>
                <input
                  type="text"
                  id="characteristics.comprimento"
                  name="characteristics.comprimento"
                  value={formData.characteristics.comprimento}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: 100-120cm"
                />
              </div>

              <div>
                <label htmlFor="characteristics.material" className="block text-sm font-medium text-dark mb-1.5">
                  Material
                </label>
                <input
                  type="text"
                  id="characteristics.material"
                  name="characteristics.material"
                  value={formData.characteristics.material}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: couro-genuino"
                />
              </div>

              <div>
                <label htmlFor="characteristics.acabamento" className="block text-sm font-medium text-dark mb-1.5">
                  Acabamento
                </label>
                <input
                  type="text"
                  id="characteristics.acabamento"
                  name="characteristics.acabamento"
                  value={formData.characteristics.acabamento}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: fosco"
                />
              </div>

              <div>
                <label htmlFor="characteristics.cor" className="block text-sm font-medium text-dark mb-1.5">
                  Cor
                </label>
                <input
                  type="text"
                  id="characteristics.cor"
                  name="characteristics.cor"
                  value={formData.characteristics.cor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: preto"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="characteristics.resistenteAgua"
                  name="characteristics.resistenteAgua"
                  checked={formData.characteristics.resistenteAgua}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
                />
                <label htmlFor="characteristics.resistenteAgua" className="ml-2 text-sm text-dark">
                  Resistente à água
                </label>
              </div>

              <div>
                <label htmlFor="characteristics.forro" className="block text-sm font-medium text-dark mb-1.5">
                  Forro
                </label>
                <input
                  type="text"
                  id="characteristics.forro"
                  name="characteristics.forro"
                  value={formData.characteristics.forro}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: Tecido sintético"
                />
              </div>

              <div>
                <label htmlFor="characteristics.garantia" className="block text-sm font-medium text-dark mb-1.5">
                  Garantia
                </label>
                <input
                  type="text"
                  id="characteristics.garantia"
                  name="characteristics.garantia"
                  value={formData.characteristics.garantia}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="Ex: 1 ano"
                />
              </div>
            </div>

            {/* Fivela */}
            <div className="border-t border-blue/20 pt-4 mt-4">
              <h4 className="text-md font-medium text-dark mb-3">Fivela</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="characteristics.fivela.tipo" className="block text-sm font-medium text-dark mb-1.5">
                    Tipo
                  </label>
                  <input
                    type="text"
                    id="characteristics.fivela.tipo"
                    name="characteristics.fivela.tipo"
                    value={formData.characteristics.fivela.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                    placeholder="Ex: prateada"
                  />
                </div>
                <div>
                  <label htmlFor="characteristics.fivela.formato" className="block text-sm font-medium text-dark mb-1.5">
                    Formato
                  </label>
                  <input
                    type="text"
                    id="characteristics.fivela.formato"
                    name="characteristics.fivela.formato"
                    value={formData.characteristics.fivela.formato}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                    placeholder="Ex: retangular"
                  />
                </div>
                <div>
                  <label htmlFor="characteristics.fivela.dimensoes" className="block text-sm font-medium text-dark mb-1.5">
                    Dimensões
                  </label>
                  <input
                    type="text"
                    id="characteristics.fivela.dimensoes"
                    name="characteristics.fivela.dimensoes"
                    value={formData.characteristics.fivela.dimensoes}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                    placeholder="Ex: 5x3cm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="space-y-4 border-t border-blue/20 pt-4">
            <h3 className="text-lg font-semibold text-dark">Imagens</h3>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-dark mb-1.5">
                URL da Imagem Principal
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Galeria de Imagens
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                  placeholder="https://exemplo.com/imagem2.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 bg-blue/20 text-dark rounded-lg hover:bg-blue/30 transition-colors flex items-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  <span>Adicionar</span>
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/40 p-2 rounded-lg">
                      <span className="text-sm text-dark truncate flex-1">{img}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" />
                        <span>Remover</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estoque e Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-blue/20 pt-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-dark mb-1.5">
                Estoque
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark mb-1.5">Status</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
                />
                <span className="ml-2 text-sm text-dark">Ativo</span>
              </label>
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-2 border-t border-blue/20 pt-4">
            <label className="block text-sm font-medium text-dark mb-1.5">Flags</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inPromotion"
                  checked={formData.inPromotion}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
                />
                <span className="ml-2 text-sm text-dark">Em Promoção</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bestSelling"
                  checked={formData.bestSelling}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
                />
                <span className="ml-2 text-sm text-dark">Mais Vendido</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="new"
                  checked={formData.new}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
                />
                <span className="ml-2 text-sm text-dark">Novo</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4 border-t border-blue/20">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
