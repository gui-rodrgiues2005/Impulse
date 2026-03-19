public class Activity
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public ActivityType Type { get; set; }
    public string Technologies { get; set; }
    public string Level { get; set; }
    public string ImageUrl { get; set; }
    public string ExternalLink { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public DateTime CreatedAt { get; set; }
}