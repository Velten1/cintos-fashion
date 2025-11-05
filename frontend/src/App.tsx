import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import { Home, Catalog, ProductDetails, Login, Register, Profile, MinhaConta, Addresses, AdminCreateProduct } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas com layout padrão */}
        <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
        <Route path="/catalogo" element={<DefaultLayout><Catalog /></DefaultLayout>} />
        <Route path="/produto/:id" element={<DefaultLayout><ProductDetails /></DefaultLayout>} />
        <Route path="/perfil" element={<DefaultLayout><Profile /></DefaultLayout>} />
        <Route path="/minha-conta" element={<DefaultLayout><MinhaConta /></DefaultLayout>} />
        <Route path="/minha-conta/enderecos" element={<DefaultLayout><Addresses /></DefaultLayout>} />
        
        {/* Rotas Admin */}
        <Route path="/admin/produtos/cadastrar" element={<DefaultLayout><AdminCreateProduct /></DefaultLayout>} />
        
        {/* Rotas sem layout padrão (tela cheia) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
