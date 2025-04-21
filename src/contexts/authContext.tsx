
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginCredentials, AuthContextType } from '@/types/auth';
import { authService } from '@/services/authService';

// Criando o contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // Verificar token ao inicializar
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();
    
    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
      console.log('Token encontrado no localStorage, usuário autenticado.');
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const success = await authService.login(credentials);
    
    if (success) {
      setToken(authService.getToken());
      setUser(authService.getUser());
      setIsAuthenticated(true);
    }
    
    return success;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
