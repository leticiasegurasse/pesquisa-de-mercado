// Determinar a URL da API baseada no ambiente
const getApiUrl = () => {
  // Se estiver em desenvolvimento e não houver URL específica, usar localhost
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    return 'https://pesquisa-de-mercado-backend.vercel.app';
  }
  
  // Usar a URL configurada ou fallback para produção
  return import.meta.env.VITE_API_URL || 'https://pesquisa-de-mercado-backend.vercel.app';
};

export const API_URL = getApiUrl();

// Log para debug
console.log('🔧 Configuração da API:', {
  environment: import.meta.env.MODE,
  apiUrl: API_URL,
  viteApiUrl: import.meta.env.VITE_API_URL
});

// Configurações da API
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};
