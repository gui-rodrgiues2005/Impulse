namespace API.DTOs.Feed;

public class CreateFeedPostDto
{
    public string Title { get; set; }

    public string Description { get; set; }

    public string ActivityType { get; set; }

    public string Level { get; set; }

    public string Link { get; set; }

    public string Visibility { get; set; }
    public string? CommentPermission { get; set; }

    public string? MediaUrl { get; set; }

    public List<Guid> SkillIds { get; set; }
}