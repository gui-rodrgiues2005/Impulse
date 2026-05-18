public class RecruiterInvite
{
    public Guid Id { get; set; }

    public Guid CompanyId { get; set; }

    public Guid UserId { get; set; }

    public string Position { get; set; } = string.Empty;

    public bool Accepted { get; set; } = false;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    // RELAÇÕES
    public Company Company { get; set; } = null!;

    public User User { get; set; } = null!;
}