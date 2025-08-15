import { motion } from 'framer-motion';
import { Wifi, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Pesquisa de Mercado</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Nova Localidade
              </p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                ⏱️ Leva apenas 2 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
