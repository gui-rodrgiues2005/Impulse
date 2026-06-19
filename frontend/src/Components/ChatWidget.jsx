import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import chatService from "../service/chat.service";
import { X, Minimize2, Maximize2, Send } from "lucide-react";
import "../styles/ChatWidget.scss";

export const ChatWidget = ({
  conversationId,
  otherParticipant,
  onClose,
}) => {
  const { messages, addMessage, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const conversationMessages = messages[conversationId] || [];

  // ✅ SUBSTITUA POR ESSE
  useEffect(() => {
    if (!conversationId) return;

    chatService.onReceiveMessage((message) => {
      if (message.conversationId === conversationId) {
        addMessage(conversationId, message);
      }
    });
  }, [conversationId, addMessage]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    try {
      // Usar sendMessage do contexto que salva no banco e atualiza o estado
      await sendMessage(conversationId, content);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setInputValue(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`chat-widget ${isMinimized ? "minimized" : ""}`}>
      {/* Header */}
      <div className="chat-widget-header">
        <div className="chat-widget-user-info">
          {!isMinimized && (
            <>
              {otherParticipant?.avatarUrl ? (
                <img src={otherParticipant.avatarUrl} alt="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {otherParticipant?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="user-info">
                <h4>{otherParticipant?.name}</h4>
              </div>
            </>
          )}
        </div>

        <div className="chat-widget-actions">
          <button
            className="widget-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Restaurar" : "Minimizar"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            className="widget-btn close"
            onClick={onClose}
            title="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="chat-widget-messages">
            {conversationMessages.length === 0 ? (
              <div className="no-messages">
                <p>Nenhuma mensagem ainda</p>
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isOwn = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`widget-message ${isOwn ? "own" : "other"}`}
                  >
                    <div className="widget-message-bubble">{msg.content}</div>
                    <span className="widget-message-time">
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chat-widget-form">
            <input
              type="text"
              placeholder="Digite..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              className="widget-input"
            />
            <button
              type="submit"
              disabled={isSending || !inputValue.trim()}
              className="widget-send"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
