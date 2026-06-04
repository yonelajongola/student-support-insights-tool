# Stakeholder Map

## Stakeholder Groups
- Programme staff
- Learners
- Programme manager and leadership
- IT support team
- Industry mentors and partners

## Stakeholder Needs And Interests
| Stakeholder | Primary Needs | Influence | Interest | What Success Looks Like |
|---|---|---|---|---|
| Learners | Fair support, practical guidance, timely intervention | High | High | Better attendance, confidence, and completion |
| Programme staff | Clear learner insights, prioritised support actions | High | High | Faster decisions and targeted support plans |
| Programme manager and leadership | Performance visibility, resource planning | High | Medium | Improved outcomes with evidence-based reporting |
| IT support team | Reliable and secure system operation | Medium | Medium | Stable app, low downtime, protected data |
| Industry mentors and partners | Meaningful engagement opportunities | Low | Medium | Better mentor matching and employability pathways |

## Stakeholder Map Diagram
```mermaid
flowchart LR
	SST[Student Support Insights Tool]
	L[Learners]
	PS[Programme Staff]
	PM[Programme Manager and Leadership]
	IT[IT Support Team]
	MP[Industry Mentors and Partners]

	L -->|Survey responses and feedback| SST
	SST -->|Support flags and recommendations| PS
	SST -->|Summary dashboard and trends| PM
	IT -->|Platform maintenance and access control| SST
	SST -->|Mentor-ready learner profiles| MP
	PS -->|Interventions and follow-up| L
```

## Power-Interest Matrix
```mermaid
quadrantChart
	title Stakeholder Power-Interest Positioning
	x-axis Low Interest --> High Interest
	y-axis Low Power --> High Power
	quadrant-1 Manage Closely
	quadrant-2 Keep Satisfied
	quadrant-3 Monitor
	quadrant-4 Keep Informed
	Learners: [0.85, 0.75]
	Programme Staff: [0.90, 0.90]
	Programme Manager and Leadership: [0.60, 0.85]
	IT Support Team: [0.55, 0.60]
	Industry Mentors and Partners: [0.65, 0.35]
```

## Engagement Plan
- Learners: weekly communication on support options, clear consent wording, and opt-out channel.
- Programme staff: bi-weekly insight review sessions and action tracking.
- Programme manager and leadership: monthly performance summary with risk and resource signals.
- IT support team: access reviews, backup checks, and incident process each sprint.
- Industry mentors and partners: monthly matching updates and feedback loop on learner readiness.
