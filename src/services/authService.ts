import api from '../lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name_user: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

class AuthService {
  // Fazer login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('📤 Enviando credenciais para login:', { email: credentials.email });
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('📥 Resposta do servidor:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no authService.login:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao fazer login');
    }
  }

  // Fazer logout
  async logout(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/logout');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao fazer logout');
    }
  }

  // Renovar token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao renovar token');
    }
  }

  // Verificar se token é válido
  async validateToken(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>('/auth/verify-token');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao validar token');
    }
  }

  // Esqueci a senha
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao solicitar redefinição de senha');
    }
  }

  // Redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao redefinir senha');
    }
  }

  // Obter perfil do usuário
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>('/auth/profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao obter perfil');
    }
  }

  // Atualizar perfil
  async updateProfile(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await api.put<AuthResponse>('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao atualizar perfil');
    }
  }

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao alterar senha');
    }
  }
}

export default new AuthService();
