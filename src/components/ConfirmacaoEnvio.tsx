import { motion } from 'framer-motion';
import { CheckCircle, Heart, Wifi, ArrowLeft, MessageCircle } from 'lucide-react';

interface ConfirmacaoEnvioProps {
  onVoltar: () => void;
}

const ConfirmacaoEnvio = ({ onVoltar }: ConfirmacaoEnvioProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Ícone de Sucesso */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Pesquisa Enviada!
        </motion.h1>

        {/* Mensagem */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
        >
          Obrigado por participar da nossa pesquisa de mercado! 
          Sua pesquisa foi enviada via WhatsApp para nossa equipe.
        </motion.p>

        {/* Aviso WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8"
        >
          <div className="flex items-center gap-3 justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <p className="text-blue-800 font-medium">
              Verifique se o WhatsApp foi aberto em uma nova aba
            </p>
          </div>
        </motion.div>

        {/* Cards de Informação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Expansão</h3>
            <p className="text-sm text-gray-600">Ajudando a expandir nossa rede</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Satisfação</h3>
            <p className="text-sm text-gray-600">Melhorando a experiência do cliente</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Qualidade</h3>
            <p className="text-sm text-gray-600">Oferecendo o melhor serviço</p>
          </div>
        </motion.div>

        {/* Próximos Passos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
        >
          <h3 className="font-semibold text-gray-800 mb-3">O que acontece agora?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Nossa equipe recebeu sua pesquisa via WhatsApp</p>
            <p>• Analisaremos todas as respostas coletadas</p>
            <p>• Identificaremos as necessidades da região</p>
            <p>• Entraremos em contato se você demonstrou interesse</p>
          </div>
        </motion.div>

        {/* Botão Voltar */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onVoltar}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Início
        </motion.button>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-500"
        >
          <p className="text-sm">
            Se você tem alguma dúvida, entre em contato conosco via WhatsApp.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ConfirmacaoEnvio;
