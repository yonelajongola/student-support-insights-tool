# As-Is Process Diagram

## Current Process Description
The current process relies on manual collection and review of learner survey information. Data is captured inconsistently, analysis is limited, and support responses are usually reactive after attendance or performance has already declined.

## Diagram
```mermaid
flowchart TD
	A[Learner completes paper or basic form survey] --> B[Staff captures responses in spreadsheet]
	B --> C{Data quality check?}
	C -- No formal check --> D[Missing values and duplicates remain]
	C -- Informal check --> D
	D --> E[Staff manually scans rows for concerns]
	E --> F{Risk identified?}
	F -- Yes --> G[Support action decided case by case]
	F -- No --> H[No intervention recorded]
	G --> I[Follow-up done manually]
	H --> I
	I --> J[Limited reporting to management]
```

## Key Steps
1. Learner submits survey or support information.
2. Data is manually entered in a spreadsheet.
3. Quality issues are handled inconsistently.
4. Staff manually interprets trends and risks.
5. Support decisions are made per case without standard rules.
6. Reporting is occasional and mainly descriptive.

## Limitations
- Data quality errors are difficult to detect early.
- High-risk learners are not always flagged in time.
- Decision-making depends on individual staff judgement.
- No consistent audit trail of interventions and outcomes.
- Reporting is slow and not always actionable.
