import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { validatePassword, getPasswordStrength } from '../utils/noteHelpers';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const passwordCriteria = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);
  const isPasswordStrong = passwordCriteria.minLength && 
                           passwordCriteria.hasUpperCase && 
                           passwordCriteria.hasSpecialChar;

  useEffect(() => {
    if (!token) {
      setMessage('Token inválido ou não encontrado.');
      setIsError(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (!isPasswordStrong) {
      setMessage('Senha não atende aos requisitos');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authService.resetPassword(token, password);
      setMessage('Senha alterada com sucesso! Redirecionando...');
      setIsError(false);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao alterar senha');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00b4db] to-[#0083b0] flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Redefinir Senha
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Crie sua nova senha de acesso.
        </p>

        {/* Message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-2xl text-center font-medium ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        {!message || isError ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova Senha"
                required
                disabled={!token || loading}
                className="w-full bg-gray-100 rounded-full py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
            {password && (
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Força da senha:</span>
                  <span className="font-bold" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li className={`flex items-center gap-2 ${passwordCriteria.minLength ? 'text-green-600' : ''}`}>
                    <span className="font-bold">{passwordCriteria.minLength ? '✓' : '✕'}</span>
                    Min. 8 caracteres
                  </li>
                  <li className={`flex items-center gap-2 ${passwordCriteria.hasUpperCase ? 'text-green-600' : ''}`}>
                    <span className="font-bold">{passwordCriteria.hasUpperCase ? '✓' : '✕'}</span>
                    1 Letra Maiúscula
                  </li>
                  <li className={`flex items-center gap-2 ${passwordCriteria.hasSpecialChar ? 'text-green-600' : ''}`}>
                    <span className="font-bold">{passwordCriteria.hasSpecialChar ? '✓' : '✕'}</span>
                    1 Caracter Especial (@#$%)
                  </li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!token || loading || !isPasswordStrong}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
            </button>
          </form>
        ) : null}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    </div>
  );
}
