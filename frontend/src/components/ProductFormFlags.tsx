interface ProductFormFlagsProps {
  formData: {
    stock: string;
    active: boolean;
    inPromotion: boolean;
    bestSelling: boolean;
    new: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductFormFlags = ({ formData, onChange }: ProductFormFlagsProps) => {
  return (
    <>
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
            onChange={onChange}
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
              onChange={onChange}
              className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
            />
            <span className="ml-2 text-sm text-dark">Ativo</span>
          </label>
        </div>
      </div>

      <div className="space-y-2 border-t border-blue/20 pt-4">
        <label className="block text-sm font-medium text-dark mb-1.5">Flags</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="inPromotion"
              checked={formData.inPromotion}
              onChange={onChange}
              className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
            />
            <span className="ml-2 text-sm text-dark">Em Promoção</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="bestSelling"
              checked={formData.bestSelling}
              onChange={onChange}
              className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
            />
            <span className="ml-2 text-sm text-dark">Mais Vendido</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="new"
              checked={formData.new}
              onChange={onChange}
              className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
            />
            <span className="ml-2 text-sm text-dark">Novo</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default ProductFormFlags;

