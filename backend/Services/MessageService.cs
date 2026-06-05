using backend.Dto;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _context;

        public MessageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MessageDto?> SendMessageAsync(Guid conversationId, Guid senderId, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return null;

            var conversation = await _context.Conversations.FindAsync(conversationId);
            if (conversation == null)
                return null;

            var isParticipant = await _context.ConversationParticipants
                .AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == senderId);
            if (!isParticipant)
                return null;

            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // ✅ Include dos perfis para resolver o avatar corretamente
            var savedMessage = await _context.Messages
                .Include(m => m.Sender)
                    .ThenInclude(s => s.StudentProfile)
                .Include(m => m.Sender)
                    .ThenInclude(s => s.CompanyProfile)
                .FirstOrDefaultAsync(m => m.Id == message.Id);

            return savedMessage != null ? MapMessageToDto(savedMessage) : null;
        }

        public async Task<List<MessageDto>> GetConversationMessagesAsync(Guid conversationId)
        {
            // ✅ Include dos perfis para resolver o avatar corretamente
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Sender)
                    .ThenInclude(s => s.StudentProfile)
                .Include(m => m.Sender)
                    .ThenInclude(s => s.CompanyProfile)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages.Select(MapMessageToDto).ToList();
        }

        private MessageDto MapMessageToDto(Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                SenderName = message.Sender?.Name ?? "Unknown",
                // ✅ Resolve pelo perfil correto, igual ao ConversationService
                SenderAvatarUrl =
                    message.Sender?.CompanyProfile?.ProfileImage
                    ?? message.Sender?.StudentProfile?.ProfileImage
                    ?? message.Sender?.AvatarUrl,
                Content = message.Content,
                SentAt = message.SentAt
            };
        }
    }
}