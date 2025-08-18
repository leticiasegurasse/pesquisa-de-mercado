# 🎯 Pesquisa de Mercado - Frontend

Frontend React + TypeScript para o sistema de Pesquisa de Mercado da G2 Telecom.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **React Hook Form** - Formulários

## 📋 Funcionalidades

- ✅ **Autenticação** - Login/Logout com JWT
- ✅ **Dashboard** - Estatísticas e visão geral
- ✅ **Pesquisas** - CRUD completo
- ✅ **Filtros Avançados** - Busca por múltiplos critérios
- ✅ **Validações** - Verificação de WhatsApp e CPF
- ✅ **Responsivo** - Interface mobile-friendly

## 🔄 Migração para MongoDB

Este frontend foi migrado para usar o novo backend MongoDB. Veja o [Guia de Migração](MIGRATION_GUIDE.md) para detalhes.

### Backends Suportados

- **🆕 MongoDB** (Recomendado) - `back-mongo/`
- **📊 PostgreSQL** (Legado) - `backend/`

## 🚀 Como Executar

### 1. **Configurar Ambiente**

```bash
# Executar script de configuração
./setup-env.bat

# Ou manualmente
cp env.example .env
```

### 2. **Instalar Dependências**

```bash
npm install
```

### 3. **Iniciar Backend MongoDB**

```bash
# Em outro terminal
cd ../back-mongo
npm install
npm run dev
```

### 4. **Iniciar Frontend**

```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# URL da API Backend
VITE_API_URL=http://localhost:3001

# Configurações da aplicação
VITE_APP_NAME=Pesquisa de Mercado
VITE_APP_VERSION=2.0.0
```

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
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
├── hooks/          # Custom hooks
├── config/         # Configurações
├── lib/            # Bibliotecas
├── types/          # Tipos TypeScript
└── styles/         # Estilos globais
```

## 🔐 Autenticação

O sistema usa JWT para autenticação:

- **Login**: `/api/auth/login`
- **Refresh**: `/api/auth/refresh`
- **Profile**: `/api/auth/profile`
- **Validate**: `/api/auth/validate`

## 📊 API Endpoints

### Pesquisas
- `GET /api/pesquisas` - Listar pesquisas
- `POST /api/pesquisas` - Criar pesquisa
- `GET /api/pesquisas/estatisticas` - Estatísticas
- `GET /api/pesquisas/verificar-whatsapp/:whatsapp` - Verificar WhatsApp
- `GET /api/pesquisas/verificar-cpf/:cpf` - Verificar CPF

### Filtros
- `GET /api/pesquisas/interessados` - Apenas interessados
- `GET /api/pesquisas/satisfeitos` - Apenas satisfeitos
- `GET /api/pesquisas/nome/:nome` - Por nome
- `GET /api/pesquisas/bairro/:bairro` - Por bairro

## 🐛 Troubleshooting

### Erro de CORS
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health
```

### Erro de Conexão
```bash
# Verificar variáveis de ambiente
# Verificar logs do backend
```

### Limpar Cache
```bash
# Limpar localStorage
localStorage.clear()
```

## 📚 Documentação

- [Guia de Migração](MIGRATION_GUIDE.md) - Como migrar para MongoDB
- [Backend MongoDB](../back-mongo/README.md) - Documentação do backend
- [Coleção Postman](../back-mongo/postman_collection.json) - Testes da API

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado da G2 Telecom.

---

**🎉 Frontend configurado e pronto para usar com o backend MongoDB!**
