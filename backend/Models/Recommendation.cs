namespace StudentSupportInsights.Models;

public class Recommendation
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string AffectedLearnerIds { get; set; } = string.Empty;
}
