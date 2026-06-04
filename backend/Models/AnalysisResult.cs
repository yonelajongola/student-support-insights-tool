namespace StudentSupportInsights.Models;

public class AnalysisResult
{
    public int Id { get; set; }
    public int LearnerId { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public int RiskScore { get; set; }
    public string Recommendations { get; set; } = string.Empty;
}
