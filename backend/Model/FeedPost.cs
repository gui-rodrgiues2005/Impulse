namespace backend.Models;

public class FeedPost
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string ActivityType { get; set; }

    public string Level { get; set; }

    public string Link { get; set; }

    public string Visibility { get; set; }

    public string? MediaUrl { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public List<Skill> Skills { get; set; }
        = new();
}