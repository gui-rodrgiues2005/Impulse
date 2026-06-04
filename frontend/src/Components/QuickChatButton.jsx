import React from "react";
import { useChatWidget } from "./ChatWidgetManager";
import { MessageCircle } from "lucide-react";
import "../styles/QuickChatButton.scss";

export const QuickChatButton = ({ userId, userName, avatarUrl }) => {
  const { openChat } = useChatWidget();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Não permitir chat consigo mesmo
  if (user.id === userId) {
    return null;
  }

  const handleClick = () => {
    openChat(userId, {
      id: userId,
      name: userName,
      email: "", // Você pode adicionar email se necessário
      avatarUrl: avatarUrl,
    });
  };

  return (
    <button className="quick-chat-btn" onClick={handleClick} title="Enviar mensagem">
      <MessageCircle size={18} />
      <span>Mensagem</span>
    </button>
  );
};
