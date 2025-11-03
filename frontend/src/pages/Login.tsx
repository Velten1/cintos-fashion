import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../services/authServices';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.data.status === 200 && response.data.data) {
        // Token foi salvo em cookie httpOnly pelo backend
        // Redirecionar para a página inicial
        navigate('/');
      } else {
        setError(response.data.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Image with Diagonal Cut */}
      <div 
        className="hidden lg:flex relative overflow-hidden bg-dark"
        style={{
          width: '55%',
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=1920&q=80"
          alt="Cintos Premium"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.dataset.fallback === 'true') {
              target.style.display = 'none';
              return;
            }
            target.dataset.fallback = 'true';
            target.src = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/40 to-transparent z-[1]" />
        <div className="relative z-[2] flex flex-col justify-center items-start p-12 text-white">
          <Link to="/" className="mb-12 flex items-center space-x-2 group">
            <div className="text-3xl font-bold text-white drop-shadow-lg">CINTOS</div>
            <div className="text-sm text-white/90 font-light tracking-wider drop-shadow-md">FASHION</div>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
              Elegância em Cada
              <span className="block text-white drop-shadow-lg mt-2">
                Detalhe
              </span>
            </h2>
            <p className="text-white/95 text-lg leading-relaxed mb-8 drop-shadow-md">
              Descubra nossa coleção exclusiva de cintos premium em couro genuíno.
              Qualidade italiana que você pode sentir.
            </p>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/80"></div>
                <span className="text-sm drop-shadow-sm">Qualidade Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/80"></div>
                <span className="text-sm drop-shadow-sm">Entrega Rápida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form with Diagonal Cut */}
      <div 
        className="flex items-center justify-center p-8 bg-gradient-to-br from-light via-blue/20 to-light"
        style={{
          width: '45%',
          marginLeft: 'auto',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-dark to-slate bg-clip-text text-transparent">
                CINTOS
              </div>
              <div className="text-xs text-slate font-light tracking-wider">FASHION</div>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-blue/40 shadow-2xl p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-dark mb-2">Bem-vindo de volta</h1>
              <p className="text-slate/70">Entre para continuar explorando nossa coleção</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate/50" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/60 border border-blue/20 rounded-xl text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-slate/50" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/60 border border-blue/20 rounded-xl text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-dark transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-slate/70">Lembrar-me</span>
                </label>
                <Link
                  to="/esqueci-senha"
                  className="text-sm text-dark hover:text-slate transition-colors font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-dark text-light rounded-xl font-semibold hover:bg-slate transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-dark/20 border-2 border-dark/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-blue/40"></div>
              <span className="px-4 text-sm text-slate/60">ou</span>
              <div className="flex-1 border-t border-blue/40"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-slate/70 text-sm">
                Ainda não tem uma conta?{' '}
                <Link
                  to="/registro"
                  className="text-dark font-semibold hover:text-slate transition-colors underline"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate/70 hover:text-dark transition-colors inline-flex items-center gap-2"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

