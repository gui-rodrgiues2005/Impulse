import React, { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { MessageSquare } from "lucide-react";
import "../styles/ConversationList.scss";

export const ConversationList = ({ onSelectConversation }) => {
  const { conversations, isLoading, loadConversations, currentConversation } =
    useChat();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  if (isLoading && conversations.length === 0) {
    return <div className="conversation-list loading">Carregando...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="conversation-list empty">
        <MessageSquare size={48} />
        <p>Nenhuma conversa iniciada</p>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <h2>Mensagens</h2>
      <div className="conversations-container">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants[0];
          const isActive = currentConversation?.id === conversation.id;

          return (
            <div
              key={conversation.id}
              className={`conversation-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="conversation-avatar">
                {otherParticipant?.avatarUrl ? (
                  <img src={otherParticipant.avatarUrl} alt="avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {otherParticipant?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="conversation-info">
                <h3>{otherParticipant?.name || "Usuário"}</h3>
                <p className="last-message">
                  {conversation.lastMessage?.content || "Nenhuma mensagem"}
                </p>
              </div>
              {conversation.lastMessage && (
                <span className="timestamp">
                  {new Date(conversation.lastMessage.sentAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
