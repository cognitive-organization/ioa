# IOA Observability Guide — Telemetry vs Observability

Version: v0.2
Date: 2026-02-25
Owner: Agent 06 (Telemetry & Observability Lead)

## 1. The Distinction

**Telemetry** and **Observability** are related but different concerns:

| Aspect | Telemetry | Observability |
|--------|-----------|---------------|
| **What** | Data emission (events, metrics, logs) | Data consumption (dashboards, alerts, investigation) |
| **Who** | Resources emit telemetry | Operators observe the system |
| **When** | At event time (push) | On demand or continuous (pull/subscribe) |
| **IOA Resource** | Telemetry resource (event contracts) | Telemetry.spec.observability (dashboard, alertRule) |
| **Analogy** | Instrument panel sensors | Pilot reading the instruments |

In v0.1, these were separate principles (P4: Event-Driven Telemetry, P11: Observability First). In v0.2, they merge into **Layer IV: Signal Architecture** because they operate on the same data.

## 2. Three Pillars of IOA Observability

### 2.1 Events (Structured Telemetry)

Every IOA action produces a structured event:

```yaml
apiVersion: ioa.dev/v0.2
kind: Telemetry
metadata:
  name: product-feature-released
spec:
  event: "product.feature_released"
  category: metric
  severity: info
  payload:
    type: object
    properties:
      featureName: { type: string }
      releaseDate: { type: string, format: date }
      rolloutPercentage: { type: number }
  source:
    domain: product
    agent: product-analyst
  correlationId:
    required: true
    format: uuid
  retention:
    duration: "180d"
    archiveAfter: "90d"
```

### 2.2 Traces (Correlated Event Chains)

Traces link related events across resources and domains:

```
Trace: abc-123
├─ workflow_started (growth domain, t=0)
├─ agent_started (growth-optimizer, t=100ms)
├─ agent_completed (growth-optimizer, t=2.5s)
├─ agent_started (product-analyst, t=2.6s)
├─ agent_completed (product-analyst, t=5.1s)
├─ workflow_step_completed (classify, t=5.2s)
├─ workflow_step_completed (analyze, t=8.0s)
└─ workflow_completed (total=8.1s, cost=$0.045)
```

### 2.3 Status (Resource Health)

Every IOA resource has a `status` block with `conditions`:

```yaml
status:
  health: degraded
  conditions:
    - type: KPIsMet
      status: "False"
      reason: TargetMissed
      message: "feature-velocity at 9/quarter, target is >=12"
      lastTransitionTime: "2026-02-25T10:00:00Z"
    - type: BudgetHealthy
      status: "True"
      reason: UnderThreshold
      lastTransitionTime: "2026-02-25T10:00:00Z"
```

## 3. Observability Configuration

The Telemetry resource includes observability settings:

```yaml
spec:
  observability:
    dashboard: true           # Show on dashboard
    alertThreshold: "5m"      # Check interval
    alertRule:
      condition:
        metric: rolloutPercentage
        operator: lt
        value: 50
        window: "24h"
      severity: warning
      channels: [slack-product]
```

### Alert Severity Levels

| Level | Meaning | Response Time | Example |
|-------|---------|--------------|---------|
| **info** | Informational, no action needed | Next business day | Budget at 50% |
| **warning** | Attention needed soon | Within 4 hours | KPI trending down |
| **error** | Action required | Within 1 hour | Agent failure rate > 10% |
| **critical** | Immediate action required | Within 15 minutes | Security violation, budget exceeded |

## 4. What to Observe per Resource Kind

| Resource | Key Metrics | Health Indicators | Alert Conditions |
|----------|------------|-------------------|-----------------|
| **Domain** | cognitiveLoadScore, costToDate, decisionVelocity | health (healthy/degraded/critical) | Health transition, KPI miss |
| **Agent** | errorRate, overrideRate, costConsumed, healthScore | state (running/paused/degraded/failed) | Error rate > threshold, cost overrun |
| **Decision** | Time since reviewDate, assumption validity | spec.status lifecycle | Review overdue, assumption invalidated |
| **Workflow** | latency, costAccumulated, retries | state (executing/failed/compensating) | Timeout, failure, compensation |
| **Budget** | utilizationRate, projectedOverrun | Alert thresholds | Threshold crossed, projected overrun |
| **SecurityPolicy** | violations, blockedOperations, threatLevel | threatLevel (none->critical) | Violation detected, threat level change |
| **Controller** | reconcileCount, driftDetected | Drift frequency | Persistent drift, action failures |
| **Memory** | accessCount, relevanceScore, compoundingValue | state (active/expired) | Expiration approaching, low relevance |

## 5. Building an IOA Dashboard

### Minimum Viable Dashboard (4 panels)

1. **Organization Health** — Aggregate health across all domains (healthy/degraded/critical counts)
2. **Budget Utilization** — Gauge per domain showing % of budget consumed
3. **Active Alerts** — List of current alerts by severity
4. **Workflow Activity** — Running/completed/failed workflows in last 24h

### Comprehensive Dashboard (12 panels)

Add to the above:
5. **Agent Performance** — Error rates and latencies per agent
6. **Decision Pipeline** — Decisions by status (proposed/accepted/active)
7. **Cost Trend** — Daily/weekly cost over time
8. **Security Posture** — Violations, blocked operations, threat level
9. **Controller Activity** — Reconciliation frequency and drift detection
10. **Memory Growth** — New memories created, access patterns
11. **Event Volume** — Events per category over time
12. **Cognitive Load** — Per-domain cognitive load scores

## 6. IOA vs OpenTelemetry

IOA's telemetry model is compatible with but not identical to OpenTelemetry:

| Aspect | IOA | OpenTelemetry |
|--------|-----|---------------|
| Scope | Organizational resources | Application instrumentation |
| Schema | IOA Telemetry resource (YAML) | OTLP (protobuf/JSON) |
| Events | Domain-namespaced (product.feature_released) | Span events |
| Traces | correlationId across workflows | TraceId/SpanId |
| Metrics | KPIs, budgets, health scores | Counters, gauges, histograms |

**Integration path:** IOA telemetry events can be exported as OpenTelemetry spans/events. The IOA CLI could emit OTLP-compatible output. This is a future enhancement (v0.3+).
