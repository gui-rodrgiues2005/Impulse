namespace API.DTOs.Recruiter;

public class TalentResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Course { get; set; }

    public string Level { get; set; }

    public string Description { get; set; }

    public string AvatarUrl { get; set; }

    public List<string> Skills { get; set; } = [];
}