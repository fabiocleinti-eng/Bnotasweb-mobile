# 🔧 Troubleshooting - BnotasWeb Mobile

Guia de resolução de problemas comuns.

## 🚨 Erros de Conexão

### ❌ "Failed to fetch" / "Network request failed"

**Sintoma:** Erro ao fazer login, carregar notas ou qualquer requisição.

**Causas possíveis:**
1. Backend não está rodando
2. URL da API errada no `.env`
3. Porta do backend diferente
4. Firewall bloqueando conexão

**Soluções:**

**1. Verificar se backend está rodando:**
```bash
# Teste diretamente no navegador
http://localhost:3000/api/anotacoes

# Ou use curl
curl http://localhost:3000/api/anotacoes
```

**2. Verificar arquivo `.env`:**
```env
# Deve estar correto
VITE_API_URL=http://localhost:3000/api

# NÃO pode ter espaços ou aspas extras
```

**3. Reiniciar o app após mudar `.env`:**
```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

---

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"

**Sintoma:** Erro no console do navegador mencionando CORS.

**Causa:** Backend não está configurado para aceitar requisições do frontend.

**Solução:**

**No backend (server.js ou app.js):**

```javascript
const cors = require('cors');

// Opção 1: Aceitar todas as origens (APENAS DESENVOLVIMENTO!)
app.use(cors({
  origin: '*',
  credentials: true
}));

// Opção 2: Aceitar origens específicas (RECOMENDADO)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://192.168.1.100:5173'  // Seu IP local
  ],
  credentials: true
}));
```

**Instalar CORS se não estiver instalado:**
```bash
cd backend
npm install cors
```

**Reiniciar o backend após configurar.**

---

## 🔐 Erros de Autenticação

### ❌ "Token inválido" / "Unauthorized"

**Sintoma:** Após login, não consegue acessar as notas.

**Causas possíveis:**
1. Token expirou
2. Backend reiniciou (token perdido)
3. Secret do JWT mudou
4. Header Authorization não está sendo enviado

**Soluções:**

**1. Fazer logout e login novamente:**
```typescript
// No app, clique em "Sair" e faça login novamente
```

**2. Verificar se token está sendo enviado:**
Abra DevTools (F12) → Network → Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**3. Verificar expiração do token no backend:**
```javascript
// backend/auth.js
const token = jwt.sign(
  { id: user.id }, 
  process.env.JWT_SECRET,
  { expiresIn: '7d' }  // Aumentar para 7 dias
);
```

---

### ❌ "Credenciais inválidas" ao fazer login

**Sintoma:** E-mail e senha corretos mas retorna erro.

**Causas possíveis:**
1. Senha com hash diferente
2. E-mail com espaços ou case-sensitive
3. Usuário não existe no banco

**Soluções:**

**1. Criar novo usuário de teste:**
```sql
-- No MySQL/PostgreSQL
SELECT * FROM usuarios WHERE email = 'teste@teste.com';

-- Se não existir, crie via app (tela de cadastro)
```

**2. Verificar hash da senha:**
```javascript
// backend/auth.js
const bcrypt = require('bcrypt');

// Na criação do usuário
const hashedPassword = await bcrypt.hash(senha, 10);

// No login
const isValid = await bcrypt.compare(senha, user.senha);
```

---

## 📱 Problemas Mobile (Celular Físico)

### ❌ Não carrega no celular

**Sintoma:** App abre no PC mas não no celular.

**Causas possíveis:**
1. Celular em Wi-Fi diferente
2. IP errado no `.env`
3. Backend não escutando na rede (apenas localhost)
4. Firewall bloqueando

**Soluções:**

**1. Celular e PC na mesma rede Wi-Fi:**
```
Configurações → Wi-Fi → Mesma rede
```

**2. Descobrir IP correto da máquina:**
```bash
# Windows
ipconfig
# Procure "IPv4 Address" → Ex: 192.168.1.100

# Mac/Linux
ifconfig | grep inet
# Procure inet 192.168.x.x
```

**3. Atualizar `.env` com IP:**
```env
VITE_API_URL=http://192.168.1.100:3000/api
```

**4. Backend escutar em 0.0.0.0 (não apenas localhost):**
```javascript
// backend/server.js
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor acessível na rede: http://0.0.0.0:3000');
});
```

**5. Atualizar CORS no backend:**
```javascript
app.use(cors({
  origin: 'http://192.168.1.100:5173',
  credentials: true
}));
```

**6. Desabilitar firewall temporariamente (Windows):**
```
Painel de Controle → Firewall → Desativar (CUIDADO!)
```

---

## 🚨 Modal de Cobrança Não Aparece

**Sintoma:** Nota urgente não dispara o modal.

**Causas possíveis:**
1. Data do lembrete > 10 minutos no futuro
2. Nota foi "ignorada" nesta sessão
3. Polling não está rodando
4. Data no formato errado

**Soluções:**

**1. Definir lembrete correto:**
```
Data do lembrete deve ser:
- No passado (vencido) OU
- Menos de 10 minutos no futuro
```

**2. Recarregar a página (F5):**
```
Isso limpa a lista de notas "ignoradas"
```

**3. Verificar console:**
```javascript
// Abra DevTools (F12) → Console
// Procure por erros no checkCriticalTasks()
```

**4. Testar manualmente:**
```javascript
// Cole no console do navegador
const now = new Date();
console.log('Agora:', now);

const reminder = new Date(now.getTime() + 5 * 60 * 1000); // +5 minutos
console.log('Lembrete de teste:', reminder.toISOString());

// Use este valor no campo de data
```

---

## 🎨 Problemas de Estilo

### ❌ Estilos não aplicados / CSS quebrado

**Sintoma:** Interface sem cores, botões desalinhados.

**Causas possíveis:**
1. Tailwind não compilado
2. globals.css não importado
3. Classe CSS com typo

**Soluções:**

**1. Verificar importação do globals.css:**
```typescript
// No arquivo main.tsx ou App.tsx
import './styles/globals.css';
```

**2. Limpar cache do Vite:**
```bash
rm -rf node_modules/.vite
npm run dev
```

**3. Verificar sintaxe Tailwind v4:**
```css
/* globals.css */
@import "tailwindcss";  /* NÃO é @tailwind base; */
```

---

## 💾 Problemas com LocalStorage

### ❌ Token ou dados perdidos após reload

**Sintoma:** Faz login mas perde sessão ao recarregar.

**Causas possíveis:**
1. Navegador privado/anônimo
2. LocalStorage bloqueado
3. Erro ao salvar token

**Soluções:**

**1. Não usar modo anônimo/privado**

**2. Verificar se localStorage funciona:**
```javascript
// Cole no console
localStorage.setItem('test', 'ok');
console.log(localStorage.getItem('test')); // Deve mostrar 'ok'
```

**3. Verificar se token está sendo salvo:**
```javascript
// Após login, cole no console
console.log('Token:', localStorage.getItem('bnotas_token'));
console.log('User:', localStorage.getItem('bnotas_user'));
```

**4. Limpar localStorage:**
```javascript
// Cole no console
localStorage.clear();
// Faça login novamente
```

---

## 🐞 Debugging Avançado

### Verificar todas requisições HTTP

**Chrome DevTools:**
1. Abra DevTools (F12)
2. Aba **Network**
3. Filtro: **XHR/Fetch**
4. Recarregue a página
5. Clique em cada requisição para ver:
   - **Headers** (Authorization?)
   - **Response** (erro do backend?)
   - **Status Code** (200, 401, 500?)

### Erros comuns por Status Code:

| Status | Significado | Solução |
|--------|-------------|---------|
| 200 | ✅ OK | Tudo certo |
| 400 | ❌ Bad Request | Dados inválidos enviados |
| 401 | ❌ Unauthorized | Token inválido/expirado |
| 403 | ❌ Forbidden | Sem permissão |
| 404 | ❌ Not Found | Rota não existe no backend |
| 500 | ❌ Server Error | Erro no backend (veja logs) |

---

## 📊 Logs do Backend

**Sempre verifique os logs do servidor Node.js:**

```bash
# Terminal onde o backend está rodando
node server.js

# Procure por:
POST /api/login 401 - "Credenciais inválidas"
GET /api/anotacoes 200 - OK
```

**Adicionar mais logs:**
```javascript
// backend/routes/anotacoes.js
console.log('📝 Requisição recebida:', req.method, req.path);
console.log('👤 User ID:', req.userId);
console.log('📦 Body:', req.body);
```

---

## 🆘 Ainda com Problemas?

### Checklist Final:

- [ ] Backend rodando? (`http://localhost:3000`)
- [ ] CORS habilitado no backend?
- [ ] `.env` configurado corretamente?
- [ ] Token sendo salvo no localStorage?
- [ ] Console sem erros? (F12)
- [ ] Network tab mostra erro? (F12 → Network)
- [ ] Banco de dados acessível?
- [ ] Usuário cadastrado no banco?

### Reiniciar Tudo:

```bash
# 1. Para o frontend (Ctrl+C)
# 2. Para o backend (Ctrl+C)
# 3. Limpa cache
rm -rf node_modules/.vite
# 4. Reinicia backend
cd backend && node server.js
# 5. Reinicia frontend (em outro terminal)
cd frontend && npm run dev
# 6. Limpa localStorage (console)
localStorage.clear()
# 7. Faz login novamente
```

---

## 📚 Recursos Adicionais

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Network Tab Guide](https://developer.chrome.com/docs/devtools/network/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [JWT Debugger](https://jwt.io/)

---

**Se tudo mais falhar, delete o banco e recrie do zero! 🔥**

```sql
DROP DATABASE bnotas;
CREATE DATABASE bnotas;
-- Execute os scripts de criação das tabelas novamente
```
