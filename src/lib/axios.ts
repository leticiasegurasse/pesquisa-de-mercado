// Instância do Axios configurada para uso na aplicação
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create(API_CONFIG);

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Se o token expirou (401), tentar renovar
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken
          });
          
          if (response.data.success) {
            localStorage.setItem('auth_token', response.data.data.token);
            localStorage.setItem('refresh_token', response.data.data.refreshToken);
            
            // Reenviar a requisição original com o novo token
            error.config.headers.Authorization = `Bearer ${response.data.data.token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Se falhar ao renovar, limpar tokens e redirecionar para login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 