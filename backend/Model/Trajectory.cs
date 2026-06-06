namespace backend.Models
{
    public class Trajectory
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty; // Projeto Acadêmico, Pesquisa, etc.

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; } // null = acontecendo agora

        public bool IsOngoing { get; set; } = false;

        public string? Description { get; set; }

        // Referência opcional à publicação que originou
        public Guid? FeedPostId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relações
        public User User { get; set; } = null!;
        public FeedPost? FeedPost { get; set; }
    }
}