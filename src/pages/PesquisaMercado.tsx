import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  User, 
  MessageCircle, 
  CreditCard,
  Wifi, 
  ThumbsUp, 
  MapPin, 
  Zap, 
  DollarSign, 
  Monitor, 
  Send,
  WifiOff,
  CheckCircle
} from 'lucide-react';
import Header from '../components/Header';
import ConfirmacaoEnvio from '../components/ConfirmacaoEnvio';
import ProgressBar from '../components/ProgressBar';
import Notification from '../components/Notification';
import { usePesquisa } from '../hooks/usePesquisa';
import { type FormData } from '../utils/whatsappUtils';

const PesquisaMercado = () => {
  const { responsavel } = useParams<{ responsavel?: string }>();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    whatsapp: '',
    cpf: '',
    provedorAtual: '',
    satisfacao: '',
    bairro: '',
    velocidade: '',
    valorMensal: '',
    usoInternet: [],
    interesseProposta: '',
    responsavel: ''
  });

  const [responsavelPreenchido, setResponsavelPreenchido] = useState(false);

  const {
    isSubmitting,
    isSubmitted,
    error,
    successMessage,
    submitPesquisa,
    resetForm,
    clearMessages
  } = usePesquisa();

  // Pré-preencher responsável se fornecido na URL
  useEffect(() => {
    if (responsavel && !responsavelPreenchido) {
      const responsavelDecodificado = decodeURIComponent(responsavel);
      setFormData(prev => ({
        ...prev,
        responsavel: responsavelDecodificado
      }));
      setResponsavelPreenchido(true);
    }
  }, [responsavel, responsavelPreenchido]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;
    
    // Aplicar máscara para WhatsApp
    if (field === 'whatsapp') {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // Aplica máscara (XX) XXXXX-XXXX
      if (numbers.length <= 2) {
        processedValue = numbers;
      } else if (numbers.length <= 7) {
        processedValue = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else {
        processedValue = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
      }
    }
    
    // Aplicar máscara para CPF
    if (field === 'cpf') {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // Aplica máscara XXX.XXX.XXX-XX
      if (numbers.length <= 3) {
        processedValue = numbers;
      } else if (numbers.length <= 6) {
        processedValue = `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      } else if (numbers.length <= 9) {
        processedValue = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      } else {
        processedValue = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      usoInternet: prev.usoInternet.includes(option)
        ? prev.usoInternet.filter(item => item !== option)
        : [...prev.usoInternet, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica dos campos obrigatórios
    const requiredFields = [
      { field: 'nome', label: 'Nome' },
      { field: 'whatsapp', label: 'WhatsApp' },
      { field: 'provedorAtual', label: 'Provedor atual' },
      { field: 'satisfacao', label: 'Satisfação' },
      { field: 'bairro', label: 'Bairro' },
      { field: 'valorMensal', label: 'Valor mensal' },
      { field: 'usoInternet', label: 'Uso da internet' },
      { field: 'interesseProposta', label: 'Interesse em proposta' },
      { field: 'responsavel', label: 'Responsável' }
    ];

    const missingFields = requiredFields.filter(({ field }) => {
      const value = formData[field as keyof FormData];
      if (field === 'usoInternet') {
        return !Array.isArray(value) || value.length === 0;
      }
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(f => f.label).join(', ');
      alert(`Por favor, preencha os seguintes campos: ${fieldNames}`);
      return;
    }

    // Validação do WhatsApp (formato básico)
    const whatsappRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!whatsappRegex.test(formData.whatsapp.replace(/\D/g, ''))) {
      alert('Por favor, insira um número de WhatsApp válido');
      return;
    }

    // Validação do WhatsApp (se já existe)
    // Removido a lógica de verificação da API
    // if (whatsappStatus === 'exists') {
    //   alert('Este número de WhatsApp já foi cadastrado em uma pesquisa anterior. Por favor, use um número diferente.');
    //   return;
    // }

    // Validação do CPF (se fornecido)
    // Removido a lógica de verificação da API
    // if (formData.cpf && cpfStatus === 'exists') {
    //   alert('Este CPF já foi cadastrado em uma pesquisa anterior. Por favor, use um CPF diferente ou deixe o campo em branco.');
    //   return;
    // }

    console.log('📝 Enviando formulário:', formData);
    await submitPesquisa(formData);
  };

  const handleVoltar = () => {
    resetForm();
    const responsavelAtual = responsavelPreenchido ? formData.responsavel : '';
    setFormData({
      nome: '',
      whatsapp: '',
      cpf: '',
      provedorAtual: '',
      satisfacao: '',
      bairro: '',
      velocidade: '',
      valorMensal: '',
      usoInternet: [],
      interesseProposta: '',
      responsavel: responsavelAtual
    });
    // setCpfStatus('idle'); // Removido
    // setWhatsappStatus('idle'); // Removido
  };

  // Calcula o progresso do formulário
  const calculateProgress = () => {
    const fields = [
      formData.nome,
      formData.whatsapp,
      formData.provedorAtual,
      formData.satisfacao,
      formData.bairro,
      formData.valorMensal,
      formData.usoInternet.length > 0 ? 'preenchido' : '',
      formData.interesseProposta,
      formData.responsavel
    ];
    
    const filledFields = fields.filter(field => field.trim() !== '').length;
    return (filledFields / fields.length) * 100;
  };

  // Se o formulário foi enviado, mostra a tela de confirmação
  if (isSubmitted) {
    return <ConfirmacaoEnvio onVoltar={handleVoltar} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ajude-nos a conhecer sua cidade!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos planejando expandir nossos serviços de internet e sua opinião é fundamental para entendermos melhor o mercado local.
          </p>
          
          {/* Status da API */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {/* Removido o status da API */}
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Sistema online</span>
            </div>
          </div>
        </motion.div>

                 {/* Formulário */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-white rounded-2xl shadow-xl p-8"
         >
           <ProgressBar progress={calculateProgress()} />
           <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-blue-500" />
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                    placeholder="(11) 99999-9999"
                    required
                  />
                  {/* Removido o status de verificação */}
                </div>
              </div>
            </div>

                         {/* CPF */}
             <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                 <CreditCard className="w-4 h-4 text-purple-500" />
                 CPF (opcional)
               </label>
               <div className="relative">
                 <input
                   type="text"
                   value={formData.cpf}
                   onChange={(e) => handleInputChange('cpf', e.target.value)}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                   placeholder="000.000.000-00"
                 />
                 {/* Removido o status de verificação */}
               </div>
             </div>

            {/* Provedor Atual */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Wifi className="w-4 h-4 text-blue-500" />
                Qual provedor de internet você usa hoje?
              </label>
              <input
                type="text"
                value={formData.provedorAtual}
                onChange={(e) => handleInputChange('provedorAtual', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: Vivo, Claro, Oi, provedor local..."
                required
              />
            </div>

            {/* Satisfação */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ThumbsUp className="w-4 h-4 text-yellow-500" />
                Você está satisfeito com esse provedor?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Muito satisfeito', 'Satisfeito', 'Insatisfeito', 'Muito insatisfeito'].map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="radio"
                      name="satisfacao"
                      value={option}
                      checked={formData.satisfacao === option}
                      onChange={(e) => handleInputChange('satisfacao', e.target.value)}
                      className="mr-2 text-blue-500"
                      required
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-red-500" />
                Qual bairro você mora?
              </label>
              <input
                type="text"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Digite o nome do seu bairro"
                required
              />
            </div>

            {/* Velocidade */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                Sabe qual a velocidade do seu plano?
              </label>
              <input
                type="text"
                value={formData.velocidade}
                onChange={(e) => handleInputChange('velocidade', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Ex: 100 Mbps, 50 Mbps, não sei..."
              />
            </div>

            {/* Valor Mensal */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 text-green-500" />
                Quanto você paga por mês na internet?
              </label>
              <input
                type="text"
                value={formData.valorMensal}
                onChange={(e) => handleInputChange('valorMensal', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Ex: R$ 89,90, R$ 120,00..."
                required
              />
            </div>

            {/* Uso da Internet */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Monitor className="w-4 h-4 text-purple-500" />
                Você usa mais a internet pra quê?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['trabalho', 'jogos online', 'estudos', 'filmes e series', 'celular', 'televisão'].map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.usoInternet.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="mr-2 text-purple-500 rounded"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                ))}
              </div>
              {formData.usoInternet.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Selecione pelo menos uma opção
                </p>
              )}
            </div>

            {/* Interesse em Proposta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Send className="w-4 h-4 text-blue-500" />
                Você teria interesse de receber uma proposta de um provedor novo na cidade?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Sim, tenho interesse', 'Não tenho interesse'].map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="radio"
                      name="interesseProposta"
                      value={option}
                      checked={formData.interesseProposta === option}
                      onChange={(e) => handleInputChange('interesseProposta', e.target.value)}
                      className="mr-2 text-blue-500"
                      required
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Responsável */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-purple-500" />
                Nome do responsável pela pesquisa
                {responsavelPreenchido && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Pré-preenchido
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => handleInputChange('responsavel', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  responsavelPreenchido 
                    ? 'border-green-300 bg-green-50 text-green-800 cursor-not-allowed' 
                    : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder={responsavelPreenchido ? "Responsável definido automaticamente" : "Digite o nome do responsável"}
                required
                readOnly={responsavelPreenchido}
              />
              {responsavelPreenchido && (
                <p className="text-xs text-green-600">
                  ✓ Responsável definido automaticamente via link personalizado
                </p>
              )}
            </div>

                         {/* Botão de Envio */}
             <motion.button
               whileHover={{ scale: (isSubmitting) ? 1 : 1.02 }}
               whileTap={{ scale: (isSubmitting) ? 1 : 0.98 }}
               type="submit"
               disabled={isSubmitting}
               className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg ${
                 isSubmitting
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl text-white'
               }`}
             >
               {isSubmitting ? (
                 <div className="flex items-center justify-center gap-2">
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   Enviando...
                 </div>
               ) : (
                 'Enviar Pesquisa'
               )}
             </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-gray-500"
        >
          <p className="text-sm">
            Suas informações serão tratadas com confidencialidade e utilizadas apenas para fins de pesquisa de mercado.
          </p>
        </motion.div>
      </div>

      {/* Notificações */}
      <Notification
        isOpen={!!successMessage}
        type="success"
        title="Sucesso!"
        message={successMessage || ''}
        onClose={clearMessages}
      />
      
      <Notification
        isOpen={!!error}
        type="error"
        title="Erro"
        message={error || ''}
        onClose={clearMessages}
      />
    </div>
  );
};

export default PesquisaMercado;
