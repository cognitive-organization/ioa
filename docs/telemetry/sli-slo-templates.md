# IOA SLI/SLO Templates

Version: v0.2
Date: 2026-02-25
Owner: Agent 06 (Telemetry & Observability Lead)

## 1. Overview

**SLI (Service Level Indicator):** A quantitative measure of service quality.
**SLO (Service Level Objective):** A target value or range for an SLI.

In IOA, SLIs measure resource health and SLOs define acceptable thresholds. When SLOs are breached, controllers should take action.

## 2. Domain SLIs/SLOs

### Standard Domain SLIs

| SLI | Measurement | Source |
|-----|-------------|--------|
| **KPI Achievement Rate** | % of KPIs meeting target | Domain.status vs Domain.spec.kpis |
| **Budget Utilization** | % of budget consumed vs allocated | Budget.status.utilizationRate |
| **Decision Velocity** | Decisions per week | Domain.status.decisionVelocity.decisionsPerWeek |
| **Decision Lead Time** | Avg days from proposed to accepted | Domain.status.decisionVelocity.avgLeadTimeDays |
| **Cognitive Load** | Score 0-1 | Domain.status.cognitiveLoadScore |
| **Incident Rate** | Active incidents | Domain.status.activeIncidents |
| **Agent Availability** | Active agents / total agents | Domain.status.activeAgents / Domain.spec.agents.length |

### Domain SLO Template

```yaml
# SLO definition for a Domain (not an IOA resource — a governance guideline)
domain: product
slos:
  - sli: kpi-achievement-rate
    target:
      operator: gte
      value: 80
      unit: percent
    window: "30d"
    consequence: "Review domain strategy if below target for 2 consecutive periods"

  - sli: budget-utilization
    target:
      operator: lte
      value: 90
      unit: percent
    window: "monthly"
    consequence: "Trigger budget review meeting"

  - sli: decision-velocity
    target:
      operator: gte
      value: 2
      unit: decisions/week
    window: "7d"
    consequence: "Flag decision bottleneck to domain lead"

  - sli: cognitive-load
    target:
      operator: lte
      value: 0.75
      unit: score
    window: "7d"
    consequence: "Consider adding agents or redistributing work"

  - sli: incident-rate
    target:
      operator: lte
      value: 2
      unit: incidents
    window: "7d"
    consequence: "Root cause analysis required"
```

## 3. Agent SLIs/SLOs

### Standard Agent SLIs

| SLI | Measurement | Source |
|-----|-------------|--------|
| **Error Rate** | % of executions resulting in error | Agent.status.errorRate |
| **Override Rate** | % of decisions overridden by humans | Agent.status.overrideRate |
| **Latency** | Avg response time | Agent.status.avgLatency |
| **Health Score** | Overall health 0-1 | Agent.status.healthScore |
| **Cost Efficiency** | Cost per execution | Agent.status.costConsumed / execution count |
| **Token Utilization** | % of token budget consumed | Agent.status.costConsumed.tokens / Agent.spec.tokenBudget |

### Agent SLO Template

```yaml
agent: product-analyst
slos:
  - sli: error-rate
    target:
      operator: lte
      value: 5
      unit: percent
    window: "24h"
    consequence: "Auto-pause agent, alert engineering"

  - sli: override-rate
    target:
      operator: lte
      value: 20
      unit: percent
    window: "7d"
    consequence: "Review agent prompt/capabilities if humans override too often"

  - sli: latency-p95
    target:
      operator: lte
      value: 30
      unit: seconds
    window: "1h"
    consequence: "Check model provider, consider caching"

  - sli: health-score
    target:
      operator: gte
      value: 0.7
      unit: score
    window: "continuous"
    consequence: "Escalate to engineering if drops below threshold"

  - sli: cost-per-execution
    target:
      operator: lte
      value: 0.10
      unit: usd
    window: "24h"
    consequence: "Review agent prompt efficiency, consider smaller model"
```

## 4. Workflow SLIs/SLOs

### Standard Workflow SLIs

| SLI | Measurement | Source |
|-----|-------------|--------|
| **Completion Rate** | % of workflows completing successfully | completed / (completed + failed) |
| **End-to-End Latency** | Total workflow duration | Workflow.status.latency |
| **Compensation Rate** | % of workflows requiring compensation | compensating / total |
| **Step Failure Rate** | % of steps failing across all executions | failedSteps / totalSteps |
| **Cost per Execution** | Total cost of workflow run | Workflow.status.costAccumulated |

### Workflow SLO Template

```yaml
workflow: churn-response
slos:
  - sli: completion-rate
    target:
      operator: gte
      value: 95
      unit: percent
    window: "7d"
    consequence: "Review failing steps, update retry policies"

  - sli: end-to-end-latency-p95
    target:
      operator: lte
      value: 15
      unit: minutes
    window: "24h"
    consequence: "Optimize slowest step or add parallelism"

  - sli: compensation-rate
    target:
      operator: lte
      value: 5
      unit: percent
    window: "7d"
    consequence: "Root cause analysis on compensation triggers"
```

## 5. Error Budget

The difference between 100% and the SLO target is the **error budget** — the acceptable amount of failure.

```
Error Budget = 1 - SLO target

Example:
  SLO: 95% completion rate
  Error Budget: 5% (5 out of 100 workflows can fail)

  If 7 out of 100 fail:
    Error budget consumed: 7/5 = 140% → SLO BREACHED
```

### Error Budget Policy

| Error Budget Status | Action |
|--------------------|--------|
| < 50% consumed | Normal operations |
| 50-80% consumed | Increase monitoring, review recent failures |
| 80-100% consumed | Freeze non-critical changes, prioritize reliability |
| > 100% (breached) | Mandatory review, block new features until resolved |

## 6. Implementation Notes

SLIs and SLOs are NOT separate IOA resources — they are governance guidelines that map to existing resource fields (Domain.status, Agent.status, Workflow.status) and telemetry events.

To implement SLOs:
1. Define SLOs as part of Governance policy or documentation
2. Use Controller resources to watch target resources
3. Set Controller.spec.driftThreshold based on SLO targets
4. Use Telemetry alertRules to fire when SLI approaches SLO boundary
5. Track SLO compliance in Domain.status.conditions

```yaml
# Example: SLO compliance tracked as a condition
status:
  conditions:
    - type: SLOCompliant
      status: "True"
      reason: AllSLOsMet
      message: "4/4 SLOs within target"
      lastTransitionTime: "2026-02-25T10:00:00Z"
```
