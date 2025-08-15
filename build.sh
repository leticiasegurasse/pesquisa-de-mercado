#!/bin/bash

echo "🧹 Limpando cache e arquivos antigos..."
rm -rf node_modules
rm -rf dist
rm -rf .vite

echo "📁 Verificando arquivos necessários..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    exit 1
fi

if [ ! -f "tsconfig.json" ]; then
    echo "❌ tsconfig.json não encontrado!"
    exit 1
fi

if [ ! -f "vite.config.ts" ]; then
    echo "❌ vite.config.ts não encontrado!"
    exit 1
fi

echo "✅ Todos os arquivos necessários encontrados!"

echo "📦 Instalando dependências..."
npm install

echo "🔨 Fazendo build da aplicação..."
npm run build

echo "✅ Build concluído!"
echo "📁 Conteúdo da pasta dist:"
ls -la dist/

if [ ! -d "dist" ]; then
    echo "❌ Pasta dist não foi criada!"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html não foi criado!"
    exit 1
fi

echo "🚀 Pronto para deploy!"
