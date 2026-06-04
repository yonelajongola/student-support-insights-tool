using Microsoft.AspNetCore.Mvc;
using StudentSupportInsights.DTOs;

namespace StudentSupportInsights.Controllers;

/* EthicsController
 * Provides a read-only ethics and data governance notice endpoint.
 * Base route: api/ethics
 */
[ApiController]
[Route("api/[controller]")]
public class EthicsController : ControllerBase
{
    /* GET api/ethics/notice
     * Returns the ethics notice including privacy policy, consent statement,
     * responsible use principles, fairness checks, human review checklist,
     * data protection controls, and decisions that must NOT be automated.
     */
    [HttpGet("notice")]
    public IActionResult Notice()
    {
        return Ok(new EthicsNoticeDto
        {
            PrivacyNotice = "Use synthetic or anonymized learner-support data where possible. Do not upload names, ID numbers, phone numbers, home addresses, or unnecessary sensitive notes. Treat all learner support data as confidential even when it does not include direct identifiers.",
            Consent = "Learners should be told in plain language what data is collected, why it is collected, who can access it, how long it will be kept, and that risk scores are reviewed by staff rather than used as automatic decisions.",
            ResponsibleUse = "Risk scores and recommendations are decision-support signals only. A flag means 'review this learner support context', not 'this learner is a problem'. Staff remain responsible for fair, contextual, and accountable decisions.",
            CorePrinciples = new()
            {
                "Data minimization: collect only fields needed for learner support planning and outcome review.",
                "Purpose limitation: do not reuse support data for admissions, discipline, exclusion, funding, or unrelated decisions.",
                "Transparency: keep scoring rules, recommendation logic, and data-quality limitations explainable to staff.",
                "Fairness: interpret access barriers as resource needs, not learner weakness or lack of commitment.",
                "Accountability: record who reviewed a recommendation, what evidence they considered, and what action was taken."
            },
            FairnessChecks = new()
            {
                "Check whether one province, age band, or access group is being over-flagged and investigate the reason before acting.",
                "Do not treat low confidence scores as fixed ability; they may reflect lack of exposure or support.",
                "Review notes for biased language before using them in a support decision.",
                "Confirm that support recommendations create opportunity and do not reduce learner access to the programme."
            },
            HumanReviewChecklist = new()
            {
                "Verify missing values, duplicate IDs, and validation warnings before using dashboard outputs.",
                "Review risk reason codes, attendance context, learner notes, and facilitator observations.",
                "Select a proportionate support action such as mentoring, data support, transport guidance, or academic support.",
                "Record the intervention rationale, human override decisions, and follow-up outcome for audit purposes."
            },
            NonAutomatedDecisions = new()
            {
                "Final intervention decisions for individual learners.",
                "Escalation, disciplinary, progression, funding, or exclusion decisions.",
                "Interpretation of sensitive note content without human context.",
                "Any action that could materially affect learner opportunity without staff review."
            },
            DataProtectionControls = new()
            {
                "Use role-based access control and secure authentication for any real deployment.",
                "Store exported CSV files securely and share them only with authorised programme staff.",
                "Avoid unnecessary personal information in free-text notes.",
                "Add audit logging for exports, intervention records, and changes to scoring rules in a live version."
            },
            AccountabilityActions = new()
            {
                "Keep the risk scoring rules documented and review them with programme staff before operational use.",
                "Review learner outcomes after interventions to check whether support actions helped.",
                "Update the model if evidence shows unfair patterns or weak recommendations.",
                "Allow staff to override a risk flag when context shows the dashboard output is incomplete."
            },
            RetentionGuidance = "Prototype data should only be kept for the assessment period. In a real programme, retention should be agreed by programme leadership, explained to learners, and deleted or anonymised when no longer needed for support planning.",
            LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-dd")
        });
    }
}
