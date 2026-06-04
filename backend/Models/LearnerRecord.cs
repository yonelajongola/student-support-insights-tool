namespace StudentSupportInsights.Models;

public class LearnerRecord
{
    public string LearnerId { get; set; } = string.Empty;
    public string AgeBand { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string DeviceAccess { get; set; } = string.Empty;
    public string InternetAccess { get; set; } = string.Empty;
    public int DigitalConfidence { get; set; }
    public int ProgrammingConfidence { get; set; }
    public int AiFamiliarity { get; set; }
    public string EmploymentStatus { get; set; } = string.Empty;
    public string SupportNeed { get; set; } = string.Empty;
    public string AttendanceRisk { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
