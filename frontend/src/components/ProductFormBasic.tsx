interface ProductFormBasicProps {
  formData: {
    name: string;
    description: string;
    descriptionComplete: string;
    basePrice: string;
    promotionalPrice: string;
    category: 'BELTS' | 'BUCKLE' | 'ACCESSORIES';
    typeBelt: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductFormBasic = ({ formData, onChange }: ProductFormBasicProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark mb-1.5">
          Nome do Produto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-dark mb-1.5">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          />
        </div>
        <div>
          <label htmlFor="descriptionComplete" className="block text-sm font-medium text-dark mb-1.5">Descrição Completa</label>
          <textarea
            id="descriptionComplete"
            name="descriptionComplete"
            value={formData.descriptionComplete}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          />
        </div>
      </div>

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
            onChange={onChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          />
        </div>
        <div>
          <label htmlFor="promotionalPrice" className="block text-sm font-medium text-dark mb-1.5">Preço Promocional (R$)</label>
          <input
            type="number"
            id="promotionalPrice"
            name="promotionalPrice"
            value={formData.promotionalPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-dark mb-1.5">
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          >
            <option value="BELTS">Cintos</option>
            <option value="BUCKLE">Fivelas</option>
            <option value="ACCESSORIES">Acessórios</option>
          </select>
        </div>
        <div>
          <label htmlFor="typeBelt" className="block text-sm font-medium text-dark mb-1.5">Tipo de Cinto</label>
          <select
            id="typeBelt"
            name="typeBelt"
            value={formData.typeBelt}
            onChange={onChange}
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
    </div>
  );
};

export default ProductFormBasic;

