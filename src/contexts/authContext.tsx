
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginCredentials, AuthContextType } from '@/types/auth';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Verificar token ao inicializar e monitorar validade
  useEffect(() => {
    const checkToken = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();
      
      if (storedToken) {
        // Verificar se o token está expirado
        try {
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          const expirationTime = tokenData.exp * 1000; // Converter para milissegundos
          
          if (Date.now() >= expirationTime) {
            logout();
            return;
          }
          
          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao validar token:', error);
          logout();
        }
      }
    };

    checkToken();
    
    // Verificar o token a cada minuto
    const intervalId = setInterval(checkToken, 60000);
    
    return () => clearInterval(intervalId);
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
    navigate('/login');
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
