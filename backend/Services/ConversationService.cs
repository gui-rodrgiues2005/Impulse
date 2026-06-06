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

            var existingConversation = await _context.Conversations
                .Where(c => c.Participants.Count == 2 &&
                            c.Participants.Any(p => p.UserId == userId) &&
                            c.Participants.Any(p => p.UserId == otherUserId))
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.StudentProfile)
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.CompanyProfile)
                .Include(c => c.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync();

            if (existingConversation != null)
                return MapConversationToDto(existingConversation, userId);

            var conversation = new Conversation();
            var participant1 = new ConversationParticipant { ConversationId = conversation.Id, UserId = userId };
            var participant2 = new ConversationParticipant { ConversationId = conversation.Id, UserId = otherUserId };

            _context.Conversations.Add(conversation);
            _context.ConversationParticipants.AddRange(participant1, participant2);
            await _context.SaveChangesAsync();

            conversation = await _context.Conversations
                .Where(c => c.Id == conversation.Id)
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.StudentProfile)
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.CompanyProfile)
                .Include(c => c.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync();

            return conversation != null ? MapConversationToDto(conversation, userId) : null;
        }

        public async Task<List<ConversationResponseDto>> GetUserConversationsAsync(Guid userId)
        {
            var conversations = await _context.Conversations
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.StudentProfile)
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.CompanyProfile)
                .Include(c => c.Messages)
                    .ThenInclude(m => m.Sender)
                .OrderByDescending(c => c.Messages
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => m.SentAt)
                    .FirstOrDefault())
                .ToListAsync();

            // ✅ Passa userId para filtrar o próprio usuário dos participantes
            return conversations.Select(c => MapConversationToDto(c, userId)).ToList();
        }

        public async Task<Conversation?> GetConversationByIdAsync(Guid conversationId)
        {
            return await _context.Conversations
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .Include(c => c.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }

        public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId)
        {
            return await _context.ConversationParticipants
                .AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId);
        }

        private ConversationResponseDto MapConversationToDto(Conversation conversation, Guid currentUserId)
        {
            var lastMessage = conversation.Messages
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefault();

            return new ConversationResponseDto
            {
                Id = conversation.Id,
                CreatedAt = conversation.CreatedAt,

                // ✅ Remove o próprio usuário da lista — participants[0] agora é sempre o outro
                Participants = conversation.Participants
                    .Where(p => p.UserId != currentUserId)
                    .Select(p => new ParticipantDto
                    {
                        Id = p.User!.Id,
                        Name = p.User.Name,
                        Email = p.User.Email,
                        // Resolve o avatar pela seguinte prioridade:
                        // 1. CompanyProfile.ProfileImage (empresa)
                        // 2. StudentProfile.ProfileImage (estudante)
                        // 3. User.AvatarUrl (fallback genérico)
                        AvatarUrl =
                            p.User.CompanyProfile?.ProfileImage
                            ?? p.User.StudentProfile?.ProfileImage
                            ?? p.User.AvatarUrl
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