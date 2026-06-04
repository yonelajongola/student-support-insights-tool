namespace StudentSupportInsights.DTOs;

public class DashboardSummaryDto
{
    public int TotalLearners { get; set; }
    public int HighRiskCount { get; set; }
    public int MediumRiskCount { get; set; }
    public int LowRiskCount { get; set; }
    public int CriticalRiskCount { get; set; }
    public double DeviceGapPercent { get; set; }
    public double InternetRiskPercent { get; set; }
    public double AverageDigitalConfidence { get; set; }
    public double AverageProgrammingConfidence { get; set; }
    public double AverageAiFamiliarity { get; set; }
    public string TopSupportNeed { get; set; } = string.Empty;
    public double DataQualityScore { get; set; }
    public Dictionary<string, int> RiskCategoryDistribution { get; set; } = new();
    public Dictionary<string, int> AttendanceRiskDistribution { get; set; } = new();
    public Dictionary<string, int> SupportNeedDistribution { get; set; } = new();
    public Dictionary<string, int> DeviceAccessDistribution { get; set; } = new();
    public Dictionary<string, Dictionary<string, int>> InternetAccessByProvince { get; set; } = new();
}
