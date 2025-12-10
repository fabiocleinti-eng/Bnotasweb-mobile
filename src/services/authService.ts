import API_URL, { TOKEN_KEY, USER_KEY } from '../config/api';
import { LoginResponse, User } from '../types/note';

export const authService = {
  // Login
  async login(credentials: { email: string; senha: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Erro ao fazer login');
    }

    const data: LoginResponse = await response.json();
    
    // Salva token e usuário
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  },

  // Registro
  async register(userData: {
    nome: string;
    sobrenome: string;
    telefone?: string;
    email: string;
    senha: string;
  }): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Erro ao cadastrar');
    }
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Erro ao enviar link');
    }
  },

  // Reset Password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Erro ao alterar senha');
    }
  },

  // Get Token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get User
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  // Logout
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
