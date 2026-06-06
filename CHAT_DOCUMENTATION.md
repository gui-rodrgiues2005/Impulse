# Sistema de Chat Privado - Documentação Completa

## Visão Geral

Sistema de chat privado entre usuários implementado com ASP.NET Core 8, Entity Framework Core, PostgreSQL, React e SignalR. Fornece comunicação em tempo real com histórico persistente de mensagens.

## 📋 Requisitos Implementados

### Backend (.NET 8)

#### ✅ Entidades de Banco de Dados

**Conversation**
- `Id` (Guid) - Identificador único
- `CreatedAt` (DateTime) - Data de criação
- Relações: `Participants`, `Messages`

**ConversationParticipant**
- `ConversationId` (Guid) - FK para Conversation
- `UserId` (Guid) - FK para User
- Chave composta: (ConversationId, UserId)

**Message**
- `Id` (Guid) - Identificador único
- `ConversationId` (Guid) - FK para Conversation
- `SenderId` (Guid) - FK para User
- `Content` (string) - Conteúdo da mensagem
- `SentAt` (DateTime) - Data de envio

#### ✅ Entity Framework Core

- Configurações de relacionamentos no `OnModelCreating`
- Cascade delete para manter integridade referencial
- Migration: `CreateChatModule`

#### ✅ API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/conversations` | Cria ou retorna conversa existente |
| GET | `/api/conversations/user/{userId}` | Lista conversas do usuário |
| GET | `/api/messages/conversation/{conversationId}` | Histórico de mensagens |
| POST | `/api/messages` | Envia nova mensagem (fallback REST) |

#### ✅ SignalR

- **Hub**: `ChatHub` em `/api/chat`
- **Métodos do Cliente**:
  - `JoinConversation(conversationId)` - Entrar em conversa
  - `LeaveConversation(conversationId)` - Sair de conversa
  - `SendMessage(conversationId, content)` - Enviar mensagem

- **Eventos do Servidor**:
  - `ReceiveMessage(message)` - Receber mensagem em tempo real
  - `UserJoined(user)` - Usuário entrou na conversa
  - `UserLeft(user)` - Usuário saiu da conversa
  - `Error(message)` - Erro de comunicação

#### ✅ Segurança

- Autenticação JWT obrigatória
- Validação de permissões em endpoints
- Apenas participantes podem acessar conversa
- Validação no Hub SignalR

#### ✅ Arquitetura Clean

- **Services**: `ConversationService`, `MessageService`
- **DTOs**: `CreateConversationDto`, `ConversationResponseDto`, `MessageDto`, `SendMessageDto`
- **Controllers**: Orquestração apenas
- **Hubs**: Comunicação em tempo real

### Frontend (React)

#### ✅ Componentes

- **`ChatPage`** - Página principal
- **`ConversationList`** - Lista de conversas
- **`ChatScreen`** - Tela de chat com histórico
- **`StartChatButton`** - Botão para iniciar conversa

#### ✅ Contexto (Context API)

- **`ChatContext`** - Gerencia estado global
- Métodos: `loadConversations`, `selectConversation`, `createOrGetConversation`, `sendMessage`, `addMessage`, `leaveConversation`

#### ✅ Serviços

- **`chat.service.js`** - Integração SignalR
- **`api.service.js`** - Chamadas REST

#### ✅ Recursos

- ✔️ Comunicação em tempo real via SignalR
- ✔️ Histórico de mensagens
- ✔️ Scroll automático
- ✔️ Avatar de usuário
- ✔️ Timestamp de mensagens
- ✔️ Responsivo (desktop e mobile)

## 🚀 Como Usar

### Backend

#### 1. Compilar e Executar

```bash
cd backend
dotnet build
dotnet run
```

A API estará disponível em `http://localhost:5000`

#### 2. Migrations já aplicadas

As migrations foram criadas e aplicadas:
- `CreateChatModule` - Cria tabelas de chat

#### 3. Endpoints Disponíveis

**Criar ou Obter Conversa**
```bash
POST /api/conversations
Content-Type: application/json
Authorization: Bearer {token}

{
  "otherUserId": "uuid-do-outro-usuario"
}
```

**Listar Conversas do Usuário**
```bash
GET /api/conversations/user/{userId}
Authorization: Bearer {token}
```

**Obter Mensagens de Conversa**
```bash
GET /api/messages/conversation/{conversationId}
Authorization: Bearer {token}
```

**Enviar Mensagem (REST - fallback)**
```bash
POST /api/messages
Content-Type: application/json
Authorization: Bearer {token}

{
  "conversationId": "uuid",
  "content": "Olá!"
}
```

### Frontend

#### 1. Instalar Dependências

```bash
cd frontend
npm install
```

SignalR já foi instalado: `npm install @microsoft/signalr`

#### 2. Executar Desenvolvimento

```bash
npm run dev
```

Frontend estará em `http://localhost:5173`

#### 3. Acessar Chat

- Faça login em `http://localhost:5173`
- Navegue para `/chat`
- Selecione uma conversa ou clique em "Enviar Mensagem" em um perfil

#### 4. Usar StartChatButton

Adicione o componente em qualquer página para iniciar conversa:

```jsx
import { StartChatButton } from "./Components/StartChatButton";

export function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <StartChatButton 
        userId={user.id} 
        userName={user.name}
        avatarUrl={user.avatarUrl}
      />
    </div>
  );
}
```

## 🔌 Integração SignalR

### Conectar ao Hub

```javascript
import chatService from "./service/chat.service";

const token = localStorage.getItem("token");
await chatService.connect(token);
```

### Entrar em Conversa

```javascript
await chatService.joinConversation(conversationId);
```

### Enviar Mensagem em Tempo Real

```javascript
await chatService.sendMessage(conversationId, "Olá!");
```

### Listener de Mensagens

```javascript
chatService.onReceiveMessage((message) => {
  console.log("Nova mensagem:", message);
  // Adicionar ao estado do React
});
```

## 📁 Estrutura de Arquivos

### Backend
```
backend/
├── Model/
│   ├── Conversation.cs
│   ├── ConversationParticipant.cs
│   └── Message.cs
├── Dto/
│   ├── CreateConversationDto.cs
│   ├── ConversationResponseDto.cs
│   ├── MessageDto.cs
│   └── SendMessageDto.cs
├── Services/
│   ├── IConversationService.cs
│   ├── ConversationService.cs
│   ├── IMessageService.cs
│   └── MessageService.cs
├── Controllers/
│   ├── ConversationsController.cs
│   └── MessagesController.cs
├── Hubs/
│   └── ChatHub.cs
├── Migrations/
│   └── 20260604014523_CreateChatModule.cs
└── Data/
    └── DpContext.cs (atualizado)
```

### Frontend
```
frontend/src/
├── Pages/
│   └── ChatPage.jsx
├── Components/
│   ├── ConversationList.jsx
│   ├── ChatScreen.jsx
│   └── StartChatButton.jsx
├── context/
│   └── ChatContext.jsx
├── service/
│   ├── chat.service.js
│   └── api.service.js
├── styles/
│   ├── ChatPage.scss
│   ├── ConversationList.scss
│   ├── ChatScreen.scss
│   └── StartChatButton.scss
└── App.jsx (atualizado com rota /chat)
```

## 🔐 Segurança

### Autenticação
- ✔️ JWT obrigatório em todos os endpoints
- ✔️ Validação no Hub SignalR
- ✔️ Token armazenado em localStorage

### Autorização
- ✔️ Usuários só veem suas conversas
- ✔️ Apenas participantes podem acessar conversa
- ✔️ Apenas participantes podem enviar/receber mensagens
- ✔️ Validação em endpoints REST e Hub

### Boas Práticas
- ✔️ Senhas hasheadas (já implementado no projeto)
- ✔️ CORS configurado
- ✔️ Validação de entrada
- ✔️ Cascade delete para integridade

## ⚙️ Configuração

### Backend (appsettings.json)

Certifique-se de ter:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=impulse;User Id=postgres;Password=sua_senha;"
  },
  "Jwt": {
    "Key": "sua-chave-secreta",
    "Issuer": "http://localhost:5000",
    "Audience": "http://localhost:5173"
  }
}
```

### Frontend

A URL da API está configurada em `src/service/api.service.js`:
```javascript
const API_URL = "http://localhost:5000/api";
```

E SignalR em `src/service/chat.service.js`:
```javascript
.withUrl("http://localhost:5000/api/chat", { ... })
```

## 🧪 Testes de API

### Com cURL

**Criar Conversa**
```bash
curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"otherUserId": "00000000-0000-0000-0000-000000000000"}'
```

**Listar Conversas**
```bash
curl http://localhost:5000/api/conversations/user/{userId} \
  -H "Authorization: Bearer {token}"
```

**Obter Mensagens**
```bash
curl http://localhost:5000/api/messages/conversation/{conversationId} \
  -H "Authorization: Bearer {token}"
```

## 🐛 Troubleshooting

### SignalR não conecta
- Verifique se backend está rodando em `http://localhost:5000`
- Confirme token de autenticação válido
- Verifique CORS em `Program.cs`

### Mensagens não aparecem em tempo real
- Confirme que `ChatHub` está mapeado em `/api/chat`
- Verifique listeners em `ChatContext`
- Verifique console do navegador para erros

### Erro de autorização (401)
- Token JWT pode estar expirado
- Faça logout e login novamente
- Verifique se token está sendo enviado corretamente

### Conversa não encontrada
- Verifique `conversationId`
- Confirme que usuário é participante
- Verifique banco de dados: `SELECT * FROM "Conversations"`

## 📝 Próximas Melhorias

- [ ] Tipagem TypeScript no frontend
- [ ] Upload de imagens/arquivos
- [ ] Digitação em tempo real ("está digitando...")
- [ ] Notificações de mensagens não lidas
- [ ] Reações a mensagens (emojis)
- [ ] Edição de mensagens
- [ ] Deleção de mensagens
- [ ] Busca de conversas e mensagens
- [ ] Chamadas de voz/vídeo
- [ ] End-to-end encryption

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do backend: `dotnet run`
2. Console do navegador (F12)
3. Verificar migrations: `dotnet ef migrations list`
4. Resetar banco: `dotnet ef database drop -f && dotnet ef database update`
