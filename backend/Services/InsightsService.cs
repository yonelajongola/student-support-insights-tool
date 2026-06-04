using StudentSupportInsights.DTOs;
using StudentSupportInsights.Models;

namespace StudentSupportInsights.Services;

/* InsightsService
 * Contains all analytics logic for deriving risk flags, recommendations,
 * and dashboard summaries from the learner data set.
 * Depends on LearnerDataService for raw record access.
 */
public class InsightsService
{
    private const string CategoryLow = "Low";
    private const string CategoryMedium = "Medium";
    private const string CategoryHigh = "High";
    private const string CategoryCritical = "Critical";

    private readonly LearnerDataService _dataService;

    /* Constructor — injects LearnerDataService via dependency injection */
    public InsightsService(LearnerDataService dataService)
    {
        _dataService = dataService;
    }

    /* GetDashboardSummary
     * Aggregates total learner count and distribution breakdowns for
     * attendance risk, support need, and device access.
     */
    public DashboardSummaryDto GetDashboardSummary()
    {
        var learners = _dataService.GetAll();
        var riskProfiles = learners.Select(EvaluateRisk).ToList();
        var totalLearners = learners.Count;
        var internetRiskCount = learners.Count(x => x.InternetAccess.Equals("Limited", StringComparison.OrdinalIgnoreCase) || x.InternetAccess.Equals("Unstable", StringComparison.OrdinalIgnoreCase));
        var deviceGapCount = learners.Count(x => x.DeviceAccess.Equals("Phone only", StringComparison.OrdinalIgnoreCase) || x.DeviceAccess.Equals("Shared laptop", StringComparison.OrdinalIgnoreCase));

        return new DashboardSummaryDto
        {
            TotalLearners = totalLearners,
            HighRiskCount = riskProfiles.Count(x => x.Category == CategoryHigh),
            MediumRiskCount = riskProfiles.Count(x => x.Category == CategoryMedium),
            LowRiskCount = riskProfiles.Count(x => x.Category == CategoryLow),
            CriticalRiskCount = riskProfiles.Count(x => x.Category == CategoryCritical),
            DeviceGapPercent = Percentage(deviceGapCount, totalLearners),
            InternetRiskPercent = Percentage(internetRiskCount, totalLearners),
            AverageDigitalConfidence = AverageOrZero(learners.Select(x => x.DigitalConfidence)),
            AverageProgrammingConfidence = AverageOrZero(learners.Select(x => x.ProgrammingConfidence)),
            AverageAiFamiliarity = AverageOrZero(learners.Select(x => x.AiFamiliarity)),
            TopSupportNeed = TopSupportNeed(learners),
            DataQualityScore = CalculateDataQualityScore(learners),
            RiskCategoryDistribution = GroupCounts(riskProfiles.Select(x => x.Category)),
            AttendanceRiskDistribution = GroupCounts(learners.Select(x => x.AttendanceRisk)),
            SupportNeedDistribution = GroupCounts(ExplodeSupportNeeds(learners.Select(x => x.SupportNeed))),
            DeviceAccessDistribution = GroupCounts(learners.Select(x => x.DeviceAccess)),
            InternetAccessByProvince = learners
                .GroupBy(x => x.Province)
                .OrderBy(g => g.Key)
                .ToDictionary(
                    g => g.Key,
                    g => GroupCounts(g.Select(x => x.InternetAccess)))
        };
    }

    /* GetRiskFlags
     * Filters learners matching the high-risk criteria and returns
     * their ID, risk fields, and a human-readable reason string.
     */
    public List<RiskFlagDto> GetRiskFlags()
    {
        var learners = _dataService.GetAll();
        return learners.Select(learner =>
        {
            var evaluation = EvaluateRisk(learner);

            return new RiskFlagDto
            {
                LearnerId = learner.LearnerId,
                AttendanceRisk = learner.AttendanceRisk,
                SupportNeed = learner.SupportNeed,
                InternetAccess = learner.InternetAccess,
                DeviceAccess = learner.DeviceAccess,
                RiskReason = string.Join(", ", evaluation.ReasonCodes),
                RiskFactors = evaluation.ReasonCodes,
                RiskReasonCodes = evaluation.ReasonCodes,
                RiskScore = evaluation.Score,
                Priority = evaluation.Category
            };
        })
        .Where(x => x.Priority is CategoryHigh or CategoryCritical)
        .OrderByDescending(x => x.RiskScore)
        .ThenBy(x => x.LearnerId)
        .ToList();
    }

    /* GetRecommendations
     * Generates three fixed support recommendations with rationale counts
     * derived from the current learner data (connectivity, risk, confidence).
     */
    public List<RecommendationDto> GetRecommendations()
    {
        var learners = _dataService.GetAll();
        var riskProfiles = learners.Select(EvaluateRisk).ToList();
        var internetRiskCount = learners.Count(x => x.InternetAccess.Equals("Limited", StringComparison.OrdinalIgnoreCase) ||
                                                   x.InternetAccess.Equals("Unstable", StringComparison.OrdinalIgnoreCase));
        var highRiskCount = riskProfiles.Count(x => x.Category is CategoryHigh or CategoryCritical);
        var lowConfidenceCount = learners.Count(x => x.DigitalConfidence <= 2 || x.ProgrammingConfidence <= 2 || x.AiFamiliarity <= 2);

        return new List<RecommendationDto>
        {
            new()
            {
                Title = "Provide connectivity and device support",
                Rationale = $"{internetRiskCount} learners report limited or unstable internet and a meaningful share rely on phone-only or shared-device access.",
                Action = "Prioritize data vouchers and device-lending slots for affected learners."
            },
            new()
            {
                Title = "Launch targeted attendance support",
                Rationale = $"{highRiskCount} learners match high-risk conditions (high attendance risk and confidence/access constraints).",
                Action = "Assign weekly mentor check-ins and transport follow-up for flagged learners."
            },
            new()
            {
                Title = "Introduce confidence-boost learning clinics",
                Rationale = $"{lowConfidenceCount} learners show low average confidence in digital/programming/AI skills.",
                Action = "Run short practical labs and peer tutoring focused on foundational tasks."
            }
        };
    }

    /* GetAnalyticsInsights
     * Returns a list of plain-language insight strings summarising
     * key patterns: risk counts, device access, support needs, internet
     * availability, and average digital confidence score.
     */
    public object GetAnalyticsInsights()
    {
        var learners = _dataService.GetAll();
        var total = Math.Max(learners.Count, 1);
        var summary = GetDashboardSummary();

        var insights = new List<string>
        {
            $"High or critical risk learners: {summary.HighRiskCount + summary.CriticalRiskCount} of {learners.Count} ({Percentage(summary.HighRiskCount + summary.CriticalRiskCount, total)}%).",
            $"Medium risk learners: {summary.MediumRiskCount} of {learners.Count} ({Percentage(summary.MediumRiskCount, total)}%).",
            $"Top support need currently recorded: {summary.TopSupportNeed}.",
            $"Internet risk affects {summary.InternetRiskPercent:0.0}% of learners.",
            $"Average digital confidence score: {summary.AverageDigitalConfidence:0.0} out of 5.",
            $"Data quality score is {summary.DataQualityScore:0.0}% based on completeness and valid controlled values."
        };

        return new { Insights = insights };
    }

    private static RiskEvaluation EvaluateRisk(LearnerRecord learner)
    {
        var reasonCodes = new List<string>();
        var score = 0;
        var supportNeeds = ExplodeSupportNeeds(new[] { learner.SupportNeed });

        if (learner.AttendanceRisk.Equals(CategoryHigh, StringComparison.OrdinalIgnoreCase))
        {
            score += 30;
            reasonCodes.Add("ATTENDANCE_HIGH");
        }
        else if (learner.AttendanceRisk.Equals(CategoryMedium, StringComparison.OrdinalIgnoreCase))
        {
            score += 15;
            reasonCodes.Add("ATTENDANCE_MEDIUM");
        }

        if (learner.DeviceAccess.Equals("Phone only", StringComparison.OrdinalIgnoreCase))
        {
            score += 20;
            reasonCodes.Add("DEVICE_PHONE_ONLY");
        }
        else if (learner.DeviceAccess.Equals("Shared laptop", StringComparison.OrdinalIgnoreCase))
        {
            score += 10;
            reasonCodes.Add("DEVICE_SHARED_LAPTOP");
        }

        if (learner.InternetAccess.Equals("Limited", StringComparison.OrdinalIgnoreCase))
        {
            score += 20;
            reasonCodes.Add("INTERNET_LIMITED");
        }
        else if (learner.InternetAccess.Equals("Unstable", StringComparison.OrdinalIgnoreCase))
        {
            score += 12;
            reasonCodes.Add("INTERNET_UNSTABLE");
        }

        if (learner.DigitalConfidence <= 2)
        {
            score += 15;
            reasonCodes.Add("DIGITAL_CONFIDENCE_LOW");
        }

        if (learner.ProgrammingConfidence <= 2)
        {
            score += 15;
            reasonCodes.Add("PROGRAMMING_CONFIDENCE_LOW");
        }

        if (learner.AiFamiliarity <= 2)
        {
            score += 8;
            reasonCodes.Add("AI_FAMILIARITY_LOW");
        }

        if (supportNeeds.Any(x => x.Equals("Transport", StringComparison.OrdinalIgnoreCase) || x.Equals("Data", StringComparison.OrdinalIgnoreCase)))
        {
            score += 10;
            reasonCodes.Add("SUPPORT_NEED_ACCESS_BARRIER");
        }

        score = Math.Min(score, 100);

        return new RiskEvaluation(score, GetRiskCategory(score), reasonCodes);
    }

    private static string GetRiskCategory(int score)
    {
        if (score >= 90) return CategoryCritical;
        if (score >= 70) return CategoryHigh;
        if (score >= 40) return CategoryMedium;
        return CategoryLow;
    }

    private static IEnumerable<string> ExplodeSupportNeeds(IEnumerable<string> supportNeeds) => supportNeeds
        .SelectMany(value => value.Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries))
        .Select(value => value.Trim())
        .Where(value => value.Length > 0 && !value.Equals("None", StringComparison.OrdinalIgnoreCase));

    private static string TopSupportNeed(IEnumerable<LearnerRecord> learners)
    {
        return ExplodeSupportNeeds(learners.Select(x => x.SupportNeed))
            .GroupBy(x => x)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault() ?? "None";
    }

    private static double CalculateDataQualityScore(IEnumerable<LearnerRecord> learners)
    {
        var learnerList = learners.ToList();
        if (learnerList.Count == 0)
        {
            return 0;
        }

        var totalChecks = learnerList.Count * 11.0;
        var passedChecks = learnerList.Sum(learner =>
        {
            var score = 0;
            if (!string.IsNullOrWhiteSpace(learner.LearnerId)) score++;
            if (!string.IsNullOrWhiteSpace(learner.AgeBand)) score++;
            if (!string.IsNullOrWhiteSpace(learner.Province)) score++;
            if (!string.IsNullOrWhiteSpace(learner.DeviceAccess)) score++;
            if (!string.IsNullOrWhiteSpace(learner.InternetAccess)) score++;
            if (!string.IsNullOrWhiteSpace(learner.EmploymentStatus)) score++;
            if (!string.IsNullOrWhiteSpace(learner.SupportNeed)) score++;
            if (learner.DigitalConfidence is >= 1 and <= 5) score++;
            if (learner.ProgrammingConfidence is >= 1 and <= 5) score++;
            if (learner.AiFamiliarity is >= 1 and <= 5) score++;
            if (!string.IsNullOrWhiteSpace(learner.AttendanceRisk)) score++;
            return score;
        });

        return Math.Round(passedChecks * 100.0 / totalChecks, 1);
    }

    private static double AverageOrZero(IEnumerable<int> values)
    {
        var materialized = values.ToList();
        return materialized.Count == 0 ? 0 : Math.Round(materialized.Average(), 1);
    }

    /* GroupCounts — groups string values and returns a count dictionary ordered by frequency */
    private static Dictionary<string, int> GroupCounts(IEnumerable<string> values) => values
        .GroupBy(v => v)
        .OrderByDescending(g => g.Count())
        .ToDictionary(g => g.Key, g => g.Count());

    /* TopCategory — returns the most frequent value in a string sequence */
    private static string TopCategory(IEnumerable<string> values) => values
        .GroupBy(v => v)
        .OrderByDescending(g => g.Count())
        .Select(g => g.Key)
        .FirstOrDefault() ?? "N/A";

    /* Percentage — returns a rounded integer percentage of part/total */
    private static double Percentage(int part, int total) => total == 0 ? 0 : Math.Round(part * 100.0 / total, 1);

    private sealed record RiskEvaluation(int Score, string Category, List<string> ReasonCodes);
}
