using System.ComponentModel.DataAnnotations;

public class StudentProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [MaxLength(2000)]
    public string? Bio { get; set; }
    [MaxLength(2000)]
    public string? Github { get; set; }
    [MaxLength(2000)]
    public string? Linkedin { get; set; }
    public string? Course { get; set; }
    public string? University { get; set; }
    public string? ProfileImage { get; set; }
    public string? Location { get; set; }
    public byte[]? ResumoArquivo { get; set; }
    public string? ResumoContentType { get; set; }
    public string? ResumoUrl { get; set; }
    public User User { get; set; } = null!;
}