// Configuração simplificada - não mais necessária para WhatsApp
// Mantido para compatibilidade caso seja necessário no futuro

export const API_URL = 'https://pesquisa-de-mercado-backend.vercel.app';

// Log para debug
console.log('🔧 Configuração da API:', {
  environment: import.meta.env.MODE,
  apiUrl: API_URL,
  note: 'Sistema agora usa WhatsApp para envio de pesquisas'
});

// Configurações da API (mantidas para compatibilidade)
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};
