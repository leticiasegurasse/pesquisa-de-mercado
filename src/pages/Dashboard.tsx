import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Plus,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Link,
  Copy
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import PesquisaModal from '../components/PesquisaModal';
import { useAuth } from '../hooks/useAuth';
import pesquisaService, { type PesquisaData, type Estatisticas, type Pagination } from '../services/pesquisaService';
import * as XLSX from 'xlsx';
import NotificationToast from '../components/Notification';

// Interface para dados de pesquisa do dashboard
interface DashboardPesquisa {
  id: string | number;
  nome: string;
  whatsapp: string;
  cpf?: string;
  provedorAtual: string;
  satisfacao: string;
  bairro: string;
  velocidade: string;
  valorMensal: string;
  usoInternet: string;
  interesseProposta: string;
  responsavel: string;
  dataCriacao: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [filtrosAtivos, setFiltrosAtivos] = useState<{
    search?: string;
    nome?: string;
    bairro?: string;
    provedor_atual?: string;
    satisfacao?: string;
    interesse?: string;
    filtro_satisfacao?: 'satisfeitos' | 'insatisfeitos';
    filtro_interesse?: 'interessados' | 'nao_interessados';
  }>({});
  
  // Novos estados para filtros separados
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroInteresse, setFiltroInteresse] = useState('');
  const [filtroSatisfacao, setFiltroSatisfacao] = useState('');
  const [pesquisas, setPesquisas] = useState<DashboardPesquisa[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [selectedPesquisa, setSelectedPesquisa] = useState<DashboardPesquisa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Lista de responsáveis (você pode expandir conforme necessário)
  const responsaveis = [
    { nome: 'Maria Silva', codigo: 'maria-silva' },
    { nome: 'João Santos', codigo: 'joao-santos' }
  ];
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10, // 2 pesquisas por página
    total: 0,
    totalPages: 1
  });

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltroBusca('');
    setFiltroInteresse('');
    setFiltroSatisfacao('');
    setSearchTerm('');
    setFiltrosAtivos({});
  };

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    carregarDados(1);
  };

  // Carregar dados do dashboard com filtros
  const carregarDados = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Carregando dados do dashboard...', { page, filtrosAtivos });
      
      let pesquisasResponse;
      
      // Construir filtros combinados
      const filtrosCombinados: any = {};
      
      // Filtro de busca (nome, provedor, bairro)
      if (filtroBusca.trim()) {
        filtrosCombinados.search = filtroBusca.trim();
      }
      
      // Filtro de interesse
      if (filtroInteresse) {
        if (filtroInteresse === 'interessados') {
          filtrosCombinados.filtro_interesse = 'interessados';
        } else if (filtroInteresse === 'nao-interessados') {
          filtrosCombinados.filtro_interesse = 'nao_interessados';
        }
      }
      
      // Filtro de satisfação
      if (filtroSatisfacao) {
        if (filtroSatisfacao === 'satisfeitos') {
          filtrosCombinados.filtro_satisfacao = 'satisfeitos';
        } else if (filtroSatisfacao === 'insatisfeitos') {
          filtrosCombinados.filtro_satisfacao = 'insatisfeitos';
        }
      }
      
             // Busca geral com filtros combinados
       const filtros = { ...filtrosAtivos, ...filtrosCombinados };
       if (searchTerm) {
         filtros.search = searchTerm;
       }
       pesquisasResponse = await pesquisaService.buscarPesquisas(page, pagination.limit, filtros);
      
             if (pesquisasResponse.success && pesquisasResponse.data) {
         console.log('📊 Dados recebidos do backend:', pesquisasResponse.data);
         
         // Verificar se os dados estão na estrutura esperada
         const pesquisasArray = Array.isArray(pesquisasResponse.data) 
           ? pesquisasResponse.data 
           : (pesquisasResponse.data as any).pesquisas || [];
         
         const pesquisasFormatadas = pesquisasArray.map((pesquisa: PesquisaData): DashboardPesquisa => {
           console.log('📅 Data original:', pesquisa.createdAt, 'Tipo:', typeof pesquisa.createdAt);
           
           return {
             id: pesquisa._id || pesquisa.id || `temp-${Date.now()}`, // MongoDB usa _id, fallback para id
             nome: pesquisa.nome,
             whatsapp: pesquisa.whatsapp,
             cpf: pesquisa.cpf,
             provedorAtual: pesquisa.provedor_atual,
             satisfacao: pesquisa.satisfacao,
             bairro: pesquisa.bairro,
             velocidade: pesquisa.velocidade || 'Não informado',
             valorMensal: pesquisa.valor_mensal,
             usoInternet: pesquisa.uso_internet,
             interesseProposta: pesquisa.interesse_proposta,
             responsavel: pesquisa.responsavel,
             dataCriacao: pesquisa.createdAt
           };
         });
         setPesquisas(pesquisasFormatadas);
         
         // Atualizar paginação
         if (pesquisasResponse.pagination) {
           setPagination(pesquisasResponse.pagination);
         } else if ((pesquisasResponse.data as any).pagination) {
           setPagination((pesquisasResponse.data as any).pagination);
         }
        
        console.log('✅ Pesquisas carregadas:', pesquisasFormatadas.length, 'Página:', page, 'Filtro:', selectedFilter);
      }
      
      // Carregar estatísticas (apenas na primeira página)
      if (page === 1) {
        const estatisticasResponse = await pesquisaService.buscarEstatisticas();
        if (estatisticasResponse.success && estatisticasResponse.data) {
          setEstatisticas(estatisticasResponse.data);
          console.log('✅ Estatísticas carregadas');
        }
      }
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados(1);
  }, []);

  // Aplicar filtros e recarregar dados quando filtros mudarem
  useEffect(() => {
    carregarDados(1);
  }, [filtrosAtivos, filtroBusca, filtroInteresse, filtroSatisfacao]);

  // Aplicar busca quando searchTerm mudar (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFiltrosAtivos(prev => ({
        ...prev,
        search: searchTerm || undefined
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Estatísticas da API (dados reais do banco)
  const totalPesquisas = estatisticas?.total_pesquisas || 0;
  const pesquisasNaPagina = pesquisas.length; // Pesquisas na página atual
  
     // Usar os valores calculados diretamente do backend
   const interessados = estatisticas?.interessados || 0;
   const naoInteressados = estatisticas?.nao_interessados || 0;
   const satisfeitos = estatisticas?.satisfeitos || 0;
   const insatisfeitos = estatisticas?.insatisfeitos || 0;

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return 'Data não informada';
      }
      
      // Log para debug
      console.log('📅 Formatando data:', dateString, 'Tipo:', typeof dateString);
      
      let date: Date = new Date();
      
      // Tentar criar a data
      if (typeof dateString === 'string') {
        // Tentar diferentes formatos de data
        date = new Date(dateString);
        
        // Se falhou, tentar parse manual para formato ISO
        if (isNaN(date.getTime())) {
          // Tentar remover timezone se presente
          const cleanDateString = dateString.replace(/[TZ]/g, ' ').trim();
          date = new Date(cleanDateString);
          
          if (isNaN(date.getTime())) {
            console.error('❌ Data inválida após tentativas:', dateString);
            return 'Data inválida';
          }
        }
      }
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        console.error('❌ Data inválida:', dateString);
        return 'Data inválida';
      }
      
      // Formatar para o padrão brasileiro
      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      console.log('✅ Data formatada:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error, 'Data original:', dateString);
      return 'Data inválida';
    }
  };

  const handleViewPesquisa = (pesquisa: DashboardPesquisa) => {
    setSelectedPesquisa(pesquisa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPesquisa(null);
  };

  // Funções de navegação de páginas
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      carregarDados(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      handlePageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      handlePageChange(pagination.page + 1);
    }
  };

  // Função para copiar link personalizado
  const handleCopyLink = async (responsavel: string) => {
    try {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/pesquisa-mercado/${encodeURIComponent(responsavel)}`;
      
      await navigator.clipboard.writeText(link);
      
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Link Copiado!',
        message: `Link personalizado para ${responsavel} foi copiado para a área de transferência.`
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erro ao Copiar',
        message: 'Erro ao copiar link. Tente novamente.'
      });
    }
  };

  // Função para exportar dados para Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      
             console.log('📊 Exportando dados para Excel...', { filtrosAtivos });
      
             let todasPesquisasResponse;
       
       // Usar os mesmos filtros ativos para exportação
       const filtros = { ...filtrosAtivos };
       if (searchTerm) {
         filtros.search = searchTerm;
       }
       todasPesquisasResponse = await pesquisaService.buscarPesquisas(1, 1000, filtros);
      
             if (!todasPesquisasResponse.success || !todasPesquisasResponse.data) {
         throw new Error('Erro ao buscar dados para exportação');
       }

       // Verificar se os dados estão na estrutura esperada
       const pesquisasArray = Array.isArray(todasPesquisasResponse.data) 
         ? todasPesquisasResponse.data 
         : (todasPesquisasResponse.data as any).pesquisas || [];

       // Preparar dados para exportação
       const dadosParaExportar = pesquisasArray.map((pesquisa: PesquisaData) => ({
          'ID': pesquisa._id || pesquisa.id || 'N/A',
          'Nome': pesquisa.nome,
          'WhatsApp': pesquisa.whatsapp,
          'CPF': pesquisa.cpf || 'Não informado',
          'Provedor Atual': pesquisa.provedor_atual,
          'Velocidade': pesquisa.velocidade || 'Não informado',
          'Valor Mensal': pesquisa.valor_mensal,
          'Bairro': pesquisa.bairro,
          'Satisfação': pesquisa.satisfacao,
          'Uso da Internet': pesquisa.uso_internet,
          'Interesse na Proposta': pesquisa.interesse_proposta,
          'Responsável': pesquisa.responsavel,
                     'Data de Criação': new Date(pesquisa.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);

             // Ajustar largura das colunas
               const colWidths = [
          { wch: 5 },   // ID
          { wch: 25 },  // Nome
          { wch: 15 },  // WhatsApp
          { wch: 15 },  // CPF
          { wch: 20 },  // Provedor Atual
          { wch: 15 },  // Velocidade
          { wch: 15 },  // Valor Mensal
          { wch: 20 },  // Bairro
          { wch: 20 },  // Satisfação
          { wch: 25 },  // Uso da Internet
          { wch: 20 },  // Interesse na Proposta
          { wch: 20 },  // Responsável
          { wch: 20 }   // Data de Criação
        ];
      worksheet['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pesquisas de Mercado');

      // Gerar nome do arquivo com data atual
      const dataAtual = new Date().toISOString().split('T')[0];
      const nomeArquivo = `pesquisas_mercado_${dataAtual}.xlsx`;

      // Salvar arquivo
      XLSX.writeFile(workbook, nomeArquivo);
      
      console.log('✅ Arquivo exportado com sucesso:', nomeArquivo);
      
      // Mostrar notificação de sucesso
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Exportação Concluída!',
        message: `Arquivo "${nomeArquivo}" exportado com sucesso!`
      });
      
    } catch (err: any) {
      console.error('❌ Erro ao exportar dados:', err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erro na Exportação',
        message: 'Erro ao exportar dados. Tente novamente.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
                <p className="text-sm text-gray-500">Gerenciamento de Pesquisas</p>
              </div>
            </div>
            
            
            <div className="flex items-center gap-4">
              {/* Informações do usuário */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@exemplo.com'}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Cards de Estatísticas */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
                         <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">Total de Pesquisas</p>
                 <p className="text-3xl font-bold text-gray-900">{totalPesquisas}</p>
                    {pagination.totalPages > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {pesquisasNaPagina} nesta página (máx. {pagination.limit})
                    </p>
                  )}
               </div>
               <div className="bg-blue-100 p-3 rounded-lg">
                 <Users className="w-6 h-6 text-blue-600" />
               </div>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interessados</p>
                <p className="text-3xl font-bold text-green-600">{interessados}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Interessados</p>
                <p className="text-3xl font-bold text-red-600">{naoInteressados}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfeitos</p>
                <p className="text-3xl font-bold text-yellow-600">{satisfeitos}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Insatisfeitos</p>
                <p className="text-3xl font-bold text-orange-600">{insatisfeitos}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

                 {/* Ações */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
         >
           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => carregarDados(pagination.page)}
                 disabled={isLoading}
                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
               >
                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                 <span className="hidden sm:inline">Atualizar</span>
               </button>
               <button 
                 onClick={handleExportToExcel}
                 disabled={isExporting}
                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
               >
                 <Download className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
                 <span className="hidden sm:inline">{isExporting ? 'Exportando...' : 'Exportar'}</span>
               </button>
             </div>
             
             <RouterLink
               to={ROUTES.PESQUISA_MERCADO}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
             >
               <Plus className="w-4 h-4" />
               <span className="hidden sm:inline">Nova Pesquisa</span>
             </RouterLink>
           </div>
         </motion.div>

        {/* Links Personalizados dos Responsáveis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Links Personalizados</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Cada responsável tem seu próprio link que pré-preenche automaticamente o campo responsável no formulário.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responsaveis.map((resp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{resp.nome}</h4>
                  <button
                    onClick={() => handleCopyLink(resp.nome)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </button>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                  {window.location.origin}/pesquisa-mercado/{encodeURIComponent(resp.nome)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cards de Estatísticas Adicionais */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Provedores Mais Citados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Provedores Mais Citados</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-3">
                {estatisticas.provedores_mais_citados?.slice(0, 3).map((provedor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{provedor.provedor}</span>
                    <span className="text-sm font-semibold text-purple-600">{provedor.quantidade}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bairros Mais Pesquisados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Bairros Mais Pesquisados</h3>
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="space-y-3">
                {estatisticas.bairros_mais_pesquisados?.slice(0, 3).map((bairro, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{bairro.bairro}</span>
                    <span className="text-sm font-semibold text-indigo-600">{bairro.quantidade}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Média de Valor Mensal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Valor Médio Mensal</h3>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{estatisticas.media_valor_mensal}</p>
                <p className="text-sm text-gray-500 mt-1">Média por cliente</p>
              </div>
            </motion.div>
          </div>
        )}

                 {/* Filtros Avançados da Tabela */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.9 }}
           className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6"
         >
           <div className="mb-4">
             <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtros Avançados</h3>
             <p className="text-sm text-gray-600">Combine os filtros para encontrar pesquisas específicas</p>
           </div>
           
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Filtro de Busca */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar por</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Nome, bairro ou provedor..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtro de Interesse */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Interesse na Proposta</label>
                <select
                  value={filtroInteresse}
                  onChange={(e) => setFiltroInteresse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="interessados">Interessados</option>
                  <option value="nao-interessados">Não interessados</option>
                </select>
              </div>

              {/* Filtro de Satisfação */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Satisfação</label>
                <select
                  value={filtroSatisfacao}
                  onChange={(e) => setFiltroSatisfacao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="satisfeitos">Satisfeitos</option>
                  <option value="insatisfeitos">Insatisfeitos</option>
                </select>
              </div>
            </div>

           {/* Ações dos Filtros */}
           <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
             <div className="flex items-center gap-2 text-sm text-gray-600">
               <Filter className="w-4 h-4" />
               <span>
                 {filtroBusca || filtroInteresse || filtroSatisfacao 
                   ? 'Filtros ativos: ' + [
                       filtroBusca && 'Busca',
                       filtroInteresse && 'Interesse',
                       filtroSatisfacao && 'Satisfação'
                     ].filter(Boolean).join(', ')
                   : 'Nenhum filtro aplicado'
                 }
               </span>
             </div>
             
             <div className="flex gap-2">
               <button
                 onClick={aplicarFiltros}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
               >
                 Aplicar Filtros
               </button>
               <button
                 onClick={limparFiltros}
                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
               >
                 Limpar Filtros
               </button>
             </div>
           </div>
         </motion.div>

         {/* Tabela de Pesquisas */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.0 }}
           className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
         >
           {/* Loading ou Erro */}
           {isLoading && (
             <div className="p-8 text-center">
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-600">Carregando pesquisas...</p>
             </div>
           )}
           
           {error && !isLoading && (
             <div className="p-8 text-center">
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                 <p className="text-red-600">{error}</p>
               </div>
                               <button 
                  onClick={() => carregarDados(pagination.page)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all mx-auto"
                >
                 <RefreshCw className="w-4 h-4" />
                 Tentar Novamente
               </button>
             </div>
           )}
           
                       {!isLoading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CPF
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provedor Atual
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bairro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Responsável
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uso da Internet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interesse
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                                         <tbody className="bg-white divide-y divide-gray-200">
                                               {pesquisas.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                              Nenhuma pesquisa encontrada
                            </td>
                          </tr>
                       ) : (
                         pesquisas.map((pesquisa: DashboardPesquisa, index: number) => (
                          <motion.tr
                            key={pesquisa.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{pesquisa.nome}</div>
                                <div className="text-sm text-gray-500">{pesquisa.whatsapp}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {pesquisa.cpf || 'Não informado'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{pesquisa.provedorAtual}</div>
                              <div className="text-sm text-gray-500">{pesquisa.velocidade}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{pesquisa.bairro}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{pesquisa.responsavel}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 max-w-xs truncate" title={pesquisa.usoInternet}>
                                {pesquisa.usoInternet}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                pesquisa.satisfacao.includes('nsatisfeito') 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {pesquisa.satisfacao}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                pesquisa.interesseProposta.includes('Sim') 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {pesquisa.interesseProposta.includes('Sim') ? 'Interessado' : 'Não interessado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{formatDate(pesquisa?.dataCriacao)}</span>
                              </div>
                            </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => handleViewPesquisa(pesquisa)}
                                   className="text-blue-600 hover:text-blue-900 transition-colors"
                                   title="Ver detalhes"
                                 >
                                   <Eye className="w-4 h-4" />
                                 </button>
                               </div>
                             </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                                 {/* Paginação */}
                 <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                   <div className="flex items-center justify-between">
                     <div className="text-sm text-gray-700">
                       Mostrando <span className="font-medium">{pesquisas.length}</span> de{' '}
                       <span className="font-medium">{pagination.total}</span> resultados
                       {pagination.totalPages > 1 && (
                         <span className="text-gray-500 ml-2">
                           (Página {pagination.page} de {pagination.totalPages})
                         </span>
                       )}
                     </div>
                     {pagination.totalPages > 1 && (
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={handlePreviousPage}
                           disabled={pagination.page <= 1}
                           className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Anterior
                         </button>
                         
                         {/* Números das páginas */}
                         <div className="flex items-center gap-1">
                           {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                             let pageNumber;
                             if (pagination.totalPages <= 5) {
                               pageNumber = i + 1;
                             } else if (pagination.page <= 3) {
                               pageNumber = i + 1;
                             } else if (pagination.page >= pagination.totalPages - 2) {
                               pageNumber = pagination.totalPages - 4 + i;
                             } else {
                               pageNumber = pagination.page - 2 + i;
                             }
                             
                             return (
                               <button
                                 key={pageNumber}
                                 onClick={() => handlePageChange(pageNumber)}
                                 className={`px-3 py-1 text-sm rounded ${
                                   pageNumber === pagination.page
                                     ? 'bg-blue-600 text-white'
                                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                 }`}
                               >
                                 {pageNumber}
                               </button>
                             );
                           })}
                         </div>
                         
                         <button 
                           onClick={handleNextPage}
                           disabled={pagination.page >= pagination.totalPages}
                           className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Próximo
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
              </>
            )}
        </motion.div>
      </div>

             {/* Modal de Detalhes */}
       <PesquisaModal
         pesquisa={selectedPesquisa}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
       />

       {/* Notificação */}
       <NotificationToast
         isOpen={notification.isOpen}
         onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
         type={notification.type}
         title={notification.title}
         message={notification.message}
         duration={5000}
       />
     </div>
   );
 };

export default Dashboard;
