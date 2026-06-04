namespace StudentSupportInsights.DTOs;

public class ValidationErrorDto
{
    public int? LineNumber { get; set; }
    public string Field { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}