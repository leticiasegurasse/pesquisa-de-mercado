import { useState } from 'react';
import { type FormData, formatWhatsAppMessage, sendToWhatsApp, validateFormData } from '../utils/whatsappUtils';

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
      console.log('🚀 Iniciando envio da pesquisa via WhatsApp...');
      
      // Validar dados do formulário
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        setError(`Por favor, corrija os seguintes erros:\n${validation.errors.join('\n')}`);
        return;
      }

      // Formatar mensagem para WhatsApp
      const message = formatWhatsAppMessage(formData);
      console.log('📱 Mensagem formatada:', message);
      
      // Enviar para WhatsApp
      sendToWhatsApp(message);
      
      // Marcar como enviado
      setIsSubmitted(true);
      setSuccessMessage('Pesquisa enviada com sucesso! O WhatsApp será aberto em uma nova aba.');
      console.log('✅ Pesquisa enviada via WhatsApp com sucesso!');
      
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
