import api from '../lib/axios';

export interface FormData {
  nome: string;
  whatsapp: string;
  cpf: string;
  provedorAtual: string;
  satisfacao: string;
  bairro: string;
  velocidade: string;
  valorMensal: string;
  usoInternet: string[];
  interesseProposta: string;
  responsavel: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface PesquisaData {
  id: number;
  nome: string;
  whatsapp: string;
  cpf?: string;
  provedor_atual: string;
  satisfacao: string;
  bairro: string;
  velocidade?: string;
  valor_mensal: string;
  uso_internet: string;
  interesse_proposta: string;
  responsavel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Estatisticas {
  total_pesquisas: number;
  por_satisfacao: Record<string, number>;
  por_interesse: Record<string, number>;
  provedores_mais_citados: Array<{ provedor: string; quantidade: number }>;
  bairros_mais_pesquisados: Array<{ bairro: string; quantidade: number }>;
  media_valor_mensal: string;
}

class PesquisaService {
  // Converter dados do frontend para o formato da API
  private convertFormData(formData: FormData) {
    return {
      nome: formData.nome,
      whatsapp: formData.whatsapp,
      cpf: formData.cpf || undefined,
      provedor_atual: formData.provedorAtual,
      satisfacao: formData.satisfacao,
      bairro: formData.bairro,
      velocidade: formData.velocidade || '',
      valor_mensal: formData.valorMensal,
      uso_internet: formData.usoInternet.join(', '),
      interesse_proposta: formData.interesseProposta,
      responsavel: formData.responsavel,
    };
  }

  // Criar nova pesquisa
  async criarPesquisa(formData: FormData): Promise<ApiResponse<PesquisaData>> {
    try {
      const data = this.convertFormData(formData);
      console.log('📤 Enviando dados para API:', data);
      
      const response = await api.post<ApiResponse<PesquisaData>>('/api/pesquisas', data);
      console.log('✅ Resposta da API:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar pesquisa:', error);
      
      if (error.response?.data) {
        // Tratamento específico para WhatsApp duplicado
        if (error.response.status === 409 && error.response.data.error === 'WHATSAPP_DUPLICATE') {
          return {
            success: false,
            message: 'Este número de WhatsApp já foi cadastrado em uma pesquisa anterior. Cada número pode participar apenas uma vez.',
            error: 'WHATSAPP_DUPLICATE'
          };
        }
        // Tratamento específico para CPF duplicado
        if (error.response.status === 409 && error.response.data.error === 'CPF_DUPLICATE') {
          return {
            success: false,
            message: 'Este CPF já foi cadastrado em uma pesquisa anterior. Cada CPF pode participar apenas uma vez.',
            error: 'CPF_DUPLICATE'
          };
        }
        return error.response.data;
      }
      
      // Se não há resposta do servidor, pode ser erro de rede
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Erro de conexão. Verifique sua internet e tente novamente.',
          error: 'NETWORK_ERROR'
        };
      }
      
      return {
        success: false,
        message: 'Erro inesperado. Tente novamente em alguns instantes.',
        error: error.message
      };
    }
  }

  // Buscar todas as pesquisas com filtros avançados
  async buscarPesquisas(
    page: number = 1, 
    limit: number = 10,
    filters?: {
      search?: string;
      nome?: string;
      bairro?: string;
      provedor_atual?: string;
      satisfacao?: string;
      interesse?: string;
      filtro_satisfacao?: 'satisfeitos' | 'insatisfeitos';
      filtro_interesse?: 'interessados' | 'nao_interessados';
    }
  ): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Adicionar filtros se fornecidos
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
      }

      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar pesquisas');
    }
  }

  // Buscar apenas interessados
  async buscarInteressados(page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/interessados?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar interessados');
    }
  }

  // Buscar apenas não interessados
  async buscarNaoInteressados(page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/nao-interessados?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar não interessados');
    }
  }

  // Buscar satisfeitos
  async buscarSatisfeitos(page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/satisfeitos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar satisfeitos');
    }
  }

  // Buscar insatisfeitos
  async buscarInsatisfeitos(page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/insatisfeitos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar insatisfeitos');
    }
  }

  // Buscar por nome
  async buscarPorNome(nome: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/nome/${encodeURIComponent(nome)}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar por nome');
    }
  }

  // Buscar por provedor
  async buscarPorProvedor(provedor: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/provedor/${encodeURIComponent(provedor)}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar por provedor');
    }
  }

  // Buscar pesquisa por ID
  async buscarPesquisaPorId(id: number): Promise<ApiResponse<PesquisaData>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData>>(`/api/pesquisas/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar pesquisa');
    }
  }

  // Buscar pesquisas por bairro
  async buscarPesquisasPorBairro(bairro: string): Promise<ApiResponse<PesquisaData[]>> {
    try {
      const response = await api.get<ApiResponse<PesquisaData[]>>(`/api/pesquisas/bairro/${bairro}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar pesquisas por bairro');
    }
  }

  // Buscar estatísticas
  async buscarEstatisticas(): Promise<ApiResponse<Estatisticas>> {
    try {
      const response = await api.get<ApiResponse<Estatisticas>>('/api/pesquisas/estatisticas');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao buscar estatísticas');
    }
  }

  // Verificar se WhatsApp já existe
  async verificarWhatsApp(whatsapp: string): Promise<ApiResponse<{ whatsapp: string; jaExiste: boolean; message: string }>> {
    try {
      const response = await api.get<ApiResponse<{ whatsapp: string; jaExiste: boolean; message: string }>>(`/api/pesquisas/verificar-whatsapp/${whatsapp}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao verificar WhatsApp');
    }
  }

  // Verificar se CPF já existe
  async verificarCPF(cpf: string): Promise<ApiResponse<{ cpf: string; jaExiste: boolean; message: string }>> {
    try {
      const response = await api.get<ApiResponse<{ cpf: string; jaExiste: boolean; message: string }>>(`/api/pesquisas/verificar-cpf/${cpf}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao verificar CPF');
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/api/health');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro no health check');
    }
  }
}

export default new PesquisaService();
