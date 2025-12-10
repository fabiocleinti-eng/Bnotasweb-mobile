import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { validatePassword, getPasswordStrength } from '../utils/noteHelpers';
import { Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');

  const passwordCriteria = validatePassword(senha);
  const passwordStrength = getPasswordStrength(senha);
  const isPasswordStrong = passwordCriteria.minLength && 
                           passwordCriteria.hasUpperCase && 
                           passwordCriteria.hasSpecialChar;

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await authService.login({ email, senha });
      
      if (rememberMe) {
        localStorage.setItem('bnotas_saved_email', email);
      } else {
        localStorage.removeItem('bnotas_saved_email');
      }

      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (senha !== confirmSenha) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    if (!isPasswordStrong) {
      setErrorMessage('Senha não atende aos requisitos');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        nome,
        sobrenome,
        telefone,
        email,
        senha
      });

      setSuccessMessage('Cadastro realizado! Faça login.');
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccessMessage('Link enviado para seu e-mail!');
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao enviar link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00b4db] to-[#0083b0] flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/20 p-4 rounded-full mb-4">
            <div className="text-5xl">📝</div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-wider mb-2">
            {mode === 'login' && 'BEM-VINDO'}
            {mode === 'register' && 'CRIAR CONTA'}
            {mode === 'forgot' && 'RECUPERAR'}
          </h1>
          <p className="text-white/80 text-sm">BnotasWeb Mobile</p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-500 text-white px-4 py-3 rounded-2xl text-center font-medium shadow-lg animate-[slideUp_0.3s_ease]">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-500 text-white px-4 py-3 rounded-2xl text-center font-medium shadow-lg animate-[slideUp_0.3s_ease]">
            {successMessage}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-12 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 touch-target"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-white/90 px-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                Lembrar-me
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="underline hover:text-white"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                placeholder="Sobrenome"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Celular (DD) 99999-9999"
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu Email"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Crie uma Senha"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-12 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 touch-target"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength */}
            {senha && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>Força da senha:</span>
                  <span className="font-bold">{passwordStrength.label}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <ul className="space-y-1 text-xs text-white/90">
                  <li className={`flex items-center gap-2 ${passwordCriteria.minLength ? 'text-green-300' : ''}`}>
                    <span>{passwordCriteria.minLength ? '✓' : '✕'}</span>
                    Min. 8 caracteres
                  </li>
                  <li className={`flex items-center gap-2 ${passwordCriteria.hasUpperCase ? 'text-green-300' : ''}`}>
                    <span>{passwordCriteria.hasUpperCase ? '✓' : '✕'}</span>
                    1 Letra Maiúscula
                  </li>
                  <li className={`flex items-center gap-2 ${passwordCriteria.hasSpecialChar ? 'text-green-300' : ''}`}>
                    <span>{passwordCriteria.hasSpecialChar ? '✓' : '✕'}</span>
                    1 Caracter Especial (@#$%)
                  </li>
                </ul>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                placeholder="Confirme a Senha"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordStrong}
              className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-white/90 text-center mb-4">
              Digite seu e-mail para receber o link de recuperação.
            </p>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu Email"
                required
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-center outline-none shadow-lg focus:scale-[1.02] transition-transform"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-white/90 underline hover:text-white text-sm"
            >
              Voltar ao Login
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        {mode !== 'forgot' && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-white/90 hover:text-white underline text-sm"
            >
              {mode === 'login' 
                ? 'Não tem conta? Cadastre-se' 
                : 'Já tem conta? Faça Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
