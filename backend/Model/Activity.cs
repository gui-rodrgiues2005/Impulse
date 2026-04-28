public class Activity
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public ActivityType Type { get; set; }
    public Level Level { get; set; }
    public string ImageUrl { get; set; }
    public string ExternalLink { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }

    public ICollection<ActivityTag> ActivityTags { get; set; }
}