import * as signalR from "@microsoft/signalr";

class ChatService {
  constructor() {
    this.connection = null;
    this.listeners = {};
  }

  async connect(token) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return this.connection;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5111/api/chat", {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 0, 0, 5000, 5000, 10000])
      .build();

    // Configurar listeners de eventos
    this.connection.on("ReceiveMessage", (message) => {
      if (this.listeners.onReceiveMessage) {
        this.listeners.onReceiveMessage(message);
      }
    });

    this.connection.on("UserJoined", (user) => {
      if (this.listeners.onUserJoined) {
        this.listeners.onUserJoined(user);
      }
    });

    this.connection.on("UserLeft", (user) => {
      if (this.listeners.onUserLeft) {
        this.listeners.onUserLeft(user);
      }
    });

    this.connection.on("Error", (error) => {
      if (this.listeners.onError) {
        this.listeners.onError(error);
      }
    });

    await this.connection.start();
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async joinConversation(conversationId) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("JoinConversation", conversationId);
    }
  }

  async leaveConversation(conversationId) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("LeaveConversation", conversationId);
    }
  }

  async sendMessage(conversationId, content) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("SendMessage", conversationId, content);
    }
  }

  onReceiveMessage(callback) {
    this.listeners.onReceiveMessage = callback;
  }

  onUserJoined(callback) {
    this.listeners.onUserJoined = callback;
  }

  onUserLeft(callback) {
    this.listeners.onUserLeft = callback;
  }

  onError(callback) {
    this.listeners.onError = callback;
  }
}

export default new ChatService();
