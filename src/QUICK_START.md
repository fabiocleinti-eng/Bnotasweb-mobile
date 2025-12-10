# 🚀 Quick Start - BnotasWeb Mobile

Guia rápido para começar a usar o app mobile.

## ✅ Pré-requisitos

1. **Backend rodando** em `http://localhost:3000` (ou outra URL)
2. **CORS habilitado** no backend
3. **Node.js** instalado

## 📦 Instalação

O Figma Make já gerencia as dependências automaticamente, mas se precisar instalar manualmente:

```bash
npm install
```

## ⚙️ Configuração

### 1. Criar arquivo `.env`

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` e ajuste a URL da API:

```env
# Desenvolvimento local
VITE_API_URL=http://localhost:3000/api

# Testar no celular (substitua pelo seu IP)
# VITE_API_URL=http://192.168.1.100:3000/api

# Produção
# VITE_API_URL=https://sua-api.com/api
```

### 2. Verificar Backend

Certifique-se que o backend tem CORS habilitado. Veja detalhes em [`BACKEND_SETUP.md`](./BACKEND_SETUP.md).

## 🏃 Executar

```bash
npm run dev
```

O app estará disponível em: `http://localhost:5173`

## 📱 Testar no Celular

### Método 1: Mesmo Wi-Fi

1. Descubra o IP da sua máquina:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig | grep inet
   ```

2. Ajuste o `.env`:
   ```env
   VITE_API_URL=http://192.168.1.100:3000/api
   ```

3. Configure CORS no backend para aceitar seu IP

4. No celular, acesse: `http://192.168.1.100:5173`

### Método 2: ngrok (Túnel)

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 5173
ngrok http 5173

# Use a URL gerada (ex: https://abc123.ngrok.io)
```

## 🧪 Testar Funcionalidades

### 1. Criar Conta

1. Abra o app
2. Clique em "Não tem conta? Cadastre-se"
3. Preencha:
   - Nome
   - Sobrenome
   - E-mail
   - Senha forte (8+ chars, 1 maiúscula, 1 especial)
4. Clique em "CADASTRAR"

### 2. Fazer Login

1. Digite e-mail e senha
2. (Opcional) Marque "Lembrar-me"
3. Clique em "ENTRAR"

### 3. Criar Nota

1. Clique no botão **+** (canto inferior direito)
2. Digite título e conteúdo
3. (Opcional) Escolha uma cor
4. (Opcional) Defina um lembrete
5. Clique em "SALVAR NOTA"

### 4. Testar Modal de Cobrança 🚨

1. Crie uma nota com lembrete para **5 minutos no futuro**
2. Aguarde 5 minutos (ou mais)
3. O modal deve aparecer automaticamente
4. Teste as 3 ações:
   - ✅ **Já Realizei** → Remove o lembrete
   - 📅 **Preciso Reagendar** → Abre a nota (+1 no contador)
   - 🗑️ **Excluir Nota** → Remove permanentemente

### 5. Testar Tabs

- **Todas**: Vencidos → Urgentes → Normais
- **Urgentes**: Apenas vencidos + com prazo < 10 min
- **Favoritas**: Apenas notas com ⭐

### 6. Testar Busca

Digite no campo de busca para filtrar por título ou conteúdo.

## 🐛 Problemas Comuns

### ❌ "Failed to fetch"

**Causa:** Backend não está rodando ou URL errada.

**Solução:**
1. Verifique se o backend está rodando: `http://localhost:3000`
2. Verifique a URL no `.env`

### ❌ "CORS policy blocked"

**Causa:** Backend não tem CORS habilitado.

**Solução:**
```javascript
// No backend
const cors = require('cors');
app.use(cors({ origin: '*', credentials: true }));
```

### ❌ Modal não aparece

**Causa:** Nota não está com status "urgente" ou foi ignorada nesta sessão.

**Solução:**
- Defina lembrete para **< 10 minutos** no futuro
- Recarregue a página (F5)

### ❌ "Token inválido"

**Causa:** Token expirou ou backend reiniciou.

**Solução:**
- Faça logout e login novamente

## 📊 Estrutura de Testes

### Fluxo Completo:

1. ✅ Cadastro
2. ✅ Login
3. ✅ Criar 5 notas (diferentes cores)
4. ✅ Favoritar 2 notas
5. ✅ Definir lembrete em 1 nota (5 min futuro)
6. ✅ Definir lembrete em 1 nota (data passada)
7. ✅ Verificar tab "Urgentes" → deve ter 2 notas
8. ✅ Verificar tab "Favoritas" → deve ter 2 notas
9. ✅ Buscar por termo → deve filtrar
10. ✅ Aguardar modal aparecer
11. ✅ Reagendar nota → contador deve incrementar
12. ✅ Excluir nota
13. ✅ Logout

## 🎯 Próximos Passos

- [ ] Adicionar mais cores personalizadas
- [ ] Implementar tags/categorias
- [ ] Adicionar anexos (imagens)
- [ ] Transformar em PWA
- [ ] Adicionar notificações push
- [ ] Modo escuro

## 📚 Documentação Adicional

- [`README.md`](./README.md) - Visão geral completa
- [`BACKEND_SETUP.md`](./BACKEND_SETUP.md) - Configuração detalhada do backend

## 💬 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do backend
3. Revise a documentação do backend

---

**Boas anotações! 📝✨**
