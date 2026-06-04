namespace StudentSupportInsights.DTOs;

public class UploadResultDto
{
    public int ImportedCount { get; set; }
    public int RejectedCount { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<ValidationErrorDto> ValidationErrors { get; set; } = new();
}
