import API_URL, { TOKEN_KEY, USER_KEY } from '../config/api';
import { LoginResponse, User } from '../types/note';

export const authService = {
  // Login (Ajustado para bater com a rota /api/usuarios/login do backend)
  async login(credentials: { email: string; senha: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      // O backend retorna { error: "mensagem" }, ajustamos para capturar isso
      throw new Error(error?.error || 'Erro ao fazer login');
    }

    const data: LoginResponse = await response.json();
    
    // Salva token e usuário no armazenamento local do celular
    localStorage.setItem(TOKEN_KEY, data.token);
    // Se o backend retornar o user dentro de data.user, salvamos.
    // Caso contrário, salvamos o que vier.
    const userData = data.user || { email: credentials.email, id: 0 }; 
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    return data;
  },

  // Registro (Ajustado para /api/usuarios/register)
  async register(userData: {
    nome: string;
    sobrenome: string;
    telefone?: string;
    email: string;
    senha: string;
  }): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Erro ao cadastrar');
    }
  },

  // Recuperar Senha (Ajustado para /api/usuarios/forgot-password)
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Erro ao enviar link');
    }
  },

  // Resetar Senha (Ajustado para /api/usuarios/reset-password)
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Erro ao alterar senha');
    }
  },

  // --- Métodos Auxiliares (Não precisam de alteração, mas mantendo completo) ---
  
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};