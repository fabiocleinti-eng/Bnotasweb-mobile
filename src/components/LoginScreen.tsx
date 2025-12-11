import { useState, useEffect, useMemo, InputHTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { validatePassword, getPasswordStrength } from '../utils/noteHelpers';
import { Lock, Mail, User, Phone, Eye, EyeOff, LucideIcon } from 'lucide-react';

// -----------------------------------------
// Tipos e Interfaces
// -----------------------------------------
type AuthMode = 'login' | 'register' | 'forgot';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  rightElement?: ReactNode;
}

// -----------------------------------------
// Componente Reutilizável de Input
// -----------------------------------------
const AuthInput = ({ icon: Icon, rightElement, className = '', ...props }: AuthInputProps) => {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        {...props}
        className={`w-full bg-white rounded-full py-4 pl-12 ${rightElement ? 'pr-12' : 'pr-4'} text-center outline-none shadow-lg focus:scale-[1.02] transition-transform ${className}`}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {rightElement}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------
// Tela de Login
// -----------------------------------------
export default function LoginScreen() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmSenha: '',
    nome: '',
    sobrenome: '',
    telefone: ''
  });

  // Validação de senha
  const { passwordCriteria, passwordStrength, isPasswordStrong } = useMemo(() => {
    const currentPass = formData.senha || '';
    const criteria = validatePassword(currentPass);
    const strength = getPasswordStrength(currentPass);

    const isStrong = criteria.minLength && criteria.hasUpperCase && criteria.hasSpecialChar;

    return {
      passwordCriteria: criteria,
      passwordStrength: strength,
      isPasswordStrong: isStrong
    };
  }, [formData.senha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFeedback({ type: '', message: '' });
    setFormData({
      email: '',
      senha: '',
      confirmSenha: '',
      nome: '',
      sobrenome: '',
      telefone: ''
    });
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      await authService.login({ email: formData.email, senha: formData.senha });

      if (rememberMe) {
        localStorage.setItem('bnotas_saved_email', formData.email);
      } else {
        localStorage.removeItem('bnotas_saved_email');
      }

      navigate('/dashboard');
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmSenha) {
      setFeedback({ type: 'error', message: 'As senhas não coincidem' });
      return;
    }
    if (!isPasswordStrong) {
      setFeedback({ type: 'error', message: 'Senha não atende aos requisitos' });
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        telefone: formData.telefone,
        email: formData.email,
        senha: formData.senha
      });
      setFeedback({ type: 'success', message: 'Cadastro realizado! Faça login.' });
      setTimeout(() => setMode('login'), 2000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao cadastrar' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(formData.email);
      setFeedback({ type: 'success', message: 'Link enviado para seu e-mail!' });
      setTimeout(() => setMode('login'), 3000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao enviar link' });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2 animate-fadeIn">
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
        ></div>
      </div>

      <ul className="space-y-1 text-xs text-white/90">
        {[
          { label: 'Min. 8 caracteres', met: passwordCriteria.minLength },
          { label: '1 Letra Maiúscula', met: passwordCriteria.hasUpperCase },
          { label: '1 Caracter Especial (@#$%)', met: passwordCriteria.hasSpecialChar }
        ].map((item, idx) => (
          <li key={idx} className={`flex items-center gap-2 ${item.met ? 'text-green-300' : ''}`}>
            <span>{item.met ? 'Check' : 'Cross'}</span> {item.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00b4db] to-[#0083b0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-block bg-white/20 p-4 rounded-full mb-4">
            <div className="text-5xl">Note</div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-wider mb-2">
            {mode === 'login' && 'BEM-VINDO'}
            {mode === 'register' && 'CRIAR CONTA'}
            {mode === 'forgot' && 'RECUPERAR'}
          </h1>
          <p className="text-white/80 text-sm">BnotasWeb Mobile</p>
        </div>

        {feedback.message && (
          <div className={`mb-4 px-4 py-3 rounded-2xl text-center font-medium text-white shadow-lg ${feedback.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {feedback.message}
          </div>
        )}

        {/* LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <AuthInput icon={Mail} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

            <AuthInput
              icon={Lock}
              name="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
              rightElement={
                <button type="button" onClick={() => setShowPassword(p => !p)} className="touch-target">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-sm text-white/90 px-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4" />
                Lembrar-me
              </label>
              <button type="button" onClick={() => setMode('forgot')} className="underline">
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full shadow-lg transition"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>
        )}

        {/* CADASTRO */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex gap-2">
              <AuthInput icon={User} name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
              <AuthInput icon={User} name="sobrenome" placeholder="Sobrenome" value={formData.sobrenome} onChange={handleChange} required />
            </div>

            <AuthInput icon={Phone} name="telefone" type="tel" placeholder="Celular" value={formData.telefone} onChange={handleChange} />

            <AuthInput icon={Mail} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

            <AuthInput
              icon={Lock}
              name="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Crie uma senha"
              value={formData.senha}
              onChange={handleChange}
              required
              rightElement={
                <button type="button" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            {formData.senha && renderPasswordStrength()}

            <AuthInput
              icon={Lock}
              name="confirmSenha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirme a senha"
              value={formData.confirmSenha}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading || !isPasswordStrong}
              className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full shadow-lg transition"
            >
              {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </button>
          </form>
        )}

        {/* ESQUECI A SENHA */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-white/90 text-center">Digite seu e-mail para receber o link de recuperação.</p>

            <AuthInput icon={Mail} name="email" type="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required />

            <button type="submit" disabled={loading} className="w-full bg-[#00d2a0] hover:bg-[#00c495] text-white font-bold py-4 rounded-full">
              {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
            </button>

            <button type="button" onClick={() => setMode('login')} className="w-full text-white/90 underline text-sm">
              Voltar ao Login
            </button>
          </form>
        )}

        {mode !== 'forgot' && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-white/90 hover:text-white underline text-sm"
            >
              {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}