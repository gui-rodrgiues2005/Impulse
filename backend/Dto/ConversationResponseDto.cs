namespace backend.Dto
{
    public class ConversationResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ParticipantDto> Participants { get; set; } = [];
        public MessageDto? LastMessage { get; set; }
    }

    public class ParticipantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
    }
}
