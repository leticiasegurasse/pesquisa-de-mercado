import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        

        {/* Título e Mensagem */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
          </p>
        </motion.div>


        {/* Botões de Ação */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </motion.div>

       
      </div>
    </div>
  );
};

export default NotFound;
