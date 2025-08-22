import { useState } from 'react';
import { type FormData } from '../utils/whatsappUtils';
import pesquisaService from '../services/pesquisaService';

interface UsePesquisaReturn {
  // Estados
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Funções
  submitPesquisa: (formData: FormData) => Promise<void>;
  resetForm: () => void;
  clearMessages: () => void;
}

export const usePesquisa = (): UsePesquisaReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitPesquisa = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('🚀 Iniciando envio da pesquisa para a API...');
      
      // Enviar para a API do backend
      const response = await pesquisaService.criarPesquisa(formData);
      
      if (response.success) {
        console.log('✅ Pesquisa enviada com sucesso para a API!');
        setIsSubmitted(true);
        setSuccessMessage('Pesquisa enviada com sucesso! Obrigado por participar.');
      } else {
        // Tratar erros específicos da API
        if (response.error === 'WHATSAPP_DUPLICATE') {
          setError('Este número de WhatsApp já foi cadastrado em uma pesquisa anterior. Cada número pode participar apenas uma vez.');
        } else if (response.error === 'CPF_DUPLICATE') {
          setError('Este CPF já foi cadastrado em uma pesquisa anterior. Cada CPF pode participar apenas uma vez.');
        } else if (response.error === 'NETWORK_ERROR') {
          setError('Erro de conexão. Verifique sua internet e tente novamente.');
        } else {
          setError(response.message || 'Erro ao enviar pesquisa. Tente novamente.');
        }
        console.error('❌ Erro na API:', response.message);
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao enviar pesquisa';
      setError(errorMessage);
      console.error('❌ Erro ao enviar pesquisa:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError(null);
    setSuccessMessage(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    isSubmitting,
    isSubmitted,
    error,
    successMessage,
    submitPesquisa,
    resetForm,
    clearMessages,
  };
};
