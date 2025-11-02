import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import { produtosMock, filtrarProdutos } from '../utils';
import type { Filtros } from '../types';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [filtros, setFiltros] = useState<Filtros>({});

  // Parse initial filters from URL
  useEffect(() => {
    const initialFiltros: Filtros = {};
    
    const categoria = searchParams.get('categoria');
    if (categoria) {
      initialFiltros.categoria = [categoria as any];
    }

    const tipoCinto = searchParams.get('tipoCinto');
    if (tipoCinto) {
      initialFiltros.tipoCinto = [tipoCinto as any];
    }

    setFiltros(initialFiltros);
  }, [searchParams]);

  const produtosFiltrados = filtrarProdutos(produtosMock, filtros, busca);

  const handleFilterChange = (newFiltros: Filtros) => {
    setFiltros(newFiltros);
    // Update URL params
    const params = new URLSearchParams();
    if (newFiltros.categoria?.length === 1) {
      params.set('categoria', newFiltros.categoria[0]);
    }
    if (newFiltros.tipoCinto?.length === 1) {
      params.set('tipoCinto', newFiltros.tipoCinto[0]);
    }
    if (busca) {
      params.set('busca', busca);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFiltros({});
    setBusca('');
    setSearchParams({});
  };

  const handleSearch = (query: string) => {
    setBusca(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('busca', query);
    } else {
      params.delete('busca');
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Catálogo</h1>
          <p className="text-slate/70 text-lg">
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <Filters
              filtros={filtros}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar - Desktop (hidden, as it's in Navbar) */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-center justify-between">
                <div className="w-96">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <div className="text-sm text-slate/60">
                  {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'resultado' : 'resultados'}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid produtos={produtosFiltrados} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

