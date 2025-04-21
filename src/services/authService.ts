
import { LoginCredentials, LoginResponse } from "@/types/auth";
import { toast } from "sonner";

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${this.getApiUrl()}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha na autenticação');
      }

      const data: LoginResponse = await response.json();
      
      // Salvar token e usuário no localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      
      console.log('Login bem-sucedido, token salvo.');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação');
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    console.log('Logout realizado, token removido.');
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUser(): any {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  
  getApiUrl(): string {
    const savedApiUrl = localStorage.getItem('adminApiUrl');
    return savedApiUrl || 'http://localhost:3000';
  }
};
