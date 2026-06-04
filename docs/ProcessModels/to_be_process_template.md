# To-Be Process Diagram

## Improved Process Description
The improved process uses the Student Support Insights Tool to capture data digitally, validate quality automatically, identify support risk consistently, and generate recommendations for staff review. Human oversight remains in all intervention decisions.

## Diagram
```mermaid
flowchart TD
	A[Learner submits digital survey or CSV upload] --> B[Automated validation and cleaning]
	B --> C{Quality issues found?}
	C -- Yes --> D[Return validation feedback for correction]
	D --> A
	C -- No --> E[Store clean dataset]
	E --> F[Generate dashboard visuals and trend summaries]
	E --> G[Run support-risk flag logic]
	G --> H[Generate practical recommendations]
	F --> I[Programme staff review insights]
	H --> I
	I --> J{Human decision and action plan}
	J --> K[Implement support interventions]
	K --> L[Track outcomes and update reports]
	L --> F
```

## Key Steps
1. Learner data is captured via digital form or upload.
2. Validation checks detect missing, invalid, and duplicate records.
3. Clean data drives dashboard analytics.
4. Risk flags identify high-priority learners and groups.
5. Recommendation engine proposes practical support actions.
6. Staff reviews outputs and decides interventions.
7. Outcomes are monitored for continuous improvement.

## Improvements
- Standardized and transparent data quality controls.
- Faster identification of learner support priorities.
- Consistent evidence-based recommendation outputs.
- Better reporting for leadership and stakeholder review.
- Stronger accountability through auditable intervention tracking.
