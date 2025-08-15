import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  // Estados
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Funções
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para validar token
  const [error, setError] = useState<string | null>(null);

  // Verificar se há token salvo no localStorage e validar no backend
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Validar token no backend
          const response = await authService.validateToken();
          
          if (response.success) {
            setUser(userData);
          } else {
            // Token inválido, limpar dados
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (err) {
          // Token inválido, limpar dados
          localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
        }
      }
      
      // Sempre definir loading como false após validação
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Tentando fazer login...');
      const response = await authService.login(credentials);
      console.log('📡 Resposta do login:', response);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // Salvar dados no localStorage
        localStorage.setItem('auth_token', token);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        console.log('✅ Login realizado com sucesso, usuário definido:', user);
        return true;
      } else {
        console.error('❌ Login falhou:', response.message);
        throw new Error(response.message || 'Erro ao fazer login');
      }
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Limpar dados do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Limpar estado
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};
