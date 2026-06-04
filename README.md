# Student Support Insights Tool

Student Support Insights Tool is a submission-ready prototype for programme teams who need to capture learner support data, validate CSV submissions, surface risk patterns, and prioritise human-reviewed interventions using synthetic learner records.

## Stack
- Backend: ASP.NET Core Web API on .NET 10
- Frontend: React, TypeScript, Vite, Recharts, Axios
- Data: synthetic learner dataset in `data/Dataset/synthetic_learners.csv`

## Submission-Ready Features
- Data capture and import:
  - CSV upload with row-level validation feedback and line numbers
  - Manual learner entry with inline field validation
  - CSV export of the active in-memory dataset
- Data quality and validation:
  - required-field validation
  - controlled-value validation for age band, device access, internet access, and attendance risk
  - confidence score range validation for digital, programming, and AI familiarity values
  - duplicate learner ID detection
  - quoted CSV parsing so commas inside note fields do not break imports
- Analytics dashboard:
  - redesigned Academic Intelligence Interface with fixed sidebar and corporate academic styling
  - Ethics Declaration workflow before upload, manual entry, or export
  - 12 KPI cards with operational helper text
  - 5 Recharts visualisations covering risk, support demand, device access, provincial internet access, and confidence trends
  - searchable and filterable learner risk review table
  - recommendation cards, data quality panel, and responsible-use reminder
- Transparent risk scoring:
  - weighted scoring across attendance, device, internet, confidence, and support-need factors
  - learner categorisation into Low, Medium, High, and Critical
  - visible reason codes and risk factors to support explainability
- Responsible-use controls:
  - Ethics Declaration button and confirmation modal using the Academic Intelligence Interface layout
  - disabled upload, manual learner entry, and export until declaration is confirmed
  - ethics and privacy notice endpoint
  - explicit human review checklist
  - non-automation rules for sensitive decisions
- Engineering quality:
  - environment-based API configuration
  - frontend error boundary and normalized API error handling
  - CI quality gates for frontend typecheck/build and backend release build

## Project Structure
- `backend`: ASP.NET Core API and analytics services
- `frontend`: React TypeScript single-page dashboard
- `data`: synthetic dataset and data dictionary
- `docs`: business, process, ethics, and final-report artefacts
- `evidence`: testing logs, bug logs, SFIA evidence, screenshots, and quality evidence

## Local Run Commands

### Backend
1. Open a terminal in `backend`
2. Run `dotnet restore`
3. Run `dotnet build`
4. Run `dotnet run`
5. Use API base URL `http://localhost:5000/api`

### Frontend
1. Open a terminal in `frontend`
2. Run `npm ci`
3. Copy `.env.example` to `.env` or `.env.local`
4. Set `VITE_API_BASE_URL=http://localhost:5000/api`
5. Run `npm run typecheck`
6. Run `npm run build`
7. Run `npm run dev`
8. Open `http://localhost:3000`

## Environment Configuration
- Backend CORS origins are configured in `backend/appsettings.json` under `Cors:AllowedOrigins`
- Production CORS override example: `Cors__AllowedOrigins__0=https://your-frontend.example.com`
- Frontend API base URL is configured with `VITE_API_BASE_URL`

## CI Quality Gates
- Workflow: `.github/workflows/ci.yml`
- Frontend: `npm ci`, `npm run typecheck`, `npm run build`
- Backend: `dotnet restore`, `dotnet build --configuration Release`

## Key API Endpoints
- `GET /api/health`
- `GET /api/learners`
- `POST /api/learners`
- `POST /api/learners/upload`
- `GET /api/learners/export`
- `GET /api/insights/dashboard`
- `GET /api/insights/risk-flags`
- `GET /api/insights/recommendations`
- `GET /api/insights/insights`
- `GET /api/ethics/notice`

## Evidence Pack
- Testing log: `evidence/Testing/test_log.md`
- Bug log: `evidence/BugLogs/bug_log.md`
- SFIA evidence checklist: `evidence/sfia_evidence_checklist.md`
- Completed peer/stakeholder review record: `docs/Documentation/completed_peer_stakeholder_review.md`
- Stakeholder review template: `docs/Documentation/peer_stakeholder_review_template.md`
- Screenshot placeholders: `evidence/Testing/screenshot_placeholders.md`

## Notes
- The prototype loads seed data from `data/Dataset/synthetic_learners.csv`
- Recommendations and risk flags are decision-support outputs only and require human review before action


## Ethics Improvement Evidence
The ethics evidence includes `docs/EthicsReview/ethics_review.md` and `docs/EthicsReview/ethics_governance_checklist.md`. The prototype includes a privacy notice, consent guidance, fairness checks, human-review checklist, data protection controls, retention guidance, and non-automated decision boundaries.


## UI Redesign Update
The frontend was regenerated to match the Academic Intelligence Interface style: fixed 280px staff sidebar, professional blue/grey dashboard shell, KPI cards, bento chart grid, learner risk review table, recommendations, data quality panel, and a floating ethical checklist. The prototype requires users to complete an Ethics Declaration before uploading, manually adding, or exporting learner data.
