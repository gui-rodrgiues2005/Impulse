namespace API.DTOs.Feed;

public class FeedPostResponseDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string UserName { get; set; }

    public string UserAvatar { get; set; }

    public string UserRole { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string ActivityType { get; set; }

    public string Level { get; set; }

    public string Link { get; set; }

    public string Visibility { get; set; }

    public string? MediaUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<string> Skills { get; set; }
}