namespace backend.Models
{
    public class ConversationParticipant
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }

        // RELAÇÕES
        public Conversation? Conversation { get; set; }
        public User? User { get; set; }
    }
}
