# Bug Log

| Bug ID | Description | Root Cause | Fix Applied | Status |
|---|---|---|---|---|
| B1 | CSV imports failed when learner notes contained commas | Parser used a naive `Split(',')` approach that broke quoted CSV rows | Implemented a quote-aware CSV parser and exact column-count validation in `LearnerDataService` | Fixed |
| B2 | Risk output was difficult to justify during review | Risk flags were previously based on weaker logic and less explicit metadata | Reworked scoring into a transparent weighted model with score bands, priority, factors, and reason codes | Fixed |
| B3 | Frontend could not explain why upload rows were rejected | Upload result only returned flat error strings without field or line context | Added structured `validationErrors` in the API and surfaced them in the frontend validation panel | Fixed |
| B4 | Older dashboard contract did not support assessor-facing KPIs and charts | Frontend summary model only supported a smaller set of metrics and three charts | Extended dashboard DTO and redesigned frontend around KPI cards, richer charting, and responsive risk review | Fixed |

## Verification
- Frontend `npm run typecheck` passed after UI contract changes.
- Frontend `npm run build` passed after dashboard redesign.
- Backend release build passed after scoring, validation, and ethics updates.
