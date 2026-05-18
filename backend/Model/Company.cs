public class Company
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Website { get; set; }

    public string? LogoUrl { get; set; }

    public string? Location { get; set; }

    // RELAÇÕES
    public List<RecruiterProfile> Recruiters { get; set; }
        = new();

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

}