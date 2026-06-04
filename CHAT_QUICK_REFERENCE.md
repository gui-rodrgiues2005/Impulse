# Chat System - Quick Reference

## 🎯 Endpoints Rápidos

### Conversas
```
POST   /api/conversations                     → Criar/Obter conversa
GET    /api/conversations/user/{userId}      → Listar conversas do usuário
```

### Mensagens
```
GET    /api/messages/conversation/{convId}   → Obter histórico
POST   /api/messages                          → Enviar mensagem (REST)
```

### SignalR Hub: `/api/chat`
```
client → JoinConversation(convId)
client → SendMessage(convId, content)
client → LeaveConversation(convId)

server → ReceiveMessage(message)
server → UserJoined(user)
server → UserLeft(user)
server → Error(message)
```

## 💻 Usar em Componente React

```jsx
import { StartChatButton } from "./Components/StartChatButton";

// Em qualquer perfil de usuário
<StartChatButton 
  userId={user.id}
  userName={user.name}
  avatarUrl={user.avatarUrl}
/>
```

Ou programaticamente:

```jsx
import { useChat } from "./context/ChatContext";

function MyComponent() {
  const { createOrGetConversation, selectConversation } = useChat();

  async function handleStartChat(userId) {
    const conversation = await createOrGetConversation(userId);
    if (conversation) {
      await selectConversation(conversation.id);
    }
  }

  return <button onClick={() => handleStartChat("user-id")}>Chat</button>;
}
```

## 🔗 Integração em Layouts

Envolver o App com `ChatProvider`:

```jsx
import { ChatProvider } from "./context/ChatContext";

export default function App() {
  return (
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  );
}
```

Adicionar navbar link para chat:

```jsx
<nav>
  <Link to="/student/profile">Perfil</Link>
  <Link to="/chat">💬 Mensagens</Link>
</nav>
```

## 📱 DTO Responses

### Conversa
```json
{
  "id": "uuid",
  "createdAt": "2026-06-04T00:00:00Z",
  "participants": [
    {
      "id": "uuid",
      "name": "João",
      "email": "joao@email.com",
      "avatarUrl": "https://..."
    }
  ],
  "lastMessage": {
    "id": "uuid",
    "content": "Última mensagem",
    "sentAt": "2026-06-04T12:34:56Z",
    "senderName": "João"
  }
}
```

### Mensagem
```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "senderName": "João",
  "senderAvatarUrl": "https://...",
  "content": "Conteúdo da mensagem",
  "sentAt": "2026-06-04T12:34:56Z"
}
```

## 🛡️ Headers Obrigatórios

Todos os requests REST:
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
```

SignalR:
```
accessTokenFactory: () => jwt-token
```

## 🔄 Fluxo Típico

1. **Listar Conversas** → GET `/conversations/user/{userId}`
2. **Selecionar Conversa** → `selectConversation(convId)`
3. **Conectar SignalR** → Automático no `selectConversation`
4. **Carregar Histórico** → GET `/messages/conversation/{convId}`
5. **Enviar Mensagem** → `sendMessage(content)`
6. **Receber em Tempo Real** → Event `ReceiveMessage`

## ⚙️ Variáveis de Ambiente

Backend (`appsettings.json`):
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=impulse;User Id=postgres;Password=..."
}
```

Frontend (`src/service/api.service.js`):
```javascript
const API_URL = "http://localhost:5000/api";
```

## 🚀 Startup

```bash
# Terminal 1 - Backend
cd backend
dotnet run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Acesso: `http://localhost:5173/chat`

## 📊 Estrutura de Dados (DB)

```sql
-- Conversas
CREATE TABLE "Conversations" (
  "Id" uuid PRIMARY KEY,
  "CreatedAt" timestamp with time zone
);

-- Participantes
CREATE TABLE "ConversationParticipants" (
  "ConversationId" uuid PRIMARY KEY,
  "UserId" uuid PRIMARY KEY,
  FOREIGN KEY ("ConversationId") REFERENCES "Conversations",
  FOREIGN KEY ("UserId") REFERENCES "Users"
);

-- Mensagens
CREATE TABLE "Messages" (
  "Id" uuid PRIMARY KEY,
  "ConversationId" uuid,
  "SenderId" uuid,
  "Content" text,
  "SentAt" timestamp with time zone,
  FOREIGN KEY ("ConversationId") REFERENCES "Conversations",
  FOREIGN KEY ("SenderId") REFERENCES "Users"
);
```

## 🔍 Debug

Backend:
```bash
# Ver migrations
dotnet ef migrations list

# Resetar BD
dotnet ef database drop -f
dotnet ef database update
```

Frontend:
```javascript
// Console
localStorage.getItem("token")
localStorage.getItem("user")
```

## ⛔ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token inválido/expirado | Refazer login |
| 403 Forbidden | Não é participante | Criar/obter conversa primeiro |
| SignalR não conecta | Backend offline | `dotnet run` no backend |
| CORS error | Origem não autorizada | Verificar Program.cs |
| Conversa não encontrada | ID incorreto | Verificar UUID |

## 📚 Documentação Completa

Ver `CHAT_DOCUMENTATION.md` para detalhes completos, testes com cURL e troubleshooting.
