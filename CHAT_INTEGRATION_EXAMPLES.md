# Exemplos de Integração - Chat System

## 1. Adicionar Chat em Perfil de Usuário

### StudentProfile.jsx

```jsx
import { StartChatButton } from "../../Components/StartChatButton";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);

  // ... código existente ...

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={student?.avatarUrl} alt={student?.name} />
        <h1>{student?.name}</h1>
        <p>{student?.email}</p>
        
        {/* Adicionar botão de chat */}
        <StartChatButton 
          userId={student?.id}
          userName={student?.name}
          avatarUrl={student?.avatarUrl}
        />
      </div>

      {/* Resto do perfil */}
    </div>
  );
}
```

## 2. Adicionar Chat em Card de Talento

### TalentCard.jsx

```jsx
import { StartChatButton } from "../StartChatButton";

export function TalentCard({ talent }) {
  return (
    <div className="talent-card">
      <img src={talent.avatarUrl} alt={talent.name} />
      <h3>{talent.name}</h3>
      <p>{talent.course}</p>
      
      <div className="actions">
        <button className="btn-favorite">❤️ Salvar</button>
        {/* Adicionar botão de chat */}
        <StartChatButton
          userId={talent.userId}
          userName={talent.name}
          avatarUrl={talent.avatarUrl}
        />
      </div>
    </div>
  );
}
```

## 3. Adicionar Chat em Feed/Publicação

### FeedPost.jsx

```jsx
import { StartChatButton } from "../../Components/StartChatButton";

export function FeedPost({ post }) {
  return (
    <div className="feed-post">
      <div className="post-header">
        <img src={post.userAvatar} alt={post.userName} />
        <div>
          <h4>{post.userName}</h4>
          <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        
        {/* Chat com autor do post */}
        <StartChatButton
          userId={post.userId}
          userName={post.userName}
          avatarUrl={post.userAvatar}
        />
      </div>

      <div className="post-content">
        <p>{post.description}</p>
      </div>
    </div>
  );
}
```

## 4. Navbar com Link para Chat

### Navbar.jsx ou StudentLayout.jsx

```jsx
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/student/profile">Perfil</Link>
        <Link to="/student/feed">Feed</Link>
        <Link to="/student/vagas">Vagas</Link>
        
        {/* Link para Chat */}
        <Link to="/chat" className="chat-link">
          <MessageSquare size={20} />
          <span>Mensagens</span>
        </Link>
      </div>
    </nav>
  );
}
```

## 5. Integração com Notificações

### NotificationCenter.jsx

```jsx
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function NotificationCenter() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Contar mensagens não lidas
    // Implementar em breve
  }, []);

  return (
    <div className="notification-center">
      <button className="notification-btn">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}
```

## 6. Modal para Iniciar Chat

### StartChatModal.jsx

```jsx
import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { MessageSquare, X } from "lucide-react";

export function StartChatModal({ isOpen, onClose }) {
  const [userId, setUserId] = useState("");
  const { createOrGetConversation } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await createOrGetConversation(userId);
      window.location.href = "/chat";
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Iniciar Conversa</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <label>ID do Usuário</label>
          <input
            type="text"
            placeholder="cole o UUID do usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleStartChat}
            disabled={!userId || isLoading}
            className="btn-primary"
          >
            {isLoading ? "Carregando..." : "Iniciar Chat"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 7. Usar Modal

### App.jsx ou Layout

```jsx
import { useState } from "react";
import { StartChatModal } from "./Components/StartChatModal";

export default function App() {
  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div>
      {/* Navbar com botão */}
      <button 
        onClick={() => setShowChatModal(true)}
        className="btn-new-chat"
      >
        + Nova Conversa
      </button>

      <StartChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />

      {/* Resto da app */}
    </div>
  );
}
```

## 8. Estender com Typing Indicator

### Adicionar ao ChatHub.cs (backend)

```csharp
public async Task SendTypingIndicator(Guid conversationId)
{
    var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return;

    await Clients.Group($"conversation-{conversationId}")
        .SendAsync("UserTyping", new { UserId = userId });
}

public async Task StopTypingIndicator(Guid conversationId)
{
    var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return;

    await Clients.Group($"conversation-{conversationId}")
        .SendAsync("UserStoppedTyping", new { UserId = userId });
}
```

### Usar no ChatScreen.jsx (frontend)

```jsx
const [isTyping, setIsTyping] = useState(false);
let typingTimeout;

const handleInputChange = (e) => {
  setInputValue(e.target.value);

  if (!isTyping) {
    setIsTyping(true);
    chatService.connection?.invoke("SendTypingIndicator", currentConversation.id);
  }

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    setIsTyping(false);
    chatService.connection?.invoke("StopTypingIndicator", currentConversation.id);
  }, 1000);
};
```

## 9. Estender com Reações

Adicionar campo `Reaction` em Message:

```csharp
public class Message
{
    // ... campos existentes ...
    public string? Reaction { get; set; } // "👍", "❤️", etc
}
```

## 10. Melhorar Performance - Paginação

Modificar `GetConversationMessages`:

```csharp
[HttpGet("conversation/{conversationId}")]
public async Task<IActionResult> GetConversationMessages(
    Guid conversationId, 
    int page = 1, 
    int pageSize = 50)
{
    var messages = await _context.Messages
        .Where(m => m.ConversationId == conversationId)
        .OrderByDescending(m => m.SentAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Reverse() // Para exibir em ordem cronológica
        .ToListAsync();

    return Ok(messages);
}
```

## 📝 Notas Importantes

1. **Revalidação de Sessão**: Implementar refresh automático de token
2. **Desconexão**: Tratar desconexão de rede graciosamente
3. **Offline Mode**: Enfileirar mensagens para enviar quando conectar
4. **Cache**: Implementar cache de conversas no frontend
5. **Performance**: Implementar virtual scrolling para muitas mensagens
6. **Segurança**: Implementar rate limiting para prevenção de spam
7. **Testes**: Adicionar testes unitários para Services
