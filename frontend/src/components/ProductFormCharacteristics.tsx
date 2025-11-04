interface ProductFormCharacteristicsProps {
  characteristics: {
    largura: string;
    comprimento: string;
    material: string;
    acabamento: string;
    fivela: {
      tipo: string;
      formato: string;
      dimensoes: string;
    };
    cor: string;
    resistenteAgua: boolean;
    forro: string;
    garantia: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductFormCharacteristics = ({ characteristics, onChange }: ProductFormCharacteristicsProps) => {
  return (
    <div className="space-y-4">
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
            value={characteristics.largura}
            onChange={onChange}
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
            value={characteristics.comprimento}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: 100-120cm"
          />
        </div>

        <div>
          <label htmlFor="characteristics.material" className="block text-sm font-medium text-dark mb-1.5">Material</label>
          <input
            type="text"
            id="characteristics.material"
            name="characteristics.material"
            value={characteristics.material}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: couro-genuino"
          />
        </div>

        <div>
          <label htmlFor="characteristics.acabamento" className="block text-sm font-medium text-dark mb-1.5">Acabamento</label>
          <input
            type="text"
            id="characteristics.acabamento"
            name="characteristics.acabamento"
            value={characteristics.acabamento}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: fosco"
          />
        </div>

        <div>
          <label htmlFor="characteristics.cor" className="block text-sm font-medium text-dark mb-1.5">Cor</label>
          <input
            type="text"
            id="characteristics.cor"
            name="characteristics.cor"
            value={characteristics.cor}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: preto"
          />
        </div>

        <div>
          <label htmlFor="characteristics.forro" className="block text-sm font-medium text-dark mb-1.5">Forro</label>
          <input
            type="text"
            id="characteristics.forro"
            name="characteristics.forro"
            value={characteristics.forro}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: Tecido sintético"
          />
        </div>

        <div>
          <label htmlFor="characteristics.garantia" className="block text-sm font-medium text-dark mb-1.5">Garantia</label>
          <input
            type="text"
            id="characteristics.garantia"
            name="characteristics.garantia"
            value={characteristics.garantia}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="Ex: 1 ano"
          />
        </div>
      </div>

      <div className="flex items-center pt-2">
        <input
          type="checkbox"
          id="characteristics.resistenteAgua"
          name="characteristics.resistenteAgua"
          checked={characteristics.resistenteAgua}
          onChange={onChange}
          className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20"
        />
        <label htmlFor="characteristics.resistenteAgua" className="ml-2 text-sm text-dark">
          Resistente à água
        </label>
      </div>

      {/* Fivela */}
      <div className="border-t border-blue/20 pt-4 mt-4">
        <h4 className="text-md font-medium text-dark mb-3">Fivela</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="characteristics.fivela.tipo" className="block text-sm font-medium text-dark mb-1.5">Tipo</label>
            <input
              type="text"
              id="characteristics.fivela.tipo"
              name="characteristics.fivela.tipo"
              value={characteristics.fivela.tipo}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Ex: prateada"
            />
          </div>
          <div>
            <label htmlFor="characteristics.fivela.formato" className="block text-sm font-medium text-dark mb-1.5">Formato</label>
            <input
              type="text"
              id="characteristics.fivela.formato"
              name="characteristics.fivela.formato"
              value={characteristics.fivela.formato}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Ex: retangular"
            />
          </div>
          <div>
            <label htmlFor="characteristics.fivela.dimensoes" className="block text-sm font-medium text-dark mb-1.5">Dimensões</label>
            <input
              type="text"
              id="characteristics.fivela.dimensoes"
              name="characteristics.fivela.dimensoes"
              value={characteristics.fivela.dimensoes}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
              placeholder="Ex: 5x3cm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormCharacteristics;

