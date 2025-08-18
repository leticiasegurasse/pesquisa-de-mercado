@echo off
echo Configurando ambiente do Frontend...

REM Criar arquivo .env se não existir
if not exist ".env" (
    echo Criando arquivo .env...
    copy env.example .env
    echo Arquivo .env criado com sucesso!
) else (
    echo Arquivo .env já existe.
)

echo.
echo Configuração concluída!
echo.
echo Para iniciar o frontend:
echo npm run dev
echo.
echo Para iniciar o backend MongoDB (em outro terminal):
echo cd ../back-mongo
echo npm run dev
echo.
echo Para iniciar o backend PostgreSQL (legado):
echo cd ../backend
echo npm run dev
echo.
pause
