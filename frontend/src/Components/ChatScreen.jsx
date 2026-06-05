import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import chatService from "../service/chat.service";
import { Send, Phone, Video } from "lucide-react";
import "../styles/ChatScreen.scss";

export const ChatScreen = () => {
  const {
    currentConversation,
    messages,
    sendMessage,
    addMessage,
    error,
    leaveConversation,
  } = useChat();

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const currentMessages = currentConversation
    ? messages[currentConversation.id] || []
    : [];

  useEffect(() => {
    chatService.onReceiveMessage((message) => {
      if (currentConversation?.id === message.conversationId) {
        addMessage(currentConversation.id, message);
      }
    });
    return () => {};
  }, [addMessage, currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const message = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    try {
      await sendMessage(currentConversation.id, message);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setInputValue(message);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentConversation) {
    return (
      <div className="chat-screen empty">
        <div className="empty-state">
          <h2>Selecione uma conversa</h2>
          <p>Escolha uma conversa na lista ou inicie uma nova</p>
        </div>
      </div>
    );
  }

  const otherParticipant = currentConversation.participants[0];

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <div className="chat-user-info">
          {/* Avatar do header */}
          {otherParticipant?.avatarUrl ? (
            <img src={otherParticipant.avatarUrl} alt="avatar" />
          ) : (
            <div className="avatar-placeholder">
              {otherParticipant?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <h2>{otherParticipant?.name || "Usuário"}</h2>
            <p className="user-email">{otherParticipant?.email}</p>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Chamada de voz">
            <Phone size={20} />
          </button>
          <button className="action-btn" title="Chamada de vídeo">
            <Video size={20} />
          </button>
        </div>
      </div>

      <div className="messages-container">
        {currentMessages.length === 0 ? (
          <div className="no-messages">
            <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
          </div>
        ) : (
          currentMessages.map((message) => {
            const isOwnMessage = message.senderId === user.id;
            return (
              <div
                key={message.id}
                className={`message ${isOwnMessage ? "own" : "other"}`}
              >
                {/* Avatar nas mensagens do outro — com fallback */}
                {!isOwnMessage && (
                  message.senderAvatarUrl ? (
                    <img
                      src={message.senderAvatarUrl}
                      alt={message.senderName}
                      className="message-avatar"
                    />
                  ) : (
                    <div className="message-avatar avatar-placeholder">
                      {message.senderName?.charAt(0)?.toUpperCase()}
                    </div>
                  )
                )}
                <div className="message-content">
                  <div className="message-bubble">{message.content}</div>
                  <span className="message-time">
                    {new Date(message.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSending}
          className="message-input"
        />
        <button
          type="submit"
          disabled={isSending || !inputValue.trim()}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};