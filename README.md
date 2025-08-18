# 🎯 Pesquisa de Mercado - Frontend

Frontend React + TypeScript para o sistema de Pesquisa de Mercado da G2 Telecom.

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite 6** - Build tool
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 📋 Funcionalidades

- ✅ **Formulário de Pesquisa** - Coleta de dados completa
- ✅ **Envio via WhatsApp** - Integração direta com WhatsApp Web
- ✅ **Validações Locais** - Verificação de campos obrigatórios
- ✅ **Máscaras de Entrada** - WhatsApp e CPF formatados
- ✅ **Responsivo** - Interface mobile-friendly
- ✅ **Animações** - Experiência visual fluida

## 🔄 Sistema WhatsApp

Este frontend foi modificado para enviar pesquisas diretamente via WhatsApp, eliminando a necessidade de um backend.

### Como Funciona

1. **Preenchimento**: Usuário preenche o formulário
2. **Validação**: Sistema valida todos os campos obrigatórios
3. **Formatação**: Dados são formatados em mensagem estruturada
4. **Envio**: WhatsApp Web é aberto com a mensagem pré-formatada
5. **Confirmação**: Usuário confirma o envio no WhatsApp

### Formato da Mensagem

```
🆕 NOVA PESQUISA DE MERCADO

👤 Nome: [Nome do Cliente]
📱 WhatsApp: [WhatsApp]
📄 CPF: [CPF ou Não informado]
🌐 Provedor Atual: [Provedor]
😊 Satisfação: [Nível de Satisfação]
📍 Bairro: [Bairro]
⚡ Velocidade: [Velocidade]
💰 Valor Mensal: [Valor]
💻 Uso da Internet: [Usos selecionados]
🎯 Interesse em Proposta: [Interesse]
👨‍💼 Responsável: [Responsável]

━━━━━━━━━━━━━━━━━━━━
📊 Dados coletados em: [Data/Hora]
🏢 Sistema: Pesquisa de Mercado G2 Telecom
```

## 🚀 Como Executar

### 1. **Instalar Dependências**

```bash
npm install
```

### 2. **Iniciar Frontend**

```bash
npm run dev
```

### 3. **Acessar Aplicação**

Abra `http://localhost:5173` no navegador.

## 🔧 Configuração

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes React
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── ConfirmacaoEnvio.tsx # Tela de confirmação
│   ├── ProgressBar.tsx # Barra de progresso
│   └── Notification.tsx # Sistema de notificações
├── pages/          # Páginas da aplicação
│   ├── PesquisaMercado.tsx # Formulário principal
│   ├── Login.tsx       # Autenticação (legado)
│   ├── Dashboard.tsx   # Dashboard (legado)
│   └── NotFound.tsx    # Página 404
├── hooks/          # Custom hooks
│   ├── usePesquisa.ts # Lógica de pesquisas
│   └── useScrollToTop.ts # Scroll automático
├── utils/          # Utilitários
│   └── whatsappUtils.ts # Funções do WhatsApp
├── config/         # Configurações
│   ├── api.ts         # Configuração da API (legado)
│   └── routes.ts      # Definição de rotas
└── styles/         # Estilos globais
```

## 📊 Campos da Pesquisa

### Campos Obrigatórios
- **Nome**: Nome completo do cliente
- **WhatsApp**: Número de contato (formato: (XX) XXXXX-XXXX)
- **Provedor Atual**: Provedor de internet atual
- **Satisfação**: Nível de satisfação com o serviço atual
- **Bairro**: Bairro onde reside
- **Valor Mensal**: Valor pago mensalmente
- **Uso da Internet**: Múltipla escolha (trabalho, jogos, etc.)
- **Interesse em Proposta**: Se tem interesse em proposta da G2
- **Responsável**: Nome do responsável pela pesquisa

### Campos Opcionais
- **CPF**: CPF do cliente (formato: XXX.XXX.XXX-XX)
- **Velocidade**: Velocidade atual do plano

## 🎨 Interface e UX

**Design System:**
- Gradientes azul/cyan para branding G2 Telecom
- Animações suaves com Framer Motion
- Interface responsiva e moderna
- Componentes com Tailwind CSS
- Sistema de notificações toast

**Experiência do Usuário:**
- Formulário com progresso visual
- Validações em tempo real
- Máscaras automáticas para WhatsApp e CPF
- Feedback imediato
- Integração direta com WhatsApp

## 🔐 Validações

### WhatsApp
- Formato obrigatório: (XX) XXXXX-XXXX
- Validação de números válidos
- Máscara automática durante digitação

### CPF
- Formato opcional: XXX.XXX.XXX-XX
- Máscara automática durante digitação
- Campo não obrigatório

### Outros Campos
- Nome: obrigatório, mínimo 2 caracteres
- Provedor: obrigatório
- Satisfação: obrigatório
- Bairro: obrigatório
- Valor: obrigatório
- Uso da Internet: pelo menos uma opção
- Interesse: obrigatório
- Responsável: obrigatório

## 🐛 Troubleshooting

### WhatsApp não abre
```bash
# Verificar se o navegador permite popups
# Verificar se o WhatsApp Web está acessível
```

### Formulário não envia
```bash
# Verificar se todos os campos obrigatórios estão preenchidos
# Verificar se o WhatsApp está funcionando
```

### Problemas de Validação
```bash
# Verificar formato do WhatsApp: (XX) XXXXX-XXXX
# Verificar formato do CPF: XXX.XXX.XXX-XX
```

## 📚 Documentação

- [WhatsApp Business API](https://developers.whatsapp.com/) - Documentação oficial
- [React Router](https://reactrouter.com/) - Roteamento
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Framer Motion](https://www.framer.com/motion/) - Animações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado da G2 Telecom.

---

**🎉 Frontend configurado para envio via WhatsApp - Sem necessidade de backend!**
