import React, { useState, useCallback } from "react";
import { ChatWidget } from "./ChatWidget";
import { conversationAPI, messageAPI } from "../service/api.service";
import "../styles/ChatWidgetManager.scss";

export const ChatWidgetManager = ({ children }) => {
  const [openChats, setOpenChats] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const openChat = useCallback(
    async (otherUserId, otherUserData) => {
      if (openChats[otherUserId]) return; // Já aberto

      try {
        // Criar ou obter conversa
        const conversation = await conversationAPI.createOrGetConversation(
          token,
          otherUserId
        );

        // Carregar histórico de mensagens
        const messagesData = await messageAPI.getConversationMessages(
          token,
          conversation.id
        );

        setOpenChats((prev) => ({
          ...prev,
          [otherUserId]: {
            conversationId: conversation.id,
            otherParticipant: otherUserData,
            messages: messagesData || [],
          },
        }));
      } catch (error) {
        console.error("Erro ao abrir chat:", error);
      }
    },
    [openChats, token]
  );

  const closeChat = useCallback((otherUserId) => {
    setOpenChats((prev) => {
      const newChats = { ...prev };
      delete newChats[otherUserId];
      return newChats;
    });
  }, []);

  const addMessageToChat = useCallback((conversationId, message) => {
    setOpenChats((prev) => {
      const newChats = { ...prev };
      Object.keys(newChats).forEach((userId) => {
        if (newChats[userId].conversationId === conversationId) {
          newChats[userId].messages.push(message);
        }
      });
      return newChats;
    });
  }, []);

  const value = {
    openChat,
    closeChat,
    addMessageToChat,
    openChats,
  };

  return (
    <ChatWidgetContext.Provider value={value}>
      {children}

      {/* Renderizar widgets abertos */}
      <div className="chat-widgets-container">
        {Object.entries(openChats).map(([userId, chatData]) => (
          <ChatWidget
            key={userId}
            conversationId={chatData.conversationId}
            otherParticipant={chatData.otherParticipant}
            onClose={() => closeChat(userId)}
          />
        ))}
      </div>
    </ChatWidgetContext.Provider>
  );
};

export const ChatWidgetContext = React.createContext();

export const useChatWidget = () => {
  const context = React.useContext(ChatWidgetContext);
  if (!context) {
    throw new Error("useChatWidget deve ser usado dentro de ChatWidgetManager");
  }
  return context;
};
