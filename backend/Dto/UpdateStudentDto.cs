namespace backend.Dtos;

public class UpdateStudentDto
{
    public string Name { get; set; } = string.Empty;
    public string Course { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string ProfileImage { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Linkedin { get; set; }
    public string? Github { get; set; }
    public string? University { get; set; }
    public string? Location { get; set; }
   public List<string> Skills { get; set; } = new List<string>();
}