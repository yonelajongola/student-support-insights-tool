namespace StudentSupportInsights.DTOs;

public class EthicsNoticeDto
{
    public string PrivacyNotice { get; set; } = string.Empty;
    public string Consent { get; set; } = string.Empty;
    public string ResponsibleUse { get; set; } = string.Empty;
    public List<string> CorePrinciples { get; set; } = new();
    public List<string> FairnessChecks { get; set; } = new();
    public List<string> HumanReviewChecklist { get; set; } = new();
    public List<string> NonAutomatedDecisions { get; set; } = new();
    public List<string> DataProtectionControls { get; set; } = new();
    public List<string> AccountabilityActions { get; set; } = new();
    public string RetentionGuidance { get; set; } = string.Empty;
    public string LastUpdated { get; set; } = string.Empty;
}
