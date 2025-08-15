# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git bash

# Copiar package files primeiro
COPY package*.json ./

# Copiar script de build
COPY build.sh ./
RUN chmod +x build.sh

# Executar script de build personalizado
RUN ./build.sh

# Etapa de produção
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar arquivos copiados
RUN ls -la /usr/share/nginx/html/

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
