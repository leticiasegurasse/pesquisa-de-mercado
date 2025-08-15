import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MessageCircle, CreditCard, Wifi, ThumbsUp, MapPin, Zap, DollarSign, Monitor, Send, Calendar } from 'lucide-react';

interface PesquisaData {
  id: number;
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

interface PesquisaModalProps {
  pesquisa: PesquisaData | null;
  isOpen: boolean;
  onClose: () => void;
}

const PesquisaModal = ({ pesquisa, isOpen, onClose }: PesquisaModalProps) => {
  if (!pesquisa) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalhes da Pesquisa</h2>
                <p className="text-sm text-gray-500">ID: #{pesquisa.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informações Pessoais */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-blue-500" />
                    Nome completo
                  </label>
                  <p className="text-gray-900 font-medium">{pesquisa.nome}</p>
                </div>

                                 <div className="space-y-2">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                     <MessageCircle className="w-4 h-4 text-green-500" />
                     WhatsApp
                   </label>
                   <p className="text-gray-900 font-medium">{pesquisa.whatsapp}</p>
                 </div>
               </div>

               {/* CPF */}
               {pesquisa.cpf && (
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                     <CreditCard className="w-4 h-4 text-purple-500" />
                     CPF
                   </label>
                   <p className="text-gray-900 font-medium">{pesquisa.cpf}</p>
                 </div>
               )}

              {/* Provedor Atual */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  Provedor atual
                </label>
                <p className="text-gray-900 font-medium">{pesquisa.provedorAtual}</p>
              </div>

              {/* Satisfação */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ThumbsUp className="w-4 h-4 text-yellow-500" />
                  Nível de satisfação
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  pesquisa.satisfacao.toLowerCase().includes('insatisfeito') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pesquisa.satisfacao}
                </span>
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Bairro
                </label>
                <p className="text-gray-900 font-medium">{pesquisa.bairro}</p>
              </div>

              {/* Velocidade */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Velocidade atual
                </label>
                <p className="text-gray-900 font-medium">{pesquisa.velocidade}</p>
              </div>

              {/* Valor Mensal */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Valor mensal
                </label>
                <p className="text-gray-900 font-medium">{pesquisa.valorMensal}</p>
              </div>

              {/* Uso da Internet */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Monitor className="w-4 h-4 text-purple-500" />
                  Uso da internet
                </label>
                <div className="flex flex-wrap gap-2">
                  {pesquisa.usoInternet.split(', ').map((uso, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {uso.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interesse em Proposta */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Send className="w-4 h-4 text-blue-500" />
                  Interesse em proposta
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  pesquisa.interesseProposta.includes('Sim') 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pesquisa.interesseProposta}
                </span>
              </div>

              {/* Responsável */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-purple-500" />
                  Responsável pela pesquisa
                </label>
                <p className="text-gray-900 font-medium">{pesquisa.responsavel}</p>
              </div>

              {/* Data de Criação */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Data de criação
                </label>
                <p className="text-gray-900 font-medium">{formatDate(pesquisa.dataCriacao)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PesquisaModal;
