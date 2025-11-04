import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import { getProducts } from '../services/productServices';
import { converterProdutoBackendParaFrontend } from '../utils';
import type { Produto, Filtros } from '../types';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [filtros, setFiltros] = useState<Filtros>({});
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Converter categoria do frontend para backend
  const categoriaParaBackend = (categoria: string): string => {
    const map: Record<string, string> = {
      'cintos': 'BELTS',
      'fivelas': 'BUCKLE',
      'acessorios': 'ACCESSORIES',
    };
    return map[categoria] || categoria.toUpperCase();
  };

  // Converter tipo de cinto do frontend para backend
  const tipoCintoParaBackend = (tipo: string): string => {
    const map: Record<string, string> = {
      'classico': 'CLASSIC',
      'casual': 'CASUAL',
      'executivo': 'EXECUTIVE',
      'esportivo': 'SPORTY',
      'social': 'SOCIAL',
    };
    return map[tipo] || tipo.toUpperCase();
  };

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Preparar filtros para o backend
        const backendFilters: any = {
          active: 'true', // Apenas produtos ativos
        };

        if (busca) {
          backendFilters.busca = busca;
        }

        if (filtros.categoria && filtros.categoria.length > 0) {
          backendFilters.categoria = filtros.categoria.map(cat => categoriaParaBackend(cat));
        }

        if (filtros.tipoCinto && filtros.tipoCinto.length > 0) {
          backendFilters.typeBelt = filtros.tipoCinto.map(tipo => tipoCintoParaBackend(tipo));
        }

        if (filtros.emPromocao !== undefined) {
          backendFilters.inPromotion = filtros.emPromocao;
        }

        if (filtros.maisVendido !== undefined) {
          backendFilters.bestSelling = filtros.maisVendido;
        }

        if (filtros.novo !== undefined) {
          backendFilters.new = filtros.novo;
        }

        if (filtros.precoMin !== undefined) {
          backendFilters.precoMin = filtros.precoMin;
        }

        if (filtros.precoMax !== undefined) {
          backendFilters.precoMax = filtros.precoMax;
        }

        const response = await getProducts(backendFilters);

        if (response.data.status === 200 && response.data.data?.products) {
          const produtosConvertidos = response.data.data.products.map((produto: any) =>
            converterProdutoBackendParaFrontend(produto)
          );
          setProdutos(produtosConvertidos);
        } else {
          setError('Erro ao carregar produtos');
        }
      } catch (err: any) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filtros, busca]);

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
          {loading ? (
            <p className="text-slate/70 text-lg">Carregando produtos...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <p className="text-slate/70 text-lg">
              {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
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
                  {produtos.length} {produtos.length === 1 ? 'resultado' : 'resultados'}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-blue/40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto mb-4"></div>
                  <p className="text-slate/60 text-lg font-medium">Carregando produtos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-red-100 backdrop-blur-md rounded-2xl border border-red-400">
                  <p className="text-red-700 text-lg font-medium">{error}</p>
                </div>
              </div>
            ) : (
              <ProductGrid produtos={produtos} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

