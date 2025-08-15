@echo off
echo Configurando ambiente do Frontend...

REM Criar arquivo .env se não existir
if not exist ".env" (
    echo Criando arquivo .env...
    copy env.config .env
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
echo Para iniciar o backend (em outro terminal):
echo cd ../backend
echo npm run dev
echo.
pause
