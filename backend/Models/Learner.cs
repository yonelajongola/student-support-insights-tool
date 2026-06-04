namespace StudentSupportInsights.Models;

public class Learner
{
    public int Id { get; set; }
    public string LearnerId { get; set; } = string.Empty;
    public string AgeBand { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string DeviceAccess { get; set; } = string.Empty;
    public string InternetAccess { get; set; } = string.Empty;
    public int DigitalConfidence { get; set; }
    public int ProgrammingConfidence { get; set; }
    public int AIFamiliarity { get; set; }
    public string EmploymentStatus { get; set; } = string.Empty;
    public string SupportNeed { get; set; } = string.Empty;
    public string AttendanceRisk { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
