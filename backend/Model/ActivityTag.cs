
// Uma Activity pode ter várias Tags, e uma Tag pode estar em várias Activities.
// Representa a relação muitos-para-muitos entre Activity e Tag.
// Cada registro liga uma Activity a uma Tag.


public class ActivityTag
{
    public Guid ActivityId { get; set; }
    public Guid TagId { get; set; }

    public Activity Activity { get; set; }
    public Tag Tag { get; set; }
}