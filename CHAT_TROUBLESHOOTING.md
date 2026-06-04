# Chat System - Troubleshooting & FAQ

## ❓ Perguntas Frequentes

### P: Onde acessar o chat?
**R:** Na rota `/chat` após fazer login. Ex: `http://localhost:5173/chat`

### P: Como iniciar conversa com um usuário específico?
**R:** Use o componente `StartChatButton`:
```jsx
<StartChatButton userId={id} userName={name} avatarUrl={avatar} />
```

### P: As mensagens aparecem em tempo real?
**R:** Sim! Via SignalR WebSocket. Ambos usuários veem mensagens instantaneamente.

### P: Posso ver histórico de mensagens?
**R:** Sim! Toda conversa carrega histórico quando selecionada.

### P: Preciso de configuração especial?
**R:** Não! Backend e frontend já estão configurados. Apenas execute:
```bash
# Backend
cd backend && dotnet run

# Frontend (outro terminal)
cd frontend && npm run dev
```

### P: Como funciona a segurança?
**R:** Autenticação JWT obrigatória. Apenas participantes acessam conversa.

---

## 🐛 Troubleshooting

### ❌ "Erro 401 Unauthorized"

**Causas:**
- Token expirado
- Token não enviado
- Token inválido

**Soluções:**
1. Faça logout: `localStorage.clear()`
2. Faça login novamente
3. Verifique se `Authorization: Bearer {token}` está nos headers

**Debug:**
```javascript
// Console
const token = localStorage.getItem("token");
console.log("Token:", token);
```

---

### ❌ "Erro 403 Forbidden"

**Causas:**
- Usuário não é participante da conversa
- Tentando acessar conversa de outro usuário

**Soluções:**
1. Criar conversa primeiro via `POST /api/conversations`
2. Verificar que ambos usuários estão em `Participants`

**Debug:**
```javascript
// Verificar participantes
const response = await fetch(`/api/conversations/user/${userId}`);
const conversations = await response.json();
console.log(conversations);
```

---

### ❌ "SignalR não conecta"

**Causas:**
- Backend offline
- CORS não configurado
- Firewall bloqueando WebSocket
- Token inválido

**Soluções:**
1. Verifique backend: `dotnet run` (deve estar em `http://localhost:5000`)
2. Verificar CORS em `Program.cs`:
   ```csharp
   .WithOrigins("http://localhost:5173")
   .AllowAnyMethod()
   .AllowAnyHeader()
   .AllowCredentials();
   ```
3. Permitir WebSocket no firewall
4. Confirmar token válido

**Debug:**
```javascript
// Console
import chatService from "./service/chat.service";
const token = localStorage.getItem("token");
await chatService.connect(token);
// Verificar se conectou
console.log(chatService.connection?.state);
// 1 = Connected, 2 = Disconnected
```

---

### ❌ "Mensagens não aparecem em tempo real"

**Causas:**
- SignalR não conectou
- Listener não configurado
- Usuário não entrou no grupo

**Soluções:**
1. Verificar SignalR conectado
2. Confirmar `onReceiveMessage` configurado:
   ```javascript
   chatService.onReceiveMessage((message) => {
     console.log("Nova mensagem:", message);
     addMessage(message);
   });
   ```
3. Verificar se `JoinConversation` foi chamado

**Debug:**
```javascript
// Verificar listener
chatService.listeners
// Deve ter: { onReceiveMessage: function, ... }
```

---

### ❌ "CORS Error"

**Erro completo:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução:**
1. Backend `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowFrontend",
           policy =>
           {
               policy
                   .WithOrigins("http://localhost:5173")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
           });
   });

   app.UseCors("AllowFrontend");
   ```

2. Remapear Hub com CORS:
   ```csharp
   app.MapHub<ChatHub>("/api/chat")
      .RequireCors("AllowFrontend");
   ```

---

### ❌ "Conversa não encontrada"

**Erro:** `GET /api/conversations/user/{userId}` retorna vazio

**Causas:**
- Nenhuma conversa criada
- UserId incorreto
- Banco de dados sem dados

**Soluções:**
1. Criar conversa: `POST /api/conversations`
2. Verificar UserId:
   ```javascript
   const user = JSON.parse(localStorage.getItem("user"));
   console.log(user.id);
   ```
3. Verificar BD:
   ```sql
   SELECT * FROM "Conversations";
   SELECT * FROM "ConversationParticipants";
   ```

---

### ❌ "Erro de Banco de Dados"

**Erro:** `The type or namespace name 'Message' cannot be found`

**Causa:** Migrations não aplicadas

**Solução:**
```bash
cd backend
dotnet ef migrations list
dotnet ef database update
```

---

### ❌ "Mensagem não salva no banco"

**Causas:**
- Validação falhou (conteúdo vazio)
- Usuário não é participante
- Conversa não existe

**Debug:**
```csharp
// Adicionar log no MessageService.cs
public async Task<MessageDto?> SendMessageAsync(...)
{
    Console.WriteLine($"Salvando mensagem: {content}");
    var message = new Message { ... };
    _context.Messages.Add(message);
    var result = await _context.SaveChangesAsync();
    Console.WriteLine($"Resultado: {result} linhas afetadas");
    return ...;
}
```

---

### ❌ "Avatar não mostra"

**Causa:** URL nula ou inválida

**Solução:**
```jsx
{user.avatarUrl ? (
  <img src={user.avatarUrl} alt="avatar" />
) : (
  <div className="avatar-placeholder">
    {user.name?.charAt(0)?.toUpperCase()}
  </div>
)}
```

---

### ❌ "Performance lenta com muitas mensagens"

**Causa:** Renderizando todas as mensagens

**Solução:** Implementar paginação/virtual scrolling
```jsx
// Futuro: usar react-window ou react-intersection-observer
const [page, setPage] = useState(1);
const pageSize = 50;
// Carregar pagina por pagina
```

---

### ❌ "Scroll não vai para última mensagem"

**Causa:** `ref` não direcionado corretamente

**Solução:**
```jsx
const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]); // Executar quando mensagens mudarem

// No JSX:
<div className="messages-container">
  {messages.map(...)}
  <div ref={messagesEndRef} />
</div>
```

---

## 🔍 Debug Mode

### Habilitar Logs Detalhados (Backend)

```csharp
// Program.cs
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Ou específico para Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
            .LogTo(Console.WriteLine, LogLevel.Debug)
);
```

### Logs no Frontend

```javascript
// service/chat.service.js
console.log("SignalR conectado:", this.connection.state);
console.log("Enviando mensagem:", { conversationId, content });

// service/api.service.js
console.log("Request:", { url, method, headers });
```

---

## 📊 Monitorar Banco de Dados

```sql
-- PostgreSQL
-- Contar conversas
SELECT COUNT(*) as total FROM "Conversations";

-- Contar mensagens por conversa
SELECT "ConversationId", COUNT(*) as total
FROM "Messages"
GROUP BY "ConversationId"
ORDER BY total DESC;

-- Listar últimas mensagens
SELECT * FROM "Messages"
ORDER BY "SentAt" DESC
LIMIT 10;

-- Verificar participantes
SELECT "ConversationId", COUNT(*) as count
FROM "ConversationParticipants"
GROUP BY "ConversationId"
HAVING COUNT(*) != 2; -- Deveria ter 2 participantes
```

---

## ⚙️ Configurações Avançadas

### Aumentar Timeout SignalR

```javascript
// chat.service.js
.withServerSideTimeoutInMilliseconds(120000) // 2 minutos
```

### Aumentar Limite de Requisições

```csharp
// Program.cs
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 32 * 1024 * 1024; // 32MB
    options.ServerTimeout = TimeSpan.FromSeconds(120);
});
```

### Rate Limiting (Futuro)

```csharp
builder.Services.AddSlidingWindowRateLimiter(options =>
{
    options.Window = TimeSpan.FromSeconds(1);
    options.PermitLimit = 10;
});
```

---

## 🆘 Quando Tudo Falha

### Reset Completo

**Backend:**
```bash
cd backend
dotnet ef database drop -f
dotnet ef database update
dotnet run
```

**Frontend:**
```bash
cd frontend
rm -r node_modules
npm install
npm run dev
```

**Limpar LocalStorage:**
```javascript
localStorage.clear()
// Recarregar página
location.reload()
```

---

## 📞 Logs a Verificar

### Backend Error Log
```bash
tail -f ~/.cache/dotnet/
# ou
dotnet run 2>&1 | tee backend.log
```

### Frontend Console
```
F12 → Console → Procurar por "Error", "WARN"
```

### Network Tab
```
F12 → Network → Filtrar por "chat" ou "messages"
Verificar: Status (200), Response, Headers
```

---

## 📈 Próximos Passos

1. **Implementar Testes**
   - Unit tests para Services
   - Integration tests para API
   - E2E tests para Chat flow

2. **Melhorar Performance**
   - Adicionar cache Redis
   - Implementar paginação
   - Virtual scrolling

3. **Adicionar Funcionalidades**
   - Typing indicator
   - Reações a mensagens
   - Pesquisa de mensagens
   - Notificações

4. **Segurança**
   - Rate limiting
   - Validação de entrada
   - Encryption end-to-end
