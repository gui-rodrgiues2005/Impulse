using backend.Dto;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services
{
    public class ConversationService : IConversationService
    {
        private readonly AppDbContext _context;

        public ConversationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ConversationResponseDto?> GetOrCreateConversationAsync(Guid userId, Guid otherUserId)
        {
            if (userId == otherUserId)
                return null;

            // Verificar se existe conversa entre os dois usuários
            var existingConversation = await _context.Conversations
                .Where(c => c.Participants.Count == 2 &&
                            c.Participants.Any(p => p.UserId == userId) &&
                            c.Participants.Any(p => p.UserId == otherUserId))
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync();

            if (existingConversation != null)
                return MapConversationToDto(existingConversation);

            // Criar nova conversa
            var conversation = new Conversation();
            var participant1 = new ConversationParticipant { ConversationId = conversation.Id, UserId = userId };
            var participant2 = new ConversationParticipant { ConversationId = conversation.Id, UserId = otherUserId };

            _context.Conversations.Add(conversation);
            _context.ConversationParticipants.AddRange(participant1, participant2);
            await _context.SaveChangesAsync();

            // Recarregar a conversa com dados
            conversation = await _context.Conversations
                .Where(c => c.Id == conversation.Id)
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync();

            return conversation != null ? MapConversationToDto(conversation) : null;
        }

        public async Task<List<ConversationResponseDto>> GetUserConversationsAsync(Guid userId)
        {
            var conversations = await _context.Conversations
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .Include(c => c.Messages)
                .OrderByDescending(c => c.Messages.Max(m => m.SentAt))
                .ToListAsync();

            return conversations.Select(MapConversationToDto).ToList();
        }

        public async Task<Conversation?> GetConversationByIdAsync(Guid conversationId)
        {
            return await _context.Conversations
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }

        public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId)
        {
            return await _context.ConversationParticipants
                .AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId);
        }

        private ConversationResponseDto MapConversationToDto(Conversation conversation)
        {
            var lastMessage = conversation.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();

            return new ConversationResponseDto
            {
                Id = conversation.Id,
                CreatedAt = conversation.CreatedAt,
                Participants = conversation.Participants
                    .Select(p => new ParticipantDto
                    {
                        Id = p.User!.Id,
                        Name = p.User.Name,
                        Email = p.User.Email,
                        AvatarUrl = p.User.AvatarUrl
                    })
                    .ToList(),
                LastMessage = lastMessage != null ? new MessageDto
                {
                    Id = lastMessage.Id,
                    ConversationId = lastMessage.ConversationId,
                    SenderId = lastMessage.SenderId,
                    SenderName = lastMessage.Sender!.Name,
                    SenderAvatarUrl = lastMessage.Sender.AvatarUrl,
                    Content = lastMessage.Content,
                    SentAt = lastMessage.SentAt
                } : null
            };
        }
    }
}
