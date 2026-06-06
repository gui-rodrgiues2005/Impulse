namespace backend.Dtos
{
    public class CreateTrajectoryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsOngoing { get; set; } = false;
        public string? Description { get; set; }
        public Guid? FeedPostId { get; set; }
    }

    public class UpdateTrajectoryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsOngoing { get; set; } = false;
        public string? Description { get; set; }
    }

    public class TrajectoryResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsOngoing { get; set; }
        public string? Description { get; set; }
        public Guid? FeedPostId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}