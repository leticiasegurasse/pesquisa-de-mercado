import axios from 'axios';

// URL da API
export const API_URL = import.meta.env.VITE_API_URL || 'https://site-demonstracao-pesquisa-de-mercado-backend.rxzqz6.easypanel.host';

// Log para debug
console.log('🔧 Configuração da API:', {
  environment: import.meta.env.MODE,
  apiUrl: API_URL,
  note: 'Sistema agora usa WhatsApp para envio de pesquisas'
});

// Configurações da API
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};

// Instância do Axios configurada para uso na aplicação
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

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de renovação
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Tentar renovar o token
          const response = await axios.post(
            `${API_URL}/api/auth/refresh`,
            { refreshToken }
          );

          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          // Salvar novos tokens
          localStorage.setItem('auth_token', token);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }

          // Atualizar header da requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Repetir a requisição original
          return api(originalRequest);
        } catch (refreshError) {
          // Se falhar ao renovar, limpar tokens e redirecionar para login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // Redirecionar para login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor para logs em desenvolvimento
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 Requisição:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('❌ Erro na requisição:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ Resposta:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('❌ Erro na resposta:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
}

export default api;
