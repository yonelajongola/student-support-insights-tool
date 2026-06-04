using Microsoft.AspNetCore.Mvc;
using StudentSupportInsights.Services;

namespace StudentSupportInsights.Controllers;

/* InsightsController
 * Exposes analytics and recommendation endpoints derived from learner data.
 * Base route: api/insights
 */
[ApiController]
[Route("api/[controller]")]
public class InsightsController : ControllerBase
{
    private readonly InsightsService _insightsService;

    /* Constructor — injects InsightsService via dependency injection */
    public InsightsController(InsightsService insightsService)
    {
        _insightsService = insightsService;
    }

    /* GET api/insights/dashboard
     * Returns aggregated distribution counts for attendance risk,
     * support needs, and device access across all learners.
     */
    [HttpGet("dashboard")]
    public IActionResult Dashboard()
    {
        return Ok(_insightsService.GetDashboardSummary());
    }

    /* GET api/insights/risk-flags
     * Returns a list of learners flagged as high-risk with reasons.
     */
    [HttpGet("risk-flags")]
    public IActionResult RiskFlags()
    {
        return Ok(_insightsService.GetRiskFlags());
    }

    /* GET api/insights/recommendations
     * Returns three actionable support recommendations based on
     * connectivity, attendance risk, and confidence data.
     */
    [HttpGet("recommendations")]
    public IActionResult Recommendations()
    {
        return Ok(_insightsService.GetRecommendations());
    }

    /* GET api/insights/insights
     * Returns a set of plain-language analytics insight strings
     * summarising key patterns in the current learner data.
     */
    [HttpGet("insights")]
    public IActionResult Insights()
    {
        return Ok(_insightsService.GetAnalyticsInsights());
    }
}
