namespace backend.Models
{
    public class JobApplication
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid JobId { get; set; }
        public Job? Job { get; set; }

        public Guid StudentUserId { get; set; }
        public User? StudentUser { get; set; }

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pendente";

        // Origem da candidatura (Indicação, LinkedIn, Outros, Plataforma)
        public string? Source { get; set; }
    }
}