namespace backend.Dto
{
    public class SendMessageDto
    {
        public Guid ConversationId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
