import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import { Home, Catalog, ProductDetails, Login, Register, Profile, MinhaConta, Addresses, AdminCreateProduct, AdminPriceRules, AdminPriceRulesList, MyOrders, Support, Reviews, Favorites, AdminDashboard } from './pages';
import CartPage from './pages/Cart';
import ToastExample from './components/ToastExample';
import { ToastProvider } from './contexts/ToastContext';
import { useTokenRenewal } from './hooks';
import './App.css';

function App() {
  // Hook para renovar token automaticamente a cada 50 minutos
  useTokenRenewal();

  return (
    <ToastProvider>
      <Router>
        <Routes>
        {/* Rotas com layout padrão */}
        <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
        <Route path="/catalogo" element={<DefaultLayout><Catalog /></DefaultLayout>} />
        <Route path="/produto/:id" element={<DefaultLayout><ProductDetails /></DefaultLayout>} />
        <Route path="/carrinho" element={<DefaultLayout><CartPage /></DefaultLayout>} />
        <Route path="/perfil" element={<DefaultLayout><Profile /></DefaultLayout>} />
        <Route path="/minha-conta" element={<DefaultLayout><MinhaConta /></DefaultLayout>} />
        <Route path="/minha-conta/enderecos" element={<DefaultLayout><Addresses /></DefaultLayout>} />
        <Route path="/minha-conta/pedidos" element={<DefaultLayout><MyOrders /></DefaultLayout>} />
        <Route path="/minha-conta/atendimento" element={<DefaultLayout><Support /></DefaultLayout>} />
        <Route path="/minha-conta/avaliacoes" element={<DefaultLayout><Reviews /></DefaultLayout>} />
        <Route path="/minha-conta/favoritos" element={<DefaultLayout><Favorites /></DefaultLayout>} />
        
        {/* Rotas Admin */}
        <Route path="/admin/painel" element={<DefaultLayout><AdminDashboard /></DefaultLayout>} />
        <Route path="/admin/produtos/cadastrar" element={<DefaultLayout><AdminCreateProduct /></DefaultLayout>} />
        <Route path="/admin/regras-preco" element={<DefaultLayout><AdminPriceRulesList /></DefaultLayout>} />
        <Route path="/admin/produtos/:productId/price-rules" element={<DefaultLayout><AdminPriceRules /></DefaultLayout>} />
        
        {/* Rotas sem layout padrão (tela cheia) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rota de teste do Toast */}
        <Route path="/exemplo-toast" element={<DefaultLayout><ToastExample /></DefaultLayout>} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
