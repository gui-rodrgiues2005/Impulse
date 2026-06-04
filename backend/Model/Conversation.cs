namespace backend.Models
{
    public class Conversation
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // RELAÇÕES
        public List<ConversationParticipant> Participants { get; set; } = [];
        public List<Message> Messages { get; set; } = [];
    }
}
