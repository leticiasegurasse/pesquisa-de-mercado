# 📱 Instruções - Sistema WhatsApp

## 🎯 Como Funciona

O sistema foi modificado para enviar pesquisas diretamente via WhatsApp, eliminando a necessidade de um backend.

### 📋 Passo a Passo

1. **Acesse o formulário**: Abra a aplicação no navegador
2. **Preencha os dados**: Complete todos os campos obrigatórios
3. **Clique em "Enviar Pesquisa"**: O sistema validará os dados
4. **WhatsApp será aberto**: Uma nova aba abrirá com o WhatsApp Web
5. **Confirme o envio**: Clique em "Enviar" no WhatsApp

### 🔧 Configuração do Número

O número padrão configurado é: **22996057202**

Para alterar o número, edite o arquivo `src/utils/whatsappUtils.ts`:

```typescript
export const sendToWhatsApp = (message: string, phoneNumber: string = '22996057202'): void => {
  // Altere o número aqui
}
```

### 📊 Formato da Mensagem

A mensagem será formatada automaticamente com:

- ✅ Emojis para melhor visualização
- ✅ Dados organizados por categoria
- ✅ Data e hora automáticas
- ✅ Identificação do sistema

### 🛠️ Validações

O sistema valida:

- **Campos obrigatórios**: Nome, WhatsApp, Provedor, etc.
- **Formato do WhatsApp**: (XX) XXXXX-XXXX
- **Formato do CPF**: XXX.XXX.XXX-XX (opcional)
- **Múltipla escolha**: Pelo menos um uso da internet

### 🚨 Problemas Comuns

#### WhatsApp não abre
- Verifique se o navegador permite popups
- Teste se o WhatsApp Web está acessível
- Verifique a conexão com a internet

#### Formulário não envia
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o WhatsApp está funcionando
- Verifique se não há erros de validação

#### Mensagem não aparece
- Aguarde alguns segundos para o WhatsApp carregar
- Verifique se o número está correto
- Teste manualmente o número no WhatsApp

### 📱 Teste Manual

Para testar se o número está funcionando:

1. Abra o WhatsApp
2. Digite: `22996057202`
3. Envie uma mensagem de teste
4. Confirme se recebeu a resposta

### 🔄 Backup

Se o WhatsApp não funcionar, você pode:

1. Copiar a mensagem formatada
2. Enviar manualmente via WhatsApp
3. Salvar os dados em um arquivo local

### 📞 Suporte

Em caso de problemas:

1. Verifique os logs do console (F12)
2. Teste em outro navegador
3. Verifique a conectividade
4. Entre em contato com o suporte técnico

---

**✅ Sistema configurado e pronto para uso!**
