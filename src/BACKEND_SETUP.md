# 🔧 Configuração do Backend para BnotasWeb Mobile

Este documento explica como configurar o backend Node.js/Express para funcionar com o app mobile.

## ⚠️ Requisitos Críticos

### 1. CORS (Cross-Origin Resource Sharing)

O backend **DEVE** aceitar requisições do app mobile. Adicione o middleware CORS:

```bash
npm install cors
```

**Arquivo: `server.js` ou `app.js`**

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// ===== CONFIGURAÇÃO CORS =====
app.use(cors({
  origin: [
    'http://localhost:5173',      // Vite dev (React)
    'http://localhost:3001',      // Porta alternativa
    'http://192.168.1.100:5173',  // IP local para testar no celular
    'https://bnotas-mobile.vercel.app'  // Produção (quando fizer deploy)
  ],
  credentials: true  // Permite envio de cookies e headers de autenticação
}));

// OU durante desenvolvimento, pode aceitar tudo (INSEGURO para produção!):
// app.use(cors({ origin: '*', credentials: true }));

app.use(express.json());

// ... resto do código
```

---

## 🛣️ Endpoints Necessários

O app mobile espera estas rotas:

### **Autenticação**

#### `POST /api/login`
**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte@123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "nome": "João",
    "sobrenome": "Silva"
  }
}
```

**Response (401) - Erro:**
```json
{
  "error": {
    "message": "Credenciais inválidas"
  }
}
```

---

#### `POST /api/usuarios` (Registro)
**Request:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "telefone": "(11) 99999-9999",
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte@123"
}
```

**Response (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com"
  }
}
```

---

#### `POST /api/forgot-password`
**Request:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Response (200):**
```json
{
  "message": "E-mail de recuperação enviado"
}
```

---

#### `POST /api/reset-password`
**Request:**
```json
{
  "token": "abc123token",
  "newPassword": "NovaSenha@456"
}
```

**Response (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

### **Notas (CRUD)**

**Todas as rotas abaixo precisam do header:**
```
Authorization: Bearer {token}
```

#### `GET /api/anotacoes`
**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Reunião com cliente",
    "conteudo": "<p>Discutir proposta do projeto...</p>",
    "favorita": true,
    "cor": "#fff9c4",
    "dataCriacao": "2024-01-15T10:30:00.000Z",
    "dataModificacao": "2024-01-15T14:20:00.000Z",
    "dataLembrete": "2024-01-16T09:00:00.000Z",
    "qtdReagendamentos": 2
  }
]
```

---

#### `POST /api/anotacoes`
**Request:**
```json
{
  "titulo": "Nova Tarefa",
  "conteudo": "<p>Descrição da tarefa</p>",
  "favorita": false,
  "cor": "#ffcdd2",
  "dataLembrete": "2024-01-20T15:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": 5,
  "titulo": "Nova Tarefa",
  "conteudo": "<p>Descrição da tarefa</p>",
  "favorita": false,
  "cor": "#ffcdd2",
  "dataCriacao": "2024-01-15T10:30:00.000Z",
  "dataLembrete": "2024-01-20T15:00:00.000Z",
  "qtdReagendamentos": 0
}
```

---

#### `PUT /api/anotacoes/:id`
**Request:**
```json
{
  "titulo": "Tarefa Atualizada",
  "conteudo": "<p>Novo conteúdo</p>",
  "favorita": true,
  "cor": "#c8e6c9",
  "dataLembrete": "2024-01-21T10:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": 5,
  "titulo": "Tarefa Atualizada",
  "conteudo": "<p>Novo conteúdo</p>",
  "favorita": true,
  "cor": "#c8e6c9",
  "dataModificacao": "2024-01-15T16:45:00.000Z",
  "dataLembrete": "2024-01-21T10:00:00.000Z",
  "qtdReagendamentos": 3
}
```

**⚠️ IMPORTANTE:** Quando `dataLembrete` é modificada, incremente `qtdReagendamentos + 1` no backend!

---

#### `DELETE /api/anotacoes/:id`
**Response (204):** *(Sem conteúdo)*

---

## 🔐 Middleware de Autenticação

Exemplo de middleware para proteger rotas:

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: { message: 'Token não fornecido' } });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Anexa o ID do usuário ao request
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Token inválido' } });
  }
}

// Aplicar nas rotas protegidas:
app.get('/api/anotacoes', authMiddleware, (req, res) => {
  // req.userId está disponível aqui
  // Buscar apenas notas do usuário logado
});
```

---

## 📊 Schema do Banco de Dados

### Tabela: `usuarios`
```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100),
  telefone VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL, -- Hash bcrypt
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: `anotacoes`
```sql
CREATE TABLE anotacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT,
  favorita BOOLEAN DEFAULT FALSE,
  cor VARCHAR(20) DEFAULT '#fff9c4',
  data_lembrete DATETIME NULL,
  qtd_reagendamentos INT DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

## 🧪 Testar Backend

Use **Postman** ou **Insomnia** para testar os endpoints:

1. **Criar usuário**:
   - `POST http://localhost:3000/api/usuarios`
   - Body: `{ "email": "teste@teste.com", "senha": "Teste@123", "nome": "Teste" }`

2. **Fazer login**:
   - `POST http://localhost:3000/api/login`
   - Body: `{ "email": "teste@teste.com", "senha": "Teste@123" }`
   - Copie o `token` da resposta

3. **Criar nota**:
   - `POST http://localhost:3000/api/anotacoes`
   - Header: `Authorization: Bearer {token}`
   - Body: `{ "titulo": "Teste", "conteudo": "Conteúdo", "favorita": false }`

4. **Listar notas**:
   - `GET http://localhost:3000/api/anotacoes`
   - Header: `Authorization: Bearer {token}`

---

## 📱 Testar no Celular Físico

### 1. Descobrir IP da sua máquina

**Windows:**
```bash
ipconfig
# Procure por "IPv4 Address" na rede Wi-Fi
# Ex: 192.168.1.100
```

**macOS/Linux:**
```bash
ifconfig | grep inet
# Procure pelo IP que começa com 192.168
```

### 2. Rodar backend acessível na rede

```bash
# Certifique-se que o servidor escuta em 0.0.0.0, não apenas localhost
node server.js --host 0.0.0.0

# Ou no código:
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na rede: http://0.0.0.0:3000');
});
```

### 3. Atualizar CORS

```javascript
app.use(cors({
  origin: 'http://192.168.1.100:5173', // IP da sua máquina
  credentials: true
}));
```

### 4. Atualizar app mobile

No arquivo `.env`:
```env
VITE_API_URL=http://192.168.1.100:3000/api
```

### 5. Conectar celular na mesma rede Wi-Fi

- Celular e computador devem estar na **mesma rede Wi-Fi**
- Acesse no navegador do celular: `http://192.168.1.100:5173`

---

## 🚀 Deploy em Produção

### Backend (Railway/Render/Heroku)

1. Fazer deploy do backend
2. Obter URL: `https://bnotas-api.railway.app`
3. Configurar variáveis de ambiente:
   - `JWT_SECRET=seu_segredo_aqui`
   - `DATABASE_URL=mysql://...`
   - `FRONTEND_URL=https://bnotas-mobile.vercel.app`

### Frontend (Vercel/Netlify)

1. Criar `.env.production`:
```env
VITE_API_URL=https://bnotas-api.railway.app/api
```

2. Fazer deploy
3. Atualizar CORS no backend com a URL final

---

## ❓ Problemas Comuns

### ❌ Erro: "CORS policy blocked"
**Solução:** Adicione o middleware `cors` no backend.

### ❌ Erro: "Network request failed"
**Solução:** Verifique se o backend está rodando e a URL está correta.

### ❌ Erro: "Token inválido"
**Solução:** O token JWT expirou ou o secret não está configurado.

### ❌ Não funciona no celular
**Solução:** 
- Celular e PC na mesma Wi-Fi?
- Backend escutando em `0.0.0.0`?
- IP correto no `.env`?
- CORS aceita o IP?

---

## 📞 Suporte

Se precisar de ajuda, verifique:
1. Console do navegador (F12) → erros JavaScript
2. Terminal do backend → erros de servidor
3. Network tab → requisições HTTP falhando

---

**Backend configurado corretamente = App funcionando perfeitamente! 🚀**
