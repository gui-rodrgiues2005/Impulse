import React, { useState, useCallback } from "react";
import { ChatWidget } from "./ChatWidget";
import { ChatProvider, useChat } from "../context/ChatContext";
import "../styles/ChatWidgetManager.scss";

export const ChatWidgetContext = React.createContext();

// Inner separado pra poder usar useChat() dentro do ChatProvider
const ChatWidgetManagerInner = ({ children }) => {
  const [openChats, setOpenChats] = useState({});
  const { createOrGetConversation } = useChat(); // ← usa o contexto

  const openChat = useCallback(async (otherUserId, otherUserData) => {
    if (openChats[otherUserId]) return;

    try {
      const conversation = await createOrGetConversation(otherUserId);

      if (!conversation?.id) {
        console.error("Conversa sem ID:", conversation);
        return;
      }

      setOpenChats((prev) => ({
        ...prev,
        [otherUserId]: {
          conversationId: conversation.id,
          otherParticipant: otherUserData,
        },
      }));
    } catch (error) {
      console.error("Erro ao abrir chat:", error);
    }
  }, [openChats, createOrGetConversation]);

  const closeChat = useCallback((otherUserId) => {
    setOpenChats((prev) => {
      const copy = { ...prev };
      delete copy[otherUserId];
      return copy;
    });
  }, []);

  return (
    <ChatWidgetContext.Provider value={{ openChat, closeChat, openChats }}>
      {children}
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

// Wrapper público que fornece o ChatProvider
export const ChatWidgetManager = ({ children }) => (
  <ChatProvider>
    <ChatWidgetManagerInner>{children}</ChatWidgetManagerInner>
  </ChatProvider>
);

export const useChatWidget = () => {
  const context = React.useContext(ChatWidgetContext);
  if (!context) throw new Error("useChatWidget deve ser usado dentro de ChatWidgetManager");
  return context;
};