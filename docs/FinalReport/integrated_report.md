# Integrated Final Report

## Cover Page
- Project: Student Support Insights Tool
- Student: Yonela Jongola
- Date: 31/05/2026
- Course: SFIA Level 3 Integrated Assessment

## Executive Summary
This project delivers my working Student Support Insights Tool prototype for programme staff. The tool captures learner survey data, checks the quality of the data, visualizes support patterns, flags learners who may need support, and generates practical recommendations. I used a synthetic dataset of 30 learners to avoid real personal data risk while still showing how the prototype would work.

## Problem Statement And Context
Digital skills programmes collect learner information but often do not use it systematically to identify support needs. This leads to missed early interventions and uneven decision-making. The tool addresses the question: how can programme teams use learner data responsibly to improve learner success.

## Stakeholder And User Needs Analysis
Primary stakeholders are learners, programme staff, leadership, IT support, and mentors. Programme staff need clear, actionable insight. Learners need timely support. Leadership needs trend visibility for resource planning. A stakeholder map and power-interest model are provided in supporting documents.

## Current Process And Improved Process
The as-is process depends on manual spreadsheets and ad-hoc interpretation. The to-be process introduces automated validation, dashboard analysis, risk flags, and recommendation support with human review before action.

## Business/Value Model
The value model shows how structured learner data and analytics capabilities translate into better attendance support, faster intervention planning, and improved resource allocation. A peer/stakeholder review record is included in `docs/Documentation/completed_peer_stakeholder_review.md` to evidence review of the value model and workflow.

## Data Description And Data Preparation
A synthetic dataset of 30 learner records includes learner profile, access constraints, confidence scores, support needs, and attendance risk. Data validation logic checks missing fields, invalid ranges, controlled values, duplicate learner IDs, quoted CSV input integrity, and row-level upload errors with field and line-number detail.

## Analytics Findings And Visualizations
Five visualizations are implemented: risk distribution, support need distribution, device access distribution, internet access by province, and confidence comparison across digital, programming, and AI familiarity scores. Findings show significant connectivity and device constraints, a concentration of high-risk learners, recurring support categories, and confidence gaps that justify targeted interventions.

## Prototype Description
The prototype includes:
- Backend API for upload, validation, analytics, risk flags, recommendations, ethics notice, and export
- Frontend dashboard with hero messaging, KPI cards, charts, risk table, recommendation cards, ethics panel, and manual entry form

## AI, Data Ethics, And Privacy Review
The tool includes a clear privacy notice, consent statement, responsible-use warning, human review checklist, and explicit non-automation rules for sensitive learner decisions. Bias, data quality limitations, and accountability expectations are documented.

## Methods, Tools, And Development Approach
A staged 15-day delivery plan guided implementation. C#/.NET was used for API logic and React/TypeScript for user interface and visualization. Development followed iterative build-test-refine cycles.

## Testing And Review Evidence
Functional tests were executed and logged across endpoint responses, validation behavior, structured upload errors, recommendation generation, and build quality. A bug log records identified issues and fixes, and the evidence pack also includes a corrected SFIA checklist, a peer/stakeholder review record, a completed assessor-style walkthrough, screenshot captures, and build-output evidence.

## Reflection On Challenges, Decisions, And Improvements
The major challenge was moving from a minimum viable prototype to a submission that an assessor could follow easily. I had to improve the analytics, validation, screenshots, ethics wording and evidence traceability. Further improvements could include persistent storage, authentication, intervention tracking and testing the rules with properly anonymised programme data.

## Evidence Inventory Mapped To SFIA Skills
See docs/FinalReport/evidence_inventory_sfia.md.

## Appendices
- README and user guide
- Dataset and data dictionary
- Process models and value model
- Ethics review and governance evidence
- Testing log, bug log, and corrected SFIA checklist
- Peer/stakeholder review record
- Assessor walkthrough and screenshot appendix

## Final Submission Version
For submission packaging, use docs/FinalReport/final_submission.md as the finalized integrated document and treat this file as the narrative summary that points to the full evidence pack.
