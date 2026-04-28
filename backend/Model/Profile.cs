using System.ComponentModel.DataAnnotations;

public class Profile
{
    public Guid Id { get; set; }

    public string Bio { get; set; } = string.Empty;

    [Url]
    public string GitHub { get; set; } = string.Empty;

    [Url]
    public string ImagemUrl { get; set; } = string.Empty;

    public string Institution { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;

    public Level Level { get; set; }
    public ActivityType ActivityType { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}