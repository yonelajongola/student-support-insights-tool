# Value Model Diagram

## Value Proposition Summary
The Student Support Insights Tool helps programme teams convert learner survey data into timely, practical interventions that improve learner retention and success while using resources more effectively.

## Value Model Canvas
```mermaid
flowchart LR
    subgraph Inputs
        I1[Learner survey data]
        I2[Staff operational knowledge]
        I3[Programme support resources]
    end

    subgraph Tool Capabilities
        C1[Validation and cleaning]
        C2[Insights dashboard]
        C3[Risk flagging]
        C4[Recommendation generation]
    end

    subgraph Outputs
        O1[Prioritized learner support list]
        O2[Trend and performance reports]
        O3[Intervention recommendations]
    end

    subgraph Outcomes
        U1[Improved learner attendance]
        U2[Higher completion probability]
        U3[Faster staff decision-making]
        U4[Better resource allocation]
    end

    I1 --> C1
    I2 --> C2
    I3 --> C4
    C1 --> C2
    C2 --> O2
    C3 --> O1
    C4 --> O3
    O1 --> U1
    O3 --> U2
    O2 --> U3
    O2 --> U4
```

## Stakeholder Value Mapping
| Stakeholder | Value Received | Evidence Indicator |
|---|---|---|
| Learners | Earlier and more relevant support | Reduced high-risk attendance category |
| Programme staff | Quicker insight-to-action cycle | Faster intervention turnaround time |
| Programme leadership | Better planning and accountability | Monthly trend report quality and usage |
| IT support | Clear requirements and governance | Fewer incidents and access control issues |

## Assumptions To Validate
- Staff use dashboard outputs at least once per week.
- Interventions are recorded consistently after each action.
- Learners consent to data use for support improvement.
