import { useState } from 'react';
import pesquisaService, { type FormData } from '../services/pesquisaService';

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
      console.log('🚀 Iniciando envio da pesquisa...');
      const response = await pesquisaService.criarPesquisa(formData);
      
      if (response.success) {
        setIsSubmitted(true);
        setSuccessMessage(response.message || 'Pesquisa enviada com sucesso!');
        console.log('✅ Pesquisa criada com sucesso:', response.data);
        
        // Não limpar automaticamente - deixar o usuário controlar
        // setTimeout(() => {
        //   resetForm();
        // }, 3000);
      } else {
        setError(response.message || 'Erro ao enviar pesquisa');
        console.error('❌ Erro na resposta da API:', response);
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
