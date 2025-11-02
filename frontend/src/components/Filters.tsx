import { useState } from 'react';
import type { Filtros, Categoria, TipoCinto, Material, Cor, Acabamento, TipoFivela } from '../types';

interface FiltersProps {
  filtros: Filtros;
  onFilterChange: (filtros: Filtros) => void;
  onClearFilters: () => void;
}

const Filters = ({ filtros, onFilterChange, onClearFilters }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const categorias: Categoria[] = ['cintos', 'fivelas', 'acessorios'];
  const tiposCinto: TipoCinto[] = ['classico', 'casual', 'executivo', 'esportivo', 'social'];
  const materiais: Material[] = ['couro-genuino', 'couro-sintetico', 'nalon', 'tecido'];
  const cores: Cor[] = ['preto', 'marrom', 'azul-marinho', 'cinza', 'bege', 'castanho', 'branco', 'verde-oliva'];
  const acabamentos: Acabamento[] = ['brilhante', 'fosco', 'texturizado', 'verniz', 'acetinado'];
  const tiposFivela: TipoFivela[] = ['prateada', 'dourada', 'preta', 'cromada', 'antiquada', 'oxidada'];

  const toggleFilter = <T extends string>(
    key: keyof Filtros,
    value: T,
    currentValues?: T[]
  ) => {
    const newValues = currentValues || [];
    const isSelected = newValues.includes(value);
    const updated = isSelected
      ? newValues.filter((v) => v !== value)
      : [...newValues, value];
    onFilterChange({ ...filtros, [key]: updated.length > 0 ? updated : undefined });
  };

  const formatLabel = (label: string): string => {
    return label
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const hasActiveFilters = () => {
    return !!(
      filtros.categoria?.length ||
      filtros.tipoCinto?.length ||
      filtros.material?.length ||
      filtros.cor?.length ||
      filtros.acabamento?.length ||
      filtros.tipoFivela?.length ||
      filtros.emPromocao !== undefined ||
      filtros.maisVendido !== undefined ||
      filtros.novo !== undefined
    );
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-white/70 backdrop-blur-md rounded-xl border border-blue/40 text-dark font-medium mb-4"
      >
        <span>Filtros</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Panel */}
      <div
        className={`
          ${isOpen ? 'block' : 'hidden'}
          lg:block
          bg-white/70 backdrop-blur-md rounded-2xl border border-blue/40 p-6 space-y-6
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-dark font-bold text-lg">Filtros</h3>
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="text-sm text-slate hover:text-dark transition-colors underline"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Categorias */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Categoria</h4>
          <div className="space-y-2">
            {categorias.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.categoria?.includes(cat) || false}
                  onChange={() => toggleFilter('categoria', cat, filtros.categoria)}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                  {formatLabel(cat)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Cinto */}
        {filtros.categoria?.includes('cintos') && (
          <div>
            <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Tipo de Cinto</h4>
            <div className="space-y-2">
              {tiposCinto.map((tipo) => (
                <label key={tipo} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filtros.tipoCinto?.includes(tipo) || false}
                    onChange={() => toggleFilter('tipoCinto', tipo, filtros.tipoCinto)}
                    className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                    {formatLabel(tipo)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Material */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Material</h4>
          <div className="space-y-2">
            {materiais.map((mat) => (
              <label key={mat} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.material?.includes(mat) || false}
                  onChange={() => toggleFilter('material', mat, filtros.material)}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                  {formatLabel(mat)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cor */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Cor</h4>
          <div className="space-y-2">
            {cores.map((cor) => (
              <label key={cor} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.cor?.includes(cor) || false}
                  onChange={() => toggleFilter('cor', cor, filtros.cor)}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                  {formatLabel(cor)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Acabamento */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Acabamento</h4>
          <div className="space-y-2">
            {acabamentos.map((acab) => (
              <label key={acab} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.acabamento?.includes(acab) || false}
                  onChange={() => toggleFilter('acabamento', acab, filtros.acabamento)}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                  {formatLabel(acab)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Fivela */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Fivela</h4>
          <div className="space-y-2">
            {tiposFivela.map((fivela) => (
              <label key={fivela} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.tipoFivela?.includes(fivela) || false}
                  onChange={() => toggleFilter('tipoFivela', fivela, filtros.tipoFivela)}
                  className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">
                  {formatLabel(fivela)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div>
          <h4 className="text-dark font-semibold mb-3 text-sm uppercase tracking-wide">Destaques</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filtros.emPromocao || false}
                onChange={(e) => onFilterChange({ ...filtros, emPromocao: e.target.checked || undefined })}
                className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">Em Promoção</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filtros.maisVendido || false}
                onChange={(e) => onFilterChange({ ...filtros, maisVendido: e.target.checked || undefined })}
                className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">Mais Vendidos</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filtros.novo || false}
                onChange={(e) => onFilterChange({ ...filtros, novo: e.target.checked || undefined })}
                className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-slate group-hover:text-dark transition-colors">Novos</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

