namespace API.Models;

public class SavedTalent
{
    public Guid Id { get; set; }

    public Guid CompanyId { get; set; }

    public User Company { get; set; }

    public Guid StudentId { get; set; }

    public User Student { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
}