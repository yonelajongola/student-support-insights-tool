namespace StudentSupportInsights.DTOs;

public class RiskFlagDto
{
    public string LearnerId { get; set; } = string.Empty;
    public string AttendanceRisk { get; set; } = string.Empty;
    public string SupportNeed { get; set; } = string.Empty;
    public string InternetAccess { get; set; } = string.Empty;
    public string DeviceAccess { get; set; } = string.Empty;
    public string RiskReason { get; set; } = string.Empty;
    public List<string> RiskFactors { get; set; } = new();
    public List<string> RiskReasonCodes { get; set; } = new();
    public int RiskScore { get; set; }
    public string Priority { get; set; } = string.Empty;
}