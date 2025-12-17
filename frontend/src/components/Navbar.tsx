import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import SearchBar from './SearchBar.tsx';
import { getCurrentUser } from '../services/authServices';
import { getCart } from '../services/cartServices';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [badgePulse, setBadgePulse] = useState(false);

  const loadCartCount = async (shouldAnimate = false) => {
    try {
      const response = await getCart();
      if (response.data.status === 200 && response.data.data) {
        const cart = response.data.data as { items?: unknown[] };
        const newCount = cart.items?.length || 0;
        const oldCount = cartItemsCount;
        
        // Se o count aumentou, animar o badge
        if (shouldAnimate && newCount > oldCount) {
          setBadgePulse(true);
          setTimeout(() => setBadgePulse(false), 500);
        }
        
        setCartItemsCount(newCount);
      }
    } catch (error) {
      // Ignorar erros ao carregar carrinho
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data.status === 200 && response.data.data) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.data.role === 'ADMIN');
          // Carregar quantidade de items no carrinho
          loadCartCount();
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        // Token inválido ou expirado, ou cookie não existe
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    checkUser();

    // Escutar evento de atualização do carrinho
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      loadCartCount(customEvent.detail?.shouldAnimate || false);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/catalogo', label: 'Catálogo' },
    { path: '/catalogo?categoria=cintos', label: 'Cintos' },
    { path: '/catalogo?categoria=fivelas', label: 'Fivelas' },
    { path: '/catalogo?categoria=acessorios', label: 'Acessórios' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-light/80 border-b border-blue/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-dark to-slate bg-clip-text">
              CINTOS
            </div>
            <div className="text-xs text-slate font-light tracking-wider">
              FASHION
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path.split('?')[0]
                    ? 'bg-dark/10 text-dark backdrop-blur-sm'
                    : 'text-slate hover:bg-blue/30 hover:text-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchBar />
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {isAuthenticated && (
              <>
                <Link
                  to="/carrinho"
                  className="relative px-4 py-2 text-slate hover:text-dark transition-colors"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItemsCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${badgePulse ? 'animate-pulse-badge' : ''}`}>
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/painel"
                      className="px-4 py-2 text-sm font-medium text-slate hover:text-dark transition-colors whitespace-nowrap"
                    >
                      Painel
                    </Link>
                    <Link
                      to="/admin/produtos/cadastrar"
                      className="px-4 py-2 text-sm font-medium text-slate hover:text-dark transition-colors whitespace-nowrap"
                    >
                      Cadastrar Produtos
                    </Link>
                    <Link
                      to="/admin/regras-preco"
                      className="px-4 py-2 text-sm font-medium text-slate hover:text-dark transition-colors whitespace-nowrap"
                    >
                      Regras de Preço
                    </Link>
                  </>
                )}
                <Link
                  to="/minha-conta"
                  className="px-4 py-2 text-sm font-medium text-slate hover:text-dark transition-colors whitespace-nowrap"
                >
                  Minha Conta
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate hover:text-dark transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2.5 bg-dark text-light text-sm font-semibold rounded-lg hover:bg-slate transition-all duration-300"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate hover:bg-blue/30 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="mb-4">
              <SearchBar />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path.split('?')[0]
                    ? 'bg-dark/10 text-dark backdrop-blur-sm'
                    : 'text-slate hover:bg-blue/30 hover:text-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-blue/30 space-y-2">
              {isAuthenticated && (
                <>
                  <Link
                    to="/carrinho"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-blue/30 hover:text-dark transition-all duration-200"
                  >
                    <FaShoppingCart />
                    <span>Carrinho</span>
                    {cartItemsCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/produtos/cadastrar"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-blue/30 hover:text-dark transition-all duration-200"
                      >
                        Cadastrar Produtos
                      </Link>
                      <Link
                        to="/admin/regras-preco"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-blue/30 hover:text-dark transition-all duration-200"
                      >
                        Regras de Preço
                      </Link>
                    </>
                  )}
                  <Link
                    to="/minha-conta"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-blue/30 hover:text-dark transition-all duration-200"
                  >
                    Minha Conta
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-blue/30 hover:text-dark transition-all duration-200"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 bg-dark text-light text-sm font-semibold rounded-lg hover:bg-slate transition-all duration-300 text-center"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


