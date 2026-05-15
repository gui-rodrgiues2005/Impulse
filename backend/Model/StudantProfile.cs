public class StudentProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string? Bio { get; set; }

    public string? Github { get; set; }

    public string? Linkedin { get; set; }

    public string? Course { get; set; }

    public string? University { get; set; }

    public string? Skills { get; set; }

    public string? ProfileImage { get; set; }

    // RELAÇÃO
    public User User { get; set; } = null!;

    public List<Activity> Activities { get; set; }
        = new();
}