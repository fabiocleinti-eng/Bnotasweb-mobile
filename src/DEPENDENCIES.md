# 📦 Dependências do Projeto

Lista de bibliotecas utilizadas no BnotasWeb Mobile.

## ✅ Dependências Principais

### React Ecosystem
- **react**: ^18.3.1 - Biblioteca principal
- **react-dom**: ^18.3.1 - Renderização DOM
- **react-router-dom**: ^6.x - Roteamento SPA

### UI & Icons
- **lucide-react**: latest - Ícones modernos e leves
- **tailwindcss**: ^4.x - Estilização utility-first

### TypeScript
- **typescript**: ^5.x - Tipagem estática

## 🔧 Dependências de Desenvolvimento

- **vite**: ^5.x - Build tool rápido
- **@vitejs/plugin-react**: latest - Plugin Vite para React
- **@types/react**: ^18.x - Tipos TypeScript para React
- **@types/react-dom**: ^18.x - Tipos TypeScript para ReactDOM

## 📝 Notas sobre Importações

### Lucide React (Ícones)

Todos os ícones são importados individualmente para otimizar o bundle:

```typescript
import { 
  Plus, 
  Search, 
  LogOut, 
  Star, 
  Trash2,
  AlertCircle,
  // ... etc
} from 'lucide-react';
```

**Ícones usados no projeto:**
- `StickyNote` - Tab "Todas"
- `AlertCircle` - Tab "Urgentes", Modal de cobrança
- `Star` - Favoritos
- `Plus` - FAB (criar nota)
- `Search` - Busca
- `LogOut` - Sair
- `RefreshCw` - Atualizar lista
- `Clock` - Lembrete
- `Trash2` - Excluir
- `ArrowLeft` - Voltar
- `Save` - Salvar
- `CheckCircle` - Concluir tarefa
- `Calendar` - Reagendar
- `Mail` - E-mail (login)
- `Lock` - Senha (login)
- `User` - Usuário (cadastro)
- `Phone` - Telefone (cadastro)
- `Eye` / `EyeOff` - Toggle mostrar senha
- `AlertTriangle` - Contador de reagendamentos

### Tailwind CSS v4

O projeto usa **Tailwind v4** com a nova sintaxe `@import "tailwindcss"`.

**Arquivo:** `/styles/globals.css`

```css
@import "tailwindcss";

/* Tokens personalizados */
:root {
  --note-yellow: #fff9c4;
  --urgent-red: #d32f2f;
  /* ... etc */
}
```

**Não é necessário `tailwind.config.js`** - Configuração automática!

### React Router DOM

Usado para navegação entre telas:

```typescript
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
```

**Rotas:**
- `/login` - Login/Registro
- `/reset-password` - Redefinir senha
- `/dashboard` - Lista de notas
- `/note/:id` - Detalhes da nota
- `/note/new` - Criar nova nota

## 🚫 Bibliotecas NÃO Utilizadas

Propositalmente **não** usamos:

- ❌ **Redux/Zustand** - Estado gerenciado com hooks nativos
- ❌ **Axios** - Fetch API nativa é suficiente
- ❌ **React Query** - Polling manual com `setInterval`
- ❌ **Framer Motion** - Animações CSS puras
- ❌ **Material UI / Chakra** - Componentes customizados
- ❌ **date-fns / moment** - Manipulação de data nativa
- ❌ **React Hook Form** - Formulários controlados manualmente

**Por quê?**
- Mantém o bundle pequeno
- Menos dependências = menos problemas
- Mais controle sobre o código
- Melhor performance

## 📊 Tamanho do Bundle (Estimado)

```
Total (gzipped):
- React + ReactDOM: ~45 KB
- React Router: ~10 KB
- Lucide Icons (tree-shaken): ~5 KB
- Código da aplicação: ~30 KB

TOTAL: ~90 KB (gzipped)
```

**Muito leve para um app mobile! 🚀**

## 🔄 Atualizações

Para atualizar dependências:

```bash
# Verificar versões desatualizadas
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar uma específica
npm install react@latest react-dom@latest
```

## 🔐 Dependências de Segurança

**Nenhuma dependência externa é usada para:**
- Autenticação (JWT gerenciado manualmente)
- Criptografia (backend é responsável)
- Validação (lógica customizada)

**Dados sensíveis:**
- Token armazenado em `localStorage` (⚠️ vulnerável a XSS)
- Para produção, considere:
  - HttpOnly Cookies
  - Refresh tokens
  - Rate limiting no backend

## 📚 Referências

- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

**Mantemos simples. Mantemos rápido. 🚀**
