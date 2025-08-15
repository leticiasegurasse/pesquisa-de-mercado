#!/bin/bash

echo "🧹 Limpando cache e arquivos antigos..."
rm -rf node_modules
rm -rf dist
rm -rf .vite

echo "📦 Instalando dependências..."
npm install

echo "🔨 Fazendo build da aplicação..."
npm run build

echo "✅ Build concluído!"
echo "📁 Conteúdo da pasta dist:"
ls -la dist/

echo "🚀 Pronto para deploy!"
