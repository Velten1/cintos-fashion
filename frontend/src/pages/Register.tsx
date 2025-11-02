import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    // Lógica de registro aqui (sem backend por enquanto)
    console.log('Register:', formData);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Left Side - Image with Diagonal Cut */}
      <div 
        className="hidden lg:flex relative overflow-hidden bg-dark"
        style={{
          width: '55%',
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
        }}
      >
        <img
          src="/cinto.jpg"
          alt="Cintos Premium"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.dataset.fallback === 'true') {
              target.style.display = 'none';
              return;
            }
            target.dataset.fallback = 'true';
            target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/40 to-transparent z-[1]" />
        <div className="relative z-[2] flex flex-col justify-center items-start p-6 lg:p-8 text-white">
          <Link to="/" className="mb-6 lg:mb-8 flex items-center space-x-2 group">
            <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">CINTOS</div>
            <div className="text-xs lg:text-sm text-white/90 font-light tracking-wider drop-shadow-md">FASHION</div>
          </Link>
          <div className="max-w-md">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight text-white drop-shadow-lg">
              Junte-se a Nós
              <span className="block text-white drop-shadow-lg mt-1">
                E Descubra o Luxo
              </span>
            </h2>
            <p className="text-white/95 text-sm lg:text-base leading-relaxed mb-5 drop-shadow-md">
              Crie sua conta e tenha acesso a ofertas exclusivas e novos lançamentos.
            </p>
            <div className="space-y-2 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                <span className="text-xs drop-shadow-sm">Ofertas exclusivas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                <span className="text-xs drop-shadow-sm">Acesso antecipado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                <span className="text-xs drop-shadow-sm">Programa de fidelidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form with Diagonal Cut */}
      <div 
        className="flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br from-light via-blue/20 to-light overflow-y-auto"
        style={{
          width: '45%',
          marginLeft: 'auto',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-4">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-2">
              <div className="text-xl font-bold bg-gradient-to-r from-dark to-slate bg-clip-text text-transparent">
                CINTOS
              </div>
              <div className="text-xs text-slate font-light tracking-wider">FASHION</div>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-2xl p-6 lg:p-7">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-dark mb-1">Criar conta</h1>
              <p className="text-slate/70 text-sm">Preencha seus dados para começar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-xs font-medium text-dark mb-1.5">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-slate/50 text-sm" />
                  </div>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-dark mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate/50 text-sm" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-xs font-medium text-dark mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-slate/50 text-sm" />
                  </div>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-dark mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-slate/50 text-sm" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate/60 hover:text-dark transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-dark mb-1.5">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-slate/50 text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark placeholder-slate/60 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate/60 hover:text-dark transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-3.5 h-3.5 mt-0.5 rounded border-blue/40 text-dark focus:ring-dark/20 focus:ring-offset-0"
                />
                <label className="ml-2 text-xs text-slate/70 leading-tight">
                  Eu concordo com os{' '}
                  <Link to="/termos" className="text-dark hover:text-slate underline">
                    termos
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacidade" className="text-dark hover:text-slate underline">
                    política
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-dark text-light rounded-lg font-semibold hover:bg-slate transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-dark/20 border-2 border-dark/50 text-sm mt-2"
              >
                Criar conta
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-blue/40"></div>
              <span className="px-3 text-xs text-slate/60">ou</span>
              <div className="flex-1 border-t border-blue/40"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-slate/70 text-xs">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-dark font-semibold hover:text-slate transition-colors underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-slate/70 hover:text-dark transition-colors inline-flex items-center gap-1"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

