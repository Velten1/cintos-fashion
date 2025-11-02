import { Link } from 'react-router-dom';
import { FaStar, FaBullseye, FaTruck } from 'react-icons/fa';
import ProductGrid from '../components/ProductGrid';
import { produtosMock } from '../utils';

const Home = () => {
  const produtosDestaque = produtosMock
    .filter((p) => p.maisVendido || p.emPromocao || p.novo)
    .slice(0, 8);

  const categorias = [
    {
      nome: 'Cintos Executivos',
      descricao: 'Elegância para o ambiente corporativo',
      imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=600',
      link: '/catalogo?categoria=cintos&tipoCinto=executivo',
    },
    {
      nome: 'Cintos Casuais',
      descricao: 'Estilo descontraído e moderno',
      imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
      link: '/catalogo?categoria=cintos&tipoCinto=casual',
    },
    {
      nome: 'Fivelas',
      descricao: 'Personalize seus acessórios',
      imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      link: '/catalogo?categoria=fivelas',
    },
    {
      nome: 'Acessórios',
      descricao: 'Cuidado e manutenção premium',
      imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
      link: '/catalogo?categoria=acessorios',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-slate to-dark text-light py-16 lg:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/cinto-hero.jpg"
            alt="Fundo elegante"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.dataset.fallback === 'true') {
                target.style.display = 'none';
                return;
              }
              target.dataset.fallback = 'true';
              target.src = '/cinto.jpg';
            }}
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark/75 via-dark/65 to-dark/75 z-[1]"></div>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 z-[2]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[3]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-2xl">
              Elegância em Cada
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-silver to-white mt-2 drop-shadow-lg">
                Detalhe
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-white/95 mb-6 leading-relaxed drop-shadow-lg">
              Descubra nossa coleção premium de cintos, fivelas e acessórios em couro genuíno.
              Qualidade italiana que você pode sentir.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-xl">
                <div className="text-3xl mb-2 text-white flex justify-center drop-shadow-md">
                  <FaStar />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Qualidade Premium</h3>
                <p className="text-white/90 text-xs drop-shadow-sm">Couro genuíno italiano selecionado</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-xl">
                <div className="text-3xl mb-2 text-white flex justify-center drop-shadow-md">
                  <FaBullseye />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Variedade Completa</h3>
                <p className="text-white/90 text-xs drop-shadow-sm">Mais de {produtosMock.length} produtos disponíveis</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-xl">
                <div className="text-3xl mb-2 text-white flex justify-center drop-shadow-md">
                  <FaTruck />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Entrega Rápida</h3>
                <p className="text-white/90 text-xs drop-shadow-sm">Envio seguro para todo Brasil</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalogo"
                className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-xl drop-shadow-lg"
              >
                Ver Catálogo Completo
              </Link>
              <Link
                to="/catalogo?categoria=cintos&tipoCinto=executivo"
                className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-xl drop-shadow-lg"
              >
                Cintos Executivos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-light to-blue/10 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Explore Nossas Categorias</h2>
            <p className="text-slate/70 text-lg">Encontre o produto perfeito para cada ocasião</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((categoria, index) => (
              <Link
                key={index}
                to={categoria.link}
                className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-blue/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={categoria.imagem}
                    alt={categoria.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.dataset.fallback === 'true') {
                        target.style.display = 'none';
                        return;
                      }
                      target.dataset.fallback = 'true';
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect fill='%23D8E1E8' width='600' height='600'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ECategoria%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-light">
                  <h3 className="text-xl font-bold mb-1">{categoria.nome}</h3>
                  <p className="text-silver/90 text-sm">{categoria.descricao}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Destaques</h2>
              <p className="text-slate/70 text-lg">Produtos mais populares e em promoção</p>
            </div>
            <Link
              to="/catalogo"
              className="hidden md:block px-6 py-3 bg-dark/10 backdrop-blur-sm border border-dark/20 rounded-xl text-dark font-semibold hover:bg-dark/20 transition-all duration-300"
            >
              Ver Todos
            </Link>
          </div>
          <ProductGrid produtos={produtosDestaque} />
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/catalogo"
              className="inline-block px-6 py-3 bg-dark/10 backdrop-blur-sm border border-dark/20 rounded-xl text-dark font-semibold hover:bg-dark/20 transition-all duration-300"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-dark via-slate to-dark text-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Qualidade Premium</h2>
          <p className="text-xl text-silver/80 mb-8 leading-relaxed">
            Cada produto é cuidadosamente selecionado e fabricado com os melhores materiais.
            Experiência o luxo discreto de nossos cintos em couro genuíno.
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md border border-silver/30 rounded-xl text-light font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            Explorar Coleção Completa
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

