const API_URL = "http://localhost:5111/api";

export const conversationAPI = {
  createOrGetConversation: async (token, otherUserId) => {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otherUserId }),
    });
    return response.json();
  },

  getUserConversations: async (token, userId) => {
    const response = await fetch(`${API_URL}/conversations/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export const messageAPI = {
  getConversationMessages: async (token, conversationId) => {
    const response = await fetch(
      `${API_URL}/messages/conversation/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  sendMessage: async (token, conversationId, content) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId, content }),
    });
    return response.json();
  },
};
