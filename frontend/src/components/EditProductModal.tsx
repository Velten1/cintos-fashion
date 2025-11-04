import { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { updateProduct, getProductById } from '../services/productServices';
import { converterProdutoBackendParaFrontend } from '../utils';
import type { Produto } from '../types';

interface EditProductModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (produto: Produto) => void;
}

const EditProductModal = ({ produto, isOpen, onClose, onProductUpdated }: EditProductModalProps) => {
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [editFormData, setEditFormData] = useState({
    name: produto.nome,
    description: produto.descricao || '',
    descriptionComplete: produto.descricaoCompleta || '',
    basePrice: produto.precoOriginal ? produto.precoOriginal.toString() : produto.preco.toString(),
    promotionalPrice: produto.precoOriginal ? produto.preco.toString() : '',
    category: produto.categoria === 'cintos' ? 'BELTS' : produto.categoria === 'fivelas' ? 'BUCKLE' : 'ACCESSORIES',
    typeBelt: produto.tipoCinto === 'classico' ? 'CLASSIC' :
              produto.tipoCinto === 'casual' ? 'CASUAL' :
              produto.tipoCinto === 'executivo' ? 'EXECUTIVE' :
              produto.tipoCinto === 'esportivo' ? 'SPORTY' :
              produto.tipoCinto === 'social' ? 'SOCIAL' : '',
    characteristics: {
      largura: produto.caracteristicas.largura || '',
      comprimento: produto.caracteristicas.comprimento || '',
      material: produto.caracteristicas.material || '',
      acabamento: produto.caracteristicas.acabamento || '',
      fivela: {
        tipo: produto.caracteristicas.fivela.tipo || '',
        formato: produto.caracteristicas.fivela.formato || '',
        dimensoes: produto.caracteristicas.fivela.dimensoes || '',
      },
      cor: produto.caracteristicas.cor || '',
      resistenteAgua: produto.caracteristicas.resistenteAgua || false,
      forro: produto.caracteristicas.forro || '',
      garantia: produto.caracteristicas.garantia || '',
    },
    imageUrl: produto.imagem || '',
    images: produto.imagens || [],
    inPromotion: produto.emPromocao || false,
    bestSelling: produto.maisVendido || false,
    new: produto.novo || false,
    stock: produto.estoque.toString(),
    active: true,
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('characteristics.')) {
      const field = name.replace('characteristics.', '');
      if (field.startsWith('fivela.')) {
        const fivelaField = field.replace('fivela.', '');
        setEditFormData({
          ...editFormData,
          characteristics: {
            ...editFormData.characteristics,
            fivela: {
              ...editFormData.characteristics.fivela,
              [fivelaField]: value,
            },
          },
        });
      } else {
        setEditFormData({
          ...editFormData,
          characteristics: {
            ...editFormData.characteristics,
            [field]: type === 'checkbox' ? checked : value,
          },
        });
      }
    } else {
      setEditFormData({
        ...editFormData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setEditFormData({
        ...editFormData,
        images: [...editFormData.images, newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditFormData({
      ...editFormData,
      images: editFormData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto.id) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const basePrice = parseFloat(editFormData.basePrice);
      if (!basePrice || basePrice <= 0) {
        setEditError('Preço base deve ser maior que zero');
        setEditLoading(false);
        return;
      }

      const promotionalPrice = editFormData.promotionalPrice ? parseFloat(editFormData.promotionalPrice) : undefined;
      if (promotionalPrice && promotionalPrice >= basePrice) {
        setEditError('Preço promocional deve ser menor que o preço base');
        setEditLoading(false);
        return;
      }

      const updateData: any = {
        name: editFormData.name.trim(),
        basePrice,
        category: editFormData.category,
      };

      if (editFormData.description?.trim()) updateData.description = editFormData.description.trim();
      if (editFormData.descriptionComplete?.trim()) updateData.descriptionComplete = editFormData.descriptionComplete.trim();
      if (promotionalPrice && promotionalPrice > 0) {
        updateData.promotionalPrice = promotionalPrice;
        updateData.inPromotion = true;
      }
      if (editFormData.typeBelt) updateData.typeBelt = editFormData.typeBelt as any;

      if (editFormData.characteristics.largura || editFormData.characteristics.comprimento || 
          editFormData.characteristics.material || editFormData.characteristics.acabamento ||
          editFormData.characteristics.fivela.tipo || editFormData.characteristics.cor) {
        updateData.characteristics = {
          largura: editFormData.characteristics.largura || '',
          comprimento: editFormData.characteristics.comprimento || '',
          material: editFormData.characteristics.material || '',
          acabamento: editFormData.characteristics.acabamento || '',
          fivela: {
            tipo: editFormData.characteristics.fivela.tipo || '',
            formato: editFormData.characteristics.fivela.formato || '',
            dimensoes: editFormData.characteristics.fivela.dimensoes || '',
          },
          cor: editFormData.characteristics.cor || '',
          resistenteAgua: editFormData.characteristics.resistenteAgua,
          forro: editFormData.characteristics.forro || undefined,
          garantia: editFormData.characteristics.garantia || undefined,
        };
      }

      if (editFormData.imageUrl?.trim()) updateData.imageUrl = editFormData.imageUrl.trim();
      if (editFormData.images.length > 0) updateData.images = editFormData.images;
      if (editFormData.inPromotion) updateData.inPromotion = true;
      if (editFormData.bestSelling) updateData.bestSelling = true;
      if (editFormData.new) updateData.new = true;
      if (editFormData.stock) updateData.stock = parseInt(editFormData.stock);

      const response = await updateProduct(produto.id, updateData);

      if (response.data.status === 200) {
        const productResponse = await getProductById(produto.id);
        if (productResponse.data.status === 200 && productResponse.data.data) {
          const produtoConvertido = converterProdutoBackendParaFrontend(productResponse.data.data);
          onProductUpdated(produtoConvertido);
        }
        onClose();
      } else {
        setEditError(response.data.message || 'Erro ao atualizar produto');
      }
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Erro ao atualizar produto. Tente novamente.');
    } finally {
      setEditLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-blue/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark">Editar Produto</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate/20 rounded-lg transition-colors">
            <FaTimes className="text-dark" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {editError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {editError}
            </div>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-dark mb-1.5">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-dark mb-1.5">Descrição</label>
              <textarea
                id="edit-description"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                rows={3}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
            <div>
              <label htmlFor="edit-descriptionComplete" className="block text-sm font-medium text-dark mb-1.5">Descrição Completa</label>
              <textarea
                id="edit-descriptionComplete"
                name="descriptionComplete"
                value={editFormData.descriptionComplete}
                onChange={handleEditChange}
                rows={3}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-basePrice" className="block text-sm font-medium text-dark mb-1.5">
                Preço Base (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-basePrice"
                name="basePrice"
                value={editFormData.basePrice}
                onChange={handleEditChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
            <div>
              <label htmlFor="edit-promotionalPrice" className="block text-sm font-medium text-dark mb-1.5">Preço Promocional (R$)</label>
              <input
                type="number"
                id="edit-promotionalPrice"
                name="promotionalPrice"
                value={editFormData.promotionalPrice}
                onChange={handleEditChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-dark mb-1.5">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-category"
                name="category"
                value={editFormData.category}
                onChange={handleEditChange}
                required
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              >
                <option value="BELTS">Cintos</option>
                <option value="BUCKLE">Fivelas</option>
                <option value="ACCESSORIES">Acessórios</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-typeBelt" className="block text-sm font-medium text-dark mb-1.5">Tipo de Cinto</label>
              <select
                id="edit-typeBelt"
                name="typeBelt"
                value={editFormData.typeBelt}
                onChange={handleEditChange}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-blue/20 pt-4">
            <div>
              <label htmlFor="edit-largura" className="block text-sm font-medium text-dark mb-1.5">Largura (cm)</label>
              <input
                type="text"
                id="edit-largura"
                name="characteristics.largura"
                value={editFormData.characteristics.largura}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="Ex: 3.5cm"
              />
            </div>
            <div>
              <label htmlFor="edit-comprimento" className="block text-sm font-medium text-dark mb-1.5">Comprimento (cm)</label>
              <input
                type="text"
                id="edit-comprimento"
                name="characteristics.comprimento"
                value={editFormData.characteristics.comprimento}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="Ex: 100-120cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-material" className="block text-sm font-medium text-dark mb-1.5">Material</label>
              <input
                type="text"
                id="edit-material"
                name="characteristics.material"
                value={editFormData.characteristics.material}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
            <div>
              <label htmlFor="edit-cor" className="block text-sm font-medium text-dark mb-1.5">Cor</label>
              <input
                type="text"
                id="edit-cor"
                name="characteristics.cor"
                value={editFormData.characteristics.cor}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-blue/20 pt-4">
            <div>
              <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-dark mb-1.5">Imagem Principal (URL)</label>
              <input
                type="url"
                id="edit-imageUrl"
                name="imageUrl"
                value={editFormData.imageUrl}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Galeria de Imagens</label>
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
                  className="px-4 py-2.5 bg-blue/20 text-dark rounded-lg hover:bg-blue/30 transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {editFormData.images.length > 0 && (
                <div className="mt-2 space-y-2">
                  {editFormData.images.map((img, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/40 p-2 rounded-lg">
                      <span className="text-sm text-dark truncate flex-1">{img}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FaTimes className="text-xs" />
                        <span>Remover</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-stock" className="block text-sm font-medium text-dark mb-1.5">Estoque</label>
              <input
                type="number"
                id="edit-stock"
                name="stock"
                value={editFormData.stock}
                onChange={handleEditChange}
                min="0"
                className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark mb-1.5">Flags</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" name="inPromotion" checked={editFormData.inPromotion} onChange={handleEditChange} className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20" />
                  <span className="ml-2 text-sm text-dark">Em Promoção</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="bestSelling" checked={editFormData.bestSelling} onChange={handleEditChange} className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20" />
                  <span className="ml-2 text-sm text-dark">Mais Vendido</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="new" checked={editFormData.new} onChange={handleEditChange} className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20" />
                  <span className="ml-2 text-sm text-dark">Novo</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-blue/20">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate/20 text-dark rounded-lg font-semibold hover:bg-slate/30 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={editLoading} className="flex-1 px-6 py-3 bg-dark text-light rounded-lg font-semibold hover:bg-slate transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {editLoading ? <>⏳ Salvando...</> : <><FaSave /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

