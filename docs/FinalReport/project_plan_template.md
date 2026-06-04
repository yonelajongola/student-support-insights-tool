# Project Plan

## Project Title
Student Support Insights Tool

## Project Purpose
Build and evaluate a small AI-enabled prototype that helps programme staff collect, analyse, and interpret learner support needs responsibly, then convert findings into practical actions that improve learner success.

## Problem Statement
Digital skills programmes often collect learner data but do not apply it consistently to identify support needs, risks, and opportunities for improvement. This project addresses that gap with a simple, usable, and ethical insights tool.

## Project Objectives
- Capture or upload learner survey data in a structured format.
- Validate data for missing values, invalid values, and duplicates.
- Analyse data and show at least three visualisations.
- Flag learners or learner groups who need support.
- Produce at least three practical recommendations.
- Include ethical, privacy, and consent guidance.
- Export or summarise findings for decision-makers.

## Scope
### In Scope
- Synthetic dataset of 30 to 50 learners.
- Web-based prototype with backend API and frontend dashboard.
- Rule-based support-risk flag logic.
- Recommendation output for programme staff.
- Documentation, testing evidence, and bug log.

### Out Of Scope
- Direct use of real personal learner data.
- Fully automated intervention decisions without human review.
- Enterprise-scale deployment and advanced model training.

## Success Criteria
- Working prototype runs locally and demonstrates all minimum required features.
- At least three visualisations are available and interpretable.
- At least five evidence-based insights are documented.
- At least three practical recommendations are generated.
- Ethics and privacy review is completed and included in final report.
- Testing log includes at least five tests and bug log includes at least two fixed issues.

## Deliverables
| Deliverable | Description | Location |
|---|---|---|
| Integrated final report | Full assignment report in one coherent document | docs/FinalReport |
| Synthetic dataset | 30 to 50 learner records with required fields | data/Dataset |
| Data dictionary | Definitions and value ranges for each field | data/Dataset/data_dictionary.md |
| Stakeholder and value models | Stakeholder map and value model diagram | docs/FinalReport, docs/BusinessModels |
| Process models | As-is and to-be process diagrams | docs/ProcessModels |
| Prototype source code | Backend and frontend implementation | backend, frontend |
| Dashboard evidence | Visualisations and analytics findings | docs/Dashboards, frontend |
| Ethics review | AI, privacy, consent, and responsible use section | docs/EthicsReview |
| Testing and bug evidence | Test cases, outcomes, and fixed issues | evidence/Testing, evidence/BugLogs |
| User guide and README | Setup, usage, and configuration notes | README.md, docs/Documentation |

## 14-Day Work Plan
| Day | Activity | Planned Output |
|---|---|---|
| 1 | Understand brief, confirm stack, define plan | Project plan and task board |
| 2 | Define problem context, users, and stakeholders | Problem statement and stakeholder map |
| 3 | Analyse current support workflow | As-is process model |
| 4 | Design improved process and value model | To-be process and value model |
| 5 | Create and validate synthetic dataset | Dataset and data dictionary |
| 6 | Perform exploratory analysis | Initial charts and insight notes |
| 7 | Scaffold backend and frontend structure | Running baseline prototype shell |
| 8 | Implement data input and validation | Working upload/form validation flow |
| 9 | Implement dashboard and insight summaries | Three or more visualisations |
| 10 | Implement risk flagging and recommendations | Support logic and output module |
| 11 | Complete ethics and privacy components | Ethics review and privacy notice |
| 12 | Execute tests, debug, and refactor | Test log and updated bug log |
| 13 | Conduct peer or stakeholder review | Feedback log and refinements |
| 14 | Finalise report and evidence package | Final integrated submission |

## Milestones
| Milestone | Target Day | Evidence |
|---|---|---|
| M1 Planning complete | Day 2 | Project plan and stakeholder outputs |
| M2 Analysis assets complete | Day 6 | Clean dataset, dictionary, initial findings |
| M3 Core prototype complete | Day 10 | Input, validation, dashboard, risk, recommendations |
| M4 Quality and governance complete | Day 12 | Tests, bug fixes, ethics review |
| M5 Submission ready | Day 14 | Integrated report and evidence folder |

## Task Board (Initial)
| Task | Owner | Status | Priority | Due Day |
|---|---|---|---|---|
| Finalise project scope and constraints | Student | Done | High | 1 |
| Complete stakeholder and process models | Student | In Progress | High | 4 |
| Prepare synthetic dataset and dictionary | Student | Done | High | 5 |
| Build data input and validation modules | Student | To Do | High | 8 |
| Build dashboard visualisations | Student | To Do | High | 9 |
| Implement risk and recommendation logic | Student | To Do | High | 10 |
| Draft ethics and privacy review | Student | To Do | High | 11 |
| Execute test cases and log defects | Student | To Do | Medium | 12 |
| Consolidate final report and appendices | Student | To Do | High | 14 |

## Risks And Mitigation
| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Data quality issues reduce insight reliability | High | Medium | Apply strict validation, maintain data quality log |
| Time pressure on prototype completion | High | Medium | Deliver minimum viable features first, defer extras |
| Misinterpretation of risk flags | High | Medium | Require human review before intervention actions |
| Privacy wording incomplete or unclear | Medium | Medium | Add plain-language notice and consent statement |
| Technical integration issues backend/frontend | Medium | Medium | Build and test endpoints incrementally |

## Assumptions
- Synthetic data accurately represents realistic learner profiles.
- Local development environment remains available throughout project.
- Stakeholder feedback is available by Day 13.

## Roles And Responsibilities
| Role | Responsibility |
|---|---|
| Student developer-analyst | Build prototype, analyse data, compile report, maintain evidence |
| Peer reviewer or mentor | Review diagrams, recommendations, and usability |
| Programme staff representative | Validate practical relevance of recommendations |

## Tools And Methods
| Tool/Method | Purpose |
|---|---|
| C#/.NET backend | API endpoints, validation, recommendation logic |
| Frontend web app | Data upload/input and dashboard presentation |
| CSV dataset and markdown docs | Data source and structured reporting evidence |
| Mermaid diagrams | Process and model visualisation |
| Git/repository evidence | Version and workflow tracking |
| Structured testing and bug logs | Quality assurance and improvement tracking |

## Quality Plan
- Functional testing: minimum five test cases across input, validation, analytics, and recommendation outputs.
- Bug tracking: record issue, root cause, fix, and retest result.
- Evidence completeness checks: verify each pass-standard item is mapped to a file.

## Ethics And Governance Plan
- Use synthetic or anonymised data only.
- Include consent and purpose limitation notice in prototype.
- Avoid fully automated support decisions without human oversight.
- Document potential bias and fairness limitations in report.

## Dependency Map
- Dataset readiness is required before reliable dashboard outputs.
- Validation logic must exist before risk and recommendation logic.
- Testing and peer feedback depend on minimum working prototype.

## Approval And Review Checkpoints
| Checkpoint | Day | Outcome |
|---|---|---|
| Planning review | 2 | Confirm scope and evidence path |
| Mid-project technical review | 8 | Confirm working data flow and validation |
| Insight and recommendation review | 10 | Confirm quality of analysis outputs |
| Final quality review | 13 | Confirm submission readiness |

## References
- Future-Innovation Lab SFIA Level 3 integrated assessment brief.
- Internal project repository documentation and evidence files.
