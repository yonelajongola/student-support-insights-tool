# Test Log

## Environment
- Evidence refresh date: `2026-06-01`
- Backend: ASP.NET Core Web API on `http://localhost:5000`
- Frontend: Vite React app on `http://localhost:3000`
- Dataset: `data/Dataset/synthetic_learners.csv`

| Test ID | Test Case | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| T1 | Health endpoint availability | Run backend and request `GET /api/health` | API returns healthy status with timestamp | Endpoint returned healthy JSON payload | Pass |
| T2 | Dashboard summary contract | Request `GET /api/insights/dashboard` after seed load | Response includes KPI totals, risk categories, support distribution, device distribution, and provincial internet breakdown | Response returned expanded summary DTO including KPI, chart, and data-quality fields | Pass |
| T3 | Transparent risk flags | Request `GET /api/insights/risk-flags` | Only High and Critical learners are returned, including `priority`, `riskScore`, and reason codes | Returned filtered flagged learners with score, priority, factors, and reason codes | Pass |
| T4 | CSV upload happy path | Upload valid learner CSV through UI or `POST /api/learners/upload` | Records import successfully, dashboard refreshes, success feedback displayed | Valid rows imported and success toast displayed in UI | Pass |
| T5 | CSV upload validation path | Upload CSV with invalid controlled values and malformed rows | API rejects invalid rows and returns line-level validation errors; UI displays corrective guidance | Structured `validationErrors` returned and shown in validation panel | Pass |
| T6 | Manual learner validation | Submit form with missing or invalid values | Inline field errors appear and no record is submitted until fixed | Client-side validation blocked submission and highlighted fields | Pass |
| T7 | Ethics notice governance text | Request `GET /api/ethics/notice` | Response clearly states consent, human review, and non-automation rules | Governance response included strengthened review checklist and prohibited automation decisions | Pass |
| T8 | Frontend type safety | Run `npm run typecheck` in `frontend` | TypeScript exits with no errors | Typecheck passed | Pass |
| T9 | Frontend production build | Run `npm run build` in `frontend` | Production build completes successfully | Vite production build completed successfully | Pass |
| T10 | Backend release build | Run `dotnet build StudentSupportInsights.csproj --configuration Release --output ..\evidence\Testing\backend-build-temp` in `backend` while the local API is running | Backend compiles successfully | Release build completed successfully to an alternate output directory without stopping the live API process | Pass |

## Notes
- Validation, build checks, and screenshot evidence were rerun after the dashboard redesign and theme updates.
- The backend release build was written to `evidence/Testing/backend-build-temp` during this evidence refresh because the running local API locks the default `bin/Release` output path.
- Screenshot placeholders for assessor evidence are tracked in `evidence/Testing/screenshot_placeholders.md`.
