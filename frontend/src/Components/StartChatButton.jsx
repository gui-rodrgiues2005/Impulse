import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { MessageCircle } from "lucide-react";
import "../styles/StartChatButton.scss";

export const StartChatButton = ({ userId, userName, avatarUrl }) => {
  const { createOrGetConversation } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Não permitir iniciar conversa consigo mesmo
  if (user.id === userId) {
    return null;
  }

  const handleStartChat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await createOrGetConversation(userId);
      // Redirecionar para página de chat se necessário
      window.location.href = "/chat";
    } catch (err) {
      setError("Erro ao iniciar conversa");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="start-chat-button">
      <button
        onClick={handleStartChat}
        disabled={isLoading}
        className="chat-btn"
        title={`Enviar mensagem para ${userName}`}
      >
        <MessageCircle size={20} />
        {isLoading ? "Carregando..." : "Enviar Mensagem"}
      </button>
      {error && <span className="error">{error}</span>}
    </div>
  );
};
