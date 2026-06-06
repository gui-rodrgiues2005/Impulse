import React from "react";
import { ChatProvider, useChat } from "../context/ChatContext";
import { ConversationList } from "../Components/ConversationList";
import { ChatScreen } from "../Components/ChatScreen";
import "../styles/ChatPage.scss";

const ChatPageContent = () => {
  const { selectConversation } = useChat();

  const handleSelectConversation = async (conversationId) => {
    await selectConversation(conversationId);
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <div className="chat-sidebar">
          <ConversationList onSelectConversation={handleSelectConversation} />
        </div>
        <div className="chat-main">
          <ChatScreen />
        </div>
      </div>
    </div>
  );
};

export const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};
