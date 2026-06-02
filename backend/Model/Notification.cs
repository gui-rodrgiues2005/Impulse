namespace backend.Models
{
    public class Notification
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Empresa que vai receber a notificação
        public Guid CompanyId { get; set; }
        public Company? Company { get; set; }

        // Vaga relacionada
        public Guid JobId { get; set; }
        public Job? Job { get; set; }

        // Aluno que se candidatou
        public Guid StudentUserId { get; set; }
        public User? StudentUser { get; set; }
    }
}