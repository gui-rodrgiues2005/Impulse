public class RecruiterProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid CompanyId { get; set; }

    public string? Position { get; set; }

    public string? ProfileImage { get; set; }

    // RELAÇÕES
    public User User { get; set; } = null!;

    public Company Company { get; set; } = null!;
}