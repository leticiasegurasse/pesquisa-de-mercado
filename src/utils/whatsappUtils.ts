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

export const formatWhatsAppMessage = (formData: FormData): string => {
  const now = new Date();
  const dataFormatada = now.toLocaleDateString('pt-BR');
  const horaFormatada = now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  const usoInternetFormatado = formData.usoInternet.join(', ');
  const cpfFormatado = formData.cpf ? formData.cpf : 'Não informado';

  return `🆕 NOVA PESQUISA DE MERCADO

👤 Nome: ${formData.nome}
📱 WhatsApp: ${formData.whatsapp}
📄 CPF: ${cpfFormatado}
🌐 Provedor Atual: ${formData.provedorAtual}
😊 Satisfação: ${formData.satisfacao}
📍 Bairro: ${formData.bairro}
⚡ Velocidade: ${formData.velocidade || 'Não informado'}
💰 Valor Mensal: ${formData.valorMensal}
💻 Uso da Internet: ${usoInternetFormatado}
🎯 Interesse em Proposta: ${formData.interesseProposta}
👨‍💼 Responsável: ${formData.responsavel}

━━━━━━━━━━━━━━━━━━━━
📊 Dados coletados em: ${dataFormatada}, ${horaFormatada}
🏢 Sistema: Pesquisa de Mercado G2 Telecom`;
};

export const sendToWhatsApp = (message: string, phoneNumber: string = '22996057202'): void => {
  // Formatar o número do telefone (remover caracteres especiais)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Codificar a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Criar URL do WhatsApp Web
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
  
  // Abrir WhatsApp Web em nova aba
  window.open(whatsappUrl, '_blank');
};

export const validateFormData = (formData: FormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validações básicas
  if (!formData.nome.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (!formData.whatsapp.trim()) {
    errors.push('WhatsApp é obrigatório');
  } else {
    // Validar formato do WhatsApp
    const whatsappRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!whatsappRegex.test(formData.whatsapp.replace(/\D/g, ''))) {
      errors.push('WhatsApp deve ter um formato válido');
    }
  }

  if (!formData.provedorAtual.trim()) {
    errors.push('Provedor atual é obrigatório');
  }

  if (!formData.satisfacao.trim()) {
    errors.push('Satisfação é obrigatória');
  }

  if (!formData.bairro.trim()) {
    errors.push('Bairro é obrigatório');
  }

  if (!formData.valorMensal.trim()) {
    errors.push('Valor mensal é obrigatório');
  }

  if (formData.usoInternet.length === 0) {
    errors.push('Selecione pelo menos um uso da internet');
  }

  if (!formData.interesseProposta.trim()) {
    errors.push('Interesse em proposta é obrigatório');
  }

  if (!formData.responsavel.trim()) {
    errors.push('Responsável é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
