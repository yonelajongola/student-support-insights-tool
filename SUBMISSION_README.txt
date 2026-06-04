Student Support Insights Tool - Clean Submission Package
Student: Yonela Jongola

This clean package excludes dependency/build artefacts such as node_modules, dist, bin, obj, and local database files.

Open first:
1. Final_Integrated_Report_Yonela_Jongola.pdf or .docx
2. README.md
3. evidence/sfia_evidence_checklist.md

Run commands:
Backend:
  cd backend
  dotnet restore
  dotnet build
  dotnet run

Frontend:
  cd frontend
  npm ci
  npm run typecheck
  npm run build
  npm run dev

Ethics improvement added:
- Expanded AI/data ethics review with data sensitivity, consent, fairness, harm prevention, retention and security controls.
- Added docs/EthicsReview/ethics_governance_checklist.md.
- Updated API ethics notice to include fairness checks, data protection controls, accountability actions and retention guidance.
- Updated final report Section 9 with stronger responsible-use evidence.
