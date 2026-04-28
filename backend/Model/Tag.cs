public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public ICollection<ActivityTag> ActivityTags { get; set; }
}