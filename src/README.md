# 📱 BnotasWeb Mobile

Versão mobile do **BnotasWeb** - Sistema de anotações estilo Post-it com cobrança ativa de prazos.

## 🎯 Conceito

Um aplicativo de notas diferenciado que **não te deixa procrastinar**. Se você define um prazo, o sistema vai te cobrar (com modal bloqueante) até que você conclua, reagende ou exclua a tarefa.

## ✨ Funcionalidades

### 📝 Gestão de Notas
- ✅ Criar, editar e excluir notas
- ✅ Editor de texto rico (negrito, itálico, sublinhado, cores)
- ✅ 13 cores de Post-it disponíveis
- ✅ Sistema de favoritos ⭐

### ⏰ Sistema de Lembretes
- 🚨 **Alertas Urgentes**: Notas que vencem em menos de 10 minutos
- 💀 **Vencidos**: Tarefas com prazo expirado
- 📅 **Reagendamento**: Contador de quantas vezes você procrastinou
- 🔔 **Modal Bloqueante**: Tela de cobrança quando o prazo se aproxima

### 🎨 Interface Mobile-First
- 📱 Design otimizado para telas touch
- 🔄 Pull to refresh
- 🗂️ Bottom tabs (Todas / Urgentes / Favoritas)
- ➕ FAB (Floating Action Button) para criar notas
- 🎨 Animações suaves e feedback visual

### 🔐 Autenticação
- Login/Registro com validação forte de senha
- Recuperação de senha por e-mail
- Proteção de rotas
- Token JWT

## 🏗️ Estrutura do Projeto

```
/
├── config/
│   └── api.ts                  # Configuração da API
├── types/
│   └── note.ts                 # Interfaces TypeScript
├── services/
│   ├── authService.ts          # Serviço de autenticação
│   └── noteService.ts          # Serviço de notas
├── utils/
│   └── noteHelpers.ts          # Funções auxiliares
├── components/
│   ├── LoginScreen.tsx         # Tela de login/registro
│   ├── Dashboard.tsx           # Lista de notas
│   ├── NoteCard.tsx            # Card de nota
│   ├── NoteDetail.tsx          # Detalhes da nota
│   ├── UrgentModal.tsx         # Modal de cobrança
│   ├── BottomTabs.tsx          # Navegação inferior
│   └── ResetPasswordScreen.tsx # Redefinir senha
├── styles/
│   └── globals.css             # Estilos globais + tokens
└── App.tsx                     # Roteamento principal
```

## 🚀 Como Usar

### 1. Configurar a API

Edite o arquivo `/config/api.ts`:

```typescript
// Desenvolvimento local
const API_URL = 'http://localhost:3000/api';

// Testar no celular físico (use o IP da sua máquina)
const API_URL = 'http://192.168.1.100:3000/api';

// Produção
const API_URL = 'https://sua-api.com/api';
```

### 2. Backend Requirements

O backend Node.js/Express precisa ter **CORS habilitado**:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // Ou especifique as origens permitidas
  credentials: true
}));
```

### 3. Endpoints Necessários

```
POST   /api/login              → { token, user }
POST   /api/usuarios           → Criar conta
POST   /api/forgot-password    → Solicitar reset
POST   /api/reset-password     → Alterar senha

GET    /api/anotacoes          → Note[]
POST   /api/anotacoes          → Note
PUT    /api/anotacoes/:id      → Note
DELETE /api/anotacoes/:id      → void
```

## 📱 Fluxo do Usuário

### 1. **Login/Registro**
- Validação de senha forte (8+ chars, 1 maiúscula, 1 especial)
- Feedback visual de força da senha
- Opção "Lembrar-me"

### 2. **Dashboard**
- **3 Tabs**:
  - 📝 **Todas**: Separadas em Vencidos → Urgentes → Normais
  - 🚨 **Urgentes**: Apenas vencidos + urgentes (badge com contador)
  - ⭐ **Favoritas**: Apenas notas favoritadas
- **Busca**: Filtra por título ou conteúdo
- **FAB**: Botão flutuante para criar nova nota

### 3. **Nota Detalhada**
- Tela full-screen com a cor da nota
- Editor rico (B, I, U, cores)
- Seletor de data para lembrete
- Seletor de cores (13 opções)
- Contador de reagendamentos (se > 0)
- Botões: Salvar, Favoritar, Excluir

### 4. **Modal de Cobrança** 🚨
Aparece quando:
- Uma nota **venceu** (prazo passou)
- Uma nota **vence em < 10 minutos**

**3 ações obrigatórias:**
- ✅ **Já Realizei**: Marca como concluída (remove lembrete)
- 📅 **Preciso Reagendar**: Abre a nota e foca no calendário (+1 no contador)
- 🗑️ **Excluir Nota**: Remove permanentemente

**Opcional:**
- Fechar (ignora até o próximo reload)

### 5. **Sistema de Polling**
- A cada **5 minutos**, verifica tarefas críticas
- Se encontrar uma urgente/vencida, abre o modal automaticamente
- Notas abertas para edição ou "ignoradas" não disparam modal

## 🎨 Hierarquia Visual

### Estados de Nota:

1. **💀 Vencido** (Overdue)
   - Cinza
   - Opacidade reduzida
   - Título tachado
   - Desaturado
   - Border cinza à esquerda

2. **🚨 Urgente** (< 10 minutos)
   - Animação pulsante (borda vermelha)
   - Relógio vermelho
   - Data em vermelho
   - Border vermelha à esquerda

3. **📝 Normal**
   - Cor do Post-it escolhida
   - Sem animações especiais

## 🔒 Segurança

- ✅ Rotas protegidas (redirect para /login se não autenticado)
- ✅ Token JWT armazenado em localStorage
- ✅ Validação forte de senha (3 critérios)
- ✅ Interceptor de requisições (Authorization: Bearer token)

## 🎯 Diferencial do Projeto

Este **não é um app de notas passivo**. É um **assistente pessoal chato** que:

- ⏰ Te cobra quando você esquece
- 📊 Rastreia quantas vezes você procrastinou (contador visível)
- 🚫 Bloqueia a tela quando a tarefa vence
- 💪 Te força a tomar uma decisão (concluir, reagendar ou excluir)

## 🛠️ Stack Tecnológica

- **React 18** (com Hooks)
- **TypeScript**
- **Tailwind CSS v4**
- **React Router** (navegação)
- **Lucide React** (ícones)
- **Fetch API** (requisições)
- **LocalStorage** (persistência de token)

## 📦 Dependências Principais

```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "lucide-react": "latest"
}
```

## 🚨 Limitações Conhecidas

1. **Notificações Push**: Não implementadas (seria necessário PWA + Service Worker)
2. **Offline First**: Não há cache de dados (sempre depende da API)
3. **Sincronização em Tempo Real**: Usa polling (5 min), não WebSockets

## 🔮 Melhorias Futuras

- [ ] PWA (Progressive Web App)
- [ ] Notificações Push do navegador
- [ ] Modo offline com sincronização
- [ ] WebSockets para atualizações em tempo real
- [ ] Compartilhar notas entre usuários
- [ ] Tags/categorias
- [ ] Anexar imagens
- [ ] Backup automático

## 📄 Licença

Este projeto faz parte do **BnotasWeb** - Sistema de Produtividade Pessoal.

---

**Desenvolvido com ☕ e muita procrastinação combatida!**
