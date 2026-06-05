using API.Models;
using backend.Models;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Course { get; set; }
    public string? Level { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // RELAÇÕES
    public StudentProfile? StudentProfile { get; set; }
    public Company? CompanyProfile { get; set; }
    public List<Talent> Talents { get; set; } = [];
    public List<Skill> Skills { get; set; } = [];
    public List<SavedTalent> SavedTalents { get; set; } = [];

    // CHAT
    public List<ConversationParticipant> ConversationParticipants { get; set; } = [];
    public List<Message> SentMessages { get; set; } = [];
}