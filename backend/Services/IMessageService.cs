using backend.Dto;
using backend.Models;

namespace backend.Services
{
    public interface IMessageService
    {
        Task<MessageDto?> SendMessageAsync(Guid conversationId, Guid senderId, string content);
        Task<List<MessageDto>> GetConversationMessagesAsync(Guid conversationId);
    }
}
