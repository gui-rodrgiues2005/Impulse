namespace backend.Dtos
{
    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;

        public string Area { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string? Status { get; set; }
    }
}