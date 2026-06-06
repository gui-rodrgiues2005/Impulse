using backend.Dto;
using backend.Models;

namespace backend.Services
{
    public interface IConversationService
    {
        Task<ConversationResponseDto?> GetOrCreateConversationAsync(Guid userId, Guid otherUserId);
        Task<List<ConversationResponseDto>> GetUserConversationsAsync(Guid userId);
        Task<Conversation?> GetConversationByIdAsync(Guid conversationId);
        Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId);
    }
}
