import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import chatService from "../service/chat.service";
import { conversationAPI, messageAPI } from "../service/api.service";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  // Mudar para dicionário: { conversationId: [messages] }
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Configurar listener global para mensagens em tempo real
  useEffect(() => {
    chatService.onReceiveMessage((message) => {
      const conversationId = message.conversationId;
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }));
    });
  }, []);

  const loadConversations = useCallback(async () => {
    if (!token || !user?.id) return;
    try {
      setIsLoading(true);
      const data = await conversationAPI.getUserConversations(token, user.id);
      setConversations(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);

  const selectConversation = useCallback(
    async (conversationId) => {
      if (!token) return;
      try {
        setIsLoading(true);
        const conversationData = conversations.find(
          (c) => c.id === conversationId
        );
        setCurrentConversation(conversationData);

        // Carregar histórico de mensagens
        const messagesData = await messageAPI.getConversationMessages(
          token,
          conversationId
        );
        setMessages((prev) => ({
          ...prev,
          [conversationId]: Array.isArray(messagesData) ? messagesData : [],
        }));

        // Conectar ao SignalR
        await chatService.connect(token);
        await chatService.joinConversation(conversationId);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token, conversations]
  );

  const createOrGetConversation = useCallback(
    async (otherUserId) => {
      if (!token) return;
      try {
        setIsLoading(true);
        const data = await conversationAPI.createOrGetConversation(
          token,
          otherUserId
        );
        setCurrentConversation(data);

        // Carregar histórico
        const messagesData = await messageAPI.getConversationMessages(
          token,
          data.id
        );
        setMessages((prev) => ({
          ...prev,
          [data.id]: Array.isArray(messagesData) ? messagesData : [],
        }));

        // Conectar ao SignalR
        await chatService.connect(token);
        await chatService.joinConversation(data.id);

        setError(null);
        return data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!token) return;
      try {
        // Enviar via API HTTP para salvar no banco
        const response = await messageAPI.sendMessage(token, conversationId, content);
        if (response) {
          // Adicionar mensagem ao contexto imediatamente
          addMessage(conversationId, response);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const addMessage = useCallback((conversationId, message) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));
  }, []);

  const leaveConversation = useCallback(async () => {
    if (currentConversation) {
      await chatService.leaveConversation(currentConversation.id);
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const value = {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    selectConversation,
    createOrGetConversation,
    sendMessage,
    addMessage,
    leaveConversation,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat deve ser usado dentro de ChatProvider");
  }
  return context;
};
