
public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }

    public string Bio { get; set; }
    public string Github { get; set; }

    public List<ActivityType> Activities { get; set; }
}