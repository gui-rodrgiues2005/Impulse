namespace backend.Models
{
    public class Job
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Area { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Status { get; set; } = "Aberta";

        public int Candidates { get; set; } = 0;

        public Guid CompanyId { get; set; }

        public Company? Company { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}