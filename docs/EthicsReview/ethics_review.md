# AI, Data Ethics, Privacy, And Responsible Use Review

## 1. Ethical Position
The Student Support Insights Tool is designed as a decision-support prototype, not an automated decision-making system. Its purpose is to help programme staff notice support needs earlier, plan interventions more fairly, and reduce manual spreadsheet review. The tool must never be used to punish, exclude, rank, or label learners permanently.

The most important ethical rule for this project is: a risk flag means "review this learner's support context", not "this learner is a problem".

## 2. Data Collected And Purpose
The prototype uses structured learner support data fields:
- Learner ID only, not learner name or identity number
- Age band and province/area for group-level support planning
- Device access and internet access to identify access barriers
- Digital confidence, programming confidence, and AI familiarity to understand readiness
- Employment status, support need, attendance risk, and short notes for support context

The data is used only for learner support planning, dashboard analytics, and evidence reporting for the prototype. It should not be reused for unrelated disciplinary, admission, funding, marketing, or exclusion decisions.

## 3. Data Sensitivity Assessment
The dataset excludes direct identifiers such as names, ID numbers, phone numbers, addresses, and personal contact details. However, the information is still sensitive because it can reveal educational readiness, access limitations, employment situation, and possible socioeconomic barriers.

Because of this, the prototype treats the data as confidential support information even when synthetic or anonymised data is used.

## 4. Consent And Learner Transparency
Before real learner data is collected in a live setting, learners should receive a plain-language notice explaining:
- What data will be collected
- Why the data is needed
- How the data will support learner success
- Who can access the data
- How long the data will be kept
- That risk scores are reviewed by staff and are not automatic decisions
- Who learners can contact if their information is wrong or they have concerns

## 5. Privacy Controls Used In This Prototype
- Data minimisation: only fields needed for support planning are included.
- Synthetic data: the default dataset is synthetic to avoid exposing real learners.
- No direct identifiers: names, ID numbers, phone numbers, and addresses are not required.
- Purpose limitation: the tool is limited to learner support planning.
- Export caution: exported CSV files should be stored securely and shared only with authorised staff.
- Notes caution: staff should avoid recording unnecessary personal or sensitive details in free-text notes.

## 6. Bias And Fairness Risks
Potential risks include:
- Attendance risk may be based on subjective staff judgement.
- Low confidence scores may reflect lack of exposure, not lack of ability.
- Province, internet access, and device access may act as socioeconomic proxies.
- Learners with access barriers could be unfairly seen as weaker instead of needing resources.
- Notes may contain biased wording if written without care.

Mitigation actions:
- The scoring model is transparent and rule-based.
- Every risk flag includes reason codes.
- Staff must review context before acting.
- Recommendations focus on support actions, not punishment.
- High-risk lists should be used for support prioritisation only.
- Group-level patterns should be checked so one group is not unfairly over-flagged without explanation.

## 7. Harm Prevention
The prototype avoids harmful automation by:
- Not making final intervention decisions automatically.
- Not recommending exclusion, discipline, or reduced opportunity.
- Showing reasons behind risk flags.
- Keeping risk categories as temporary support signals.
- Requiring human review before any action is taken.

## 8. Decisions That Must Not Be Automated
The following must remain human-led:
- Final decisions on individual learner interventions
- Disciplinary, exclusion, progression, or funding decisions
- Interpretation of sensitive notes
- Any action that could negatively affect learner opportunity
- Any decision where the learner disputes the data or context

## 9. Human Review Workflow
When a learner is flagged, staff should follow this process:
1. Check whether the uploaded data is complete and valid.
2. Review the risk reason codes and support need.
3. Check attendance context, learner notes, and facilitator observations.
4. Choose a proportionate support action.
5. Record the action and reason for accountability.
6. Follow up later to see whether the support helped.

## 10. Security And Access Recommendations
For a real deployment, the tool should add:
- Role-based access control for staff users.
- Secure authentication.
- Audit logging for exports and interventions.
- Secure hosting and encrypted storage.
- Backups and retention rules.
- Clear separation between learner support data and public reporting.

## 11. Data Retention Recommendation
For the prototype, data should only be kept for the assessment period. For a real programme, retention should be agreed by programme leadership and communicated to learners. Data should be deleted or anonymised when it is no longer needed for support planning or reporting.

## 12. Data Quality And Limitations
- Synthetic data does not represent all real learner situations.
- Rule-based scoring is explainable but still simplified.
- Free-text notes may miss context or introduce bias.
- Confidence scores are self-reported and may change over time.
- The model should be reviewed with real programme staff before operational use.

## 13. Responsible Use Statement
This tool is a support-planning assistant. It helps staff identify where support may be needed, but staff remain responsible for fair, contextual, and accountable decisions. The safest use of this tool is to combine the dashboard output with human judgement, learner communication, and proper support follow-up.

## 14. Prototype Privacy Notice Text
"This Student Support Insights Tool uses learner support survey data to help programme staff identify possible support needs and improve learner success. The prototype should use synthetic or anonymised data where possible. Do not upload names, ID numbers, phone numbers, home addresses, or unnecessary sensitive information. Risk scores and recommendations are only decision-support indicators and must be reviewed by a staff member before action is taken. The tool must not be used to unfairly exclude, punish, or permanently label learners."
