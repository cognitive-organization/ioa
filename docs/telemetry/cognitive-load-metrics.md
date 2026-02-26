# IOA Cognitive Load Metrics

Version: v0.2
Date: 2026-02-25
Owner: Agent 06 (Telemetry & Observability Lead)

## 1. Overview

Cognitive Load (Principle #6) measures the mental demand placed on participants (human and AI) within a domain. IOA tracks this as `Domain.status.cognitiveLoadScore` (0-1 scale).

This document defines how to measure, calculate, and act on cognitive load metrics.

## 2. The Cognitive Spectrum

IOA defines four types of work along a cognitive complexity spectrum:

| Type | Complexity | Handler | Example |
|------|-----------|---------|---------|
| **Routine** | Low | AI agent (autonomous) | Data formatting, status reporting |
| **Structured** | Medium-Low | AI agent (supervised) | Template-based analysis, standard workflows |
| **Analytical** | Medium-High | AI agent (advisory) + human review | Trend analysis, option evaluation |
| **Novel** | High | Human (with AI support) | Strategy decisions, crisis response, ethical judgment |

The principle: AI handles routine→structured, humans handle analytical→novel. Cognitive load is healthy when work is distributed according to this spectrum.

## 3. Cognitive Load Indicators

### 3.1 Domain-Level Indicators

| Indicator | Measurement | Weight | Data Source |
|-----------|-------------|--------|-------------|
| **Decision Backlog Ratio** | Pending decisions / avg decisions per week | 0.25 | Decision resources with status=proposed |
| **Agent Override Rate** | Human overrides / total agent decisions | 0.20 | Agent.status.overrideRate (aggregated) |
| **Incident Density** | Active incidents per agent | 0.20 | Domain.status.activeIncidents / activeAgents |
| **Context Switching Score** | Cross-domain event volume | 0.15 | Telemetry events consumed from other domains |
| **Novel Work Ratio** | Novel decisions / total decisions | 0.20 | Decisions with complex context (heuristic) |

### 3.2 Agent-Level Indicators

| Indicator | Measurement | Source |
|-----------|-------------|--------|
| **Task Queue Depth** | Pending tasks for this agent | Implementation-specific |
| **Error Recovery Rate** | Time to recover from errors | Telemetry events |
| **Delegation Rate** | Tasks escalated to humans | Agent.spec.governance.escalatesTo frequency |
| **Context Window Usage** | % of model context consumed | Implementation-specific |

## 4. Cognitive Load Score Calculation

```
cognitiveLoadScore = Σ(weight_i × normalized_indicator_i)

Where:
  normalized_indicator = min(1.0, raw_value / threshold_value)
```

### Example Calculation

```
Domain: product
  Decision backlog: 5 pending / 3 avg per week = 1.67 → normalized: min(1, 1.67/3) = 0.56
  Override rate: 15% → normalized: min(1, 0.15/0.30) = 0.50
  Incident density: 1 incident / 4 agents = 0.25 → normalized: min(1, 0.25/1.0) = 0.25
  Context switching: 12 cross-domain events/day → normalized: min(1, 12/20) = 0.60
  Novel work ratio: 40% → normalized: min(1, 0.40/0.50) = 0.80

  cognitiveLoadScore = (0.25 × 0.56) + (0.20 × 0.50) + (0.20 × 0.25) + (0.15 × 0.60) + (0.20 × 0.80)
                     = 0.14 + 0.10 + 0.05 + 0.09 + 0.16
                     = 0.54
```

### Score Interpretation

| Score Range | Level | Meaning | Action |
|-------------|-------|---------|--------|
| 0.0 - 0.3 | Low | Domain is under-utilized or well-optimized | Monitor; consider consolidating agents |
| 0.3 - 0.6 | Healthy | Balanced distribution of work | Normal operations |
| 0.6 - 0.8 | Elevated | Approaching capacity; risk of quality degradation | Add agents, redistribute, or simplify workflows |
| 0.8 - 1.0 | Critical | Overloaded; high risk of errors and burnout | Immediate action: reduce scope, add resources, defer work |

## 5. Integration with IOA Resources

### In Domain.status

```yaml
status:
  cognitiveLoadScore: 0.54
  conditions:
    - type: CognitiveLoadHealthy
      status: "True"
      reason: WithinThreshold
      message: "Cognitive load at 0.54 (healthy range)"
      lastTransitionTime: "2026-02-25T10:00:00Z"
```

### As Telemetry Event

```yaml
apiVersion: ioa.dev/v0.2
kind: Telemetry
metadata:
  name: domain-cognitive-load
spec:
  event: "product.domain_cognitive_load_measured"
  category: metric
  payload:
    type: object
    properties:
      score: { type: number }
      decisionBacklogRatio: { type: number }
      overrideRate: { type: number }
      incidentDensity: { type: number }
      contextSwitching: { type: number }
      novelWorkRatio: { type: number }
  source:
    domain: product
  observability:
    dashboard: true
    alertRule:
      condition:
        metric: score
        operator: gte
        value: 0.75
        window: "24h"
      severity: warning
      channels: [slack-ops]
```

### In SLO

```yaml
slos:
  - sli: cognitive-load
    target:
      operator: lte
      value: 0.75
      unit: score
    window: "7d"
    consequence: "Domain is overloaded — add agents or reduce scope"
```

## 6. Reducing Cognitive Load

| Strategy | When | Effect |
|----------|------|--------|
| **Add agents** | Novel work ratio high, domain understaffed | Distribute workload |
| **Automate decisions** | Decision backlog growing, many are routine | Move from analytical→structured |
| **Simplify workflows** | Workflows have too many steps | Reduce context switching |
| **Split domain** | Domain has too many responsibilities | Reduce scope per domain |
| **Improve agent quality** | Override rate high | Better agent = fewer human interventions |
| **Defer non-critical work** | Score > 0.8 | Protect quality by reducing scope |

## 7. Measurement Frequency

| Context | Frequency | Rationale |
|---------|-----------|-----------|
| Normal operations | Every 24h | Daily pulse |
| After incident | Immediately | Assess impact |
| After domain change | Within 1h | Verify no overload |
| During crisis | Every 1h | Track escalation |
