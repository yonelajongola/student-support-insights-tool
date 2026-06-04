# User Guide

## Purpose
Use the Student Support Insights Tool to identify learner support needs and generate practical support actions.

## Start The Application
1. Start backend API:
- Open terminal in backend
- Run: dotnet run
2. Start frontend:
- Open terminal in frontend
- Run: npm run dev
3. Open browser: http://localhost:3000

## Core User Flow
1. Upload CSV dataset or manually add learner records.
2. Review validation messages.
3. View dashboard charts for risk, support need, and device access.
4. Review high-risk learner flags and reasons.
5. Read recommendation cards and plan interventions.
6. Export dataset/report CSV for sharing.

## Data Rules
- Confidence fields must be 1 to 5.
- AttendanceRisk must be Low, Medium, or High.
- Duplicate learner IDs are rejected.

## Responsible Use
- Do not upload personal identifiers.
- Use recommendations as support guidance only.
- Keep human review in all intervention decisions.
