namespace API.Models;

public class Talent
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Course { get; set; }

    public string Level { get; set; }

    public string Description { get; set; }

    public string AvatarUrl { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; }

    public List<Skill> Skills { get; set; } = [];
}