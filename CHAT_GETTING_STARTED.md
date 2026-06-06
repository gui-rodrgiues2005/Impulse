# 🚀 Guia de Início Rápido - Chat System

## ⚡ Setup Rápido (5 minutos)

### 1. Backend - Iniciar

```bash
cd backend
dotnet run
```

✅ Backend em: `http://localhost:5000`

### 2. Frontend - Iniciar (novo terminal)

```bash
cd frontend
npm run dev
```

✅ Frontend em: `http://localhost:5173`

### 3. Usar o Chat

1. Abra `http://localhost:5173`
2. Faça login
3. Clique em "Mensagens" ou vá para `/chat`
4. Selecione uma conversa ou clique no botão de mensagem em um perfil

---

## ✅ Checklist de Verificação

- [x] Backend compila sem erros
- [x] Frontend compila sem erros
- [x] Migrations aplicadas
- [x] SignalR configurado
- [x] Rotas React configuradas
- [x] Componentes criados
- [x] Serviços implementados
- [x] Context API configurado
- [x] Estilos aplicados
- [x] Autenticação validada
- [x] Documentação completa

---

## 📁 Arquivos Criados

### Backend (13 arquivos novos)
```
✨ Model/Conversation.cs
✨ Model/ConversationParticipant.cs
✨ Model/Message.cs
✨ Dto/CreateConversationDto.cs
✨ Dto/ConversationResponseDto.cs
✨ Dto/MessageDto.cs
✨ Dto/SendMessageDto.cs
✨ Services/IConversationService.cs
✨ Services/ConversationService.cs
✨ Services/IMessageService.cs
✨ Services/MessageService.cs
✨ Controllers/ConversationsController.cs
✨ Controllers/MessagesController.cs
✨ Hubs/ChatHub.cs
```

### Frontend (11 arquivos novos)
```
✨ Pages/ChatPage.jsx
✨ Components/ConversationList.jsx
✨ Components/ChatScreen.jsx
✨ Components/StartChatButton.jsx
✨ context/ChatContext.jsx
✨ service/chat.service.js
✨ service/api.service.js
✨ styles/ChatPage.scss
✨ styles/ConversationList.scss
✨ styles/ChatScreen.scss
✨ styles/StartChatButton.scss
```

### Documentação (5 arquivos)
```
📄 CHAT_DOCUMENTATION.md
📄 CHAT_QUICK_REFERENCE.md
📄 CHAT_INTEGRATION_EXAMPLES.md
📄 CHAT_TROUBLESHOOTING.md
📄 CHAT_IMPLEMENTATION_SUMMARY.md
```

### Arquivos Modificados (3 arquivos)
```
✏️ backend/Model/User.cs (adicionadas relações)
✏️ backend/Data/DpContext.cs (adicionados DbSets e configurações)
✏️ backend/Program.cs (adicionado SignalR e Services)
✏️ frontend/src/App.jsx (adicionada rota /chat)
✏️ frontend/package.json (adicionado @microsoft/signalr)
```

---

## 🔗 Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/conversations` | Criar conversa |
| GET | `/api/conversations/user/{id}` | Listar conversas |
| GET | `/api/messages/conversation/{id}` | Histórico |
| POST | `/api/messages` | Enviar mensagem |
| WS | `/api/chat` | SignalR Hub |

---

## 🎨 Páginas/Rotas

| Rota | Descrição | Status |
|------|-----------|--------|
| `/chat` | Página principal de chat | ✅ Pronto |
| `/chat?user={id}` | Iniciar chat com usuário | ✅ Pronto |

---

## 🔐 Autenticação

- Token JWT em localStorage
- Enviado em `Authorization: Bearer {token}`
- Validado em todos os endpoints
- Validado no Hub SignalR

---

## 📊 Banco de Dados

### Tabelas Criadas

```sql
CREATE TABLE "Conversations" (
  "Id" uuid PRIMARY KEY,
  "CreatedAt" timestamp with time zone
);

CREATE TABLE "ConversationParticipants" (
  "ConversationId" uuid PRIMARY KEY,
  "UserId" uuid PRIMARY KEY,
  FOREIGN KEY REFERENCES "Conversations" ("Id"),
  FOREIGN KEY REFERENCES "Users" ("Id")
);

CREATE TABLE "Messages" (
  "Id" uuid PRIMARY KEY,
  "ConversationId" uuid,
  "SenderId" uuid,
  "Content" text,
  "SentAt" timestamp with time zone,
  FOREIGN KEY REFERENCES "Conversations" ("Id"),
  FOREIGN KEY REFERENCES "Users" ("Id")
);
```

### Migration

```bash
dotnet ef migrations list
# 20260604014523_CreateChatModule ✅ Aplicada
```

---

## 🧪 Testar API com cURL

### Criar Conversa
```bash
curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{"otherUserId": "uuid-do-usuario"}'
```

### Listar Conversas
```bash
curl http://localhost:5000/api/conversations/user/seu-id \
  -H "Authorization: Bearer seu-token-jwt"
```

### Obter Histórico
```bash
curl http://localhost:5000/api/messages/conversation/id-conversa \
  -H "Authorization: Bearer seu-token-jwt"
```

---

## 🔧 Configurações

### Backend - appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=impulse;User Id=postgres;Password=..."
  },
  "Jwt": {
    "Key": "sua-chave-secreta",
    "Issuer": "http://localhost:5000",
    "Audience": "http://localhost:5173"
  }
}
```

### Frontend - src/service/api.service.js
```javascript
const API_URL = "http://localhost:5000/api";
```

### Frontend - src/service/chat.service.js
```javascript
.withUrl("http://localhost:5000/api/chat", { ... })
```

---

## 📱 Mobile Responsive

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

---

## 🐛 Se Algo Não Funcionar

### 1. Backend não inicia
```bash
cd backend
dotnet clean
dotnet build
dotnet ef database update
dotnet run
```

### 2. Frontend não conecta
```bash
# Limpar cache
rm -r node_modules
npm install
npm run dev
```

### 3. SignalR não conecta
```javascript
// Verificar no console
localStorage.getItem("token") // Deve ter valor
```

### 4. BD sem migrations
```bash
dotnet ef database drop -f
dotnet ef database update
```

**Consulte `CHAT_TROUBLESHOOTING.md` para mais detalhes**

---

## 📚 Documentação Disponível

| Documento | Objetivo |
|-----------|----------|
| `CHAT_DOCUMENTATION.md` | Documentação completa e técnica |
| `CHAT_QUICK_REFERENCE.md` | Referência rápida de endpoints e uso |
| `CHAT_INTEGRATION_EXAMPLES.md` | Exemplos de como integrar em outras páginas |
| `CHAT_TROUBLESHOOTING.md` | Guia de troubleshooting e FAQ |
| `CHAT_IMPLEMENTATION_SUMMARY.md` | Resumo do que foi implementado |

---

## 🎯 Próximas Melhorias

- [ ] Typing indicator
- [ ] Reações a mensagens
- [ ] Notificações não lidas
- [ ] Busca de mensagens
- [ ] Edição/deleção de mensagens
- [ ] Chamadas de voz/vídeo
- [ ] Testes automatizados

---

## 💡 Dicas

1. **Adicionar chat em qualquer lugar:**
   ```jsx
   <StartChatButton userId={id} userName={name} avatarUrl={avatar} />
   ```

2. **Acessar rápido:**
   - Chrome: `Ctrl+K` → `/chat`
   - Messenger: `http://localhost:5173/chat`

3. **Limpar localStorage:**
   ```javascript
   localStorage.clear()
   ```

4. **Ver logs do backend:**
   ```bash
   dotnet run 2>&1 | tee debug.log
   ```

---

## 📞 Suporte

- Erro? → `CHAT_TROUBLESHOOTING.md`
- Dúvida de uso? → `CHAT_DOCUMENTATION.md`
- Precisa integrar? → `CHAT_INTEGRATION_EXAMPLES.md`
- Referência rápida? → `CHAT_QUICK_REFERENCE.md`

---

## ✨ Você Está Pronto!

Sistema de chat implementado e funcionando. Divirta-se! 🚀
