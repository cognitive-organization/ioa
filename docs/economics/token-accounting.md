# IOA Token Accounting Model

Version: v0.2
Date: 2026-02-25
Owner: Agent 03 (Economics & FinOps)

## 1. Overview

Every AI agent consumes tokens. Without accounting, organizations cannot:
- Know how much each domain/agent costs
- Set and enforce budgets
- Calculate ROI per agent or decision
- Forecast future spending

IOA's token accounting model provides a standard way to track, allocate, and control AI costs across an organization.

## 2. Accounting Layers

```
┌──────────────────────────────────────────────────────────┐
│  ORGANIZATION LEVEL                                      │
│  Total budget across all domains                         │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │  DOMAIN: product    │  │  DOMAIN: growth     │       │
│  │  Budget: $1,250/q   │  │  Budget: $800/q     │       │
│  │                     │  │                     │       │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │       │
│  │  │ product-analyst│  │  │  │ growth-optim. │  │       │
│  │  │ 40% alloc.    │  │  │  │ 60% alloc.    │  │       │
│  │  │ $500/q budget │  │  │  │ $480/q budget │  │       │
│  │  └───────────────┘  │  │  └───────────────┘  │       │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │       │
│  │  │ insight-report.│  │  │  │ data-pipeline │  │       │
│  │  │ 20% alloc.    │  │  │  │ 40% alloc.    │  │       │
│  │  │ $250/q budget │  │  │  │ $320/q budget │  │       │
│  │  └───────────────┘  │  │  └───────────────┘  │       │
│  └─────────────────────┘  └─────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

### Three-Level Hierarchy

| Level | Resource | Budget Field | Granularity |
|-------|----------|-------------|-------------|
| Organization | Config | (aggregate of domains) | Total spend |
| Domain | Budget resource | `spec.limits` | Per-domain caps |
| Agent | Budget.spec.agents[] | `allocation` fraction | Per-agent allocation |

## 3. Token Tracking Model

### 3.1 What to Track

| Metric | Source | Unit | Update Frequency |
|--------|--------|------|-----------------|
| Input tokens | LLM provider API | tokens | Per-request |
| Output tokens | LLM provider API | tokens | Per-request |
| Total tokens | Computed | tokens | Per-request |
| Cost | Computed from provider pricing | currency | Per-request |
| Requests | Counter | count | Per-request |
| Avg tokens/request | Computed | tokens | Hourly |

### 3.2 Attribution Model

Every token consumption event must be attributed to:

```yaml
# Token consumption event
source:
  organization: "acme-ai"
  domain: "product"                    # Which domain
  agent: "product-analyst"             # Which agent
  workflow: "churn-response"           # Which workflow (if any)
  step: "classify"                     # Which workflow step (if any)
  decision: "dec-001-agent-framework"  # Related decision (if any)
  correlationId: "uuid-1234"           # Trace ID
timestamp: "2026-02-25T10:00:00Z"
tokens:
  input: 1500
  output: 450
  total: 1950
cost:
  value: 0.0058
  currency: "USD"
model:
  provider: "anthropic"
  name: "claude-sonnet-4"
  version: "2025-05-14"
```

### 3.3 Cost Calculation

```
cost = (input_tokens × input_price_per_token) + (output_tokens × output_price_per_token)
```

IOA does NOT define token pricing — it varies by provider. The accounting model is vendor-neutral. Implementations should maintain a pricing table:

```yaml
# Example pricing table (NOT part of IOA spec)
pricing:
  anthropic:
    claude-sonnet-4:
      input_per_1k: 0.003
      output_per_1k: 0.015
  openai:
    gpt-4o:
      input_per_1k: 0.005
      output_per_1k: 0.015
```

## 4. Budget Resource Integration

### 4.1 Budget Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  PLAN    │───>│ ALLOCATE │───>│ MONITOR  │───>│  REVIEW  │
│ Set limits│   │ Assign %  │   │ Track    │   │ Adjust   │
│ per domain│   │ per agent │   │ vs budget│   │ for next │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     ▲                                              │
     └──────────────────────────────────────────────┘
                    Budget Cycle
```

### 4.2 Alert Thresholds

Standard three-tier alert model:

| Threshold | Severity | Action |
|-----------|----------|--------|
| 70% utilization | info | Notify finance channel |
| 90% utilization | warning | Notify finance + engineering lead |
| 100% utilization | critical | Notify all + consider enforcement |

### 4.3 Enforcement Modes

| Mode | Behavior When Over Budget |
|------|--------------------------|
| **enforce** | Block agent operations, return error |
| **warn** | Allow operation, emit warning alert |
| **observe** | Allow operation, log only |

## 5. Cost-per-Decision Framework

Every Decision resource can be enriched with cost data:

```yaml
# In Decision.status
status:
  executionCost:
    value: 45.50
    currency: USD
  # Breakdown
  # - 120 agent invocations during decision analysis
  # - 3 workflow executions to evaluate options
  # - Total: 2.3M tokens consumed
```

### ROI Calculation

```
Decision ROI = (KPI impact value - execution cost) / execution cost

Example:
  KPI impact: feature-velocity +20% → estimated $50,000 value
  Execution cost: $45.50
  ROI = ($50,000 - $45.50) / $45.50 = 1,098x
```

Note: KPI impact valuation is organization-specific and outside IOA's scope. IOA provides the framework to capture both sides of the equation.

## 6. Budget Templates

### 6.1 Startup Template (Low Volume)

```yaml
apiVersion: ioa.dev/v0.2
kind: Budget
metadata:
  name: startup-monthly
spec:
  domain: product
  period: monthly
  limits:
    tokens:
      daily: 100000
      monthly: 2000000
    cost:
      daily: 5.00
      monthly: 100.00
      currency: USD
  alerts:
    - threshold: 0.8
      severity: warning
      channels: [slack-general]
    - threshold: 1.0
      severity: critical
      channels: [slack-general, email-founder]
  enforcement: warn
  agents:
    - name: primary-agent
      allocation: 1.0
```

### 6.2 Enterprise Template (Multi-Domain)

```yaml
apiVersion: ioa.dev/v0.2
kind: Budget
metadata:
  name: enterprise-q1
spec:
  domain: product
  period: "2026-Q1"
  limits:
    tokens:
      daily: 5000000
      monthly: 100000000
      quarterly: 250000000
    cost:
      daily: 250.00
      monthly: 5000.00
      quarterly: 12500.00
      currency: USD
  alerts:
    - threshold: 0.5
      severity: info
      channels: [slack-finance]
    - threshold: 0.75
      severity: warning
      channels: [slack-finance, email-vp-eng]
    - threshold: 0.9
      severity: error
      channels: [slack-finance, email-vp-eng, pagerduty]
    - threshold: 1.0
      severity: critical
      channels: [slack-finance, email-cto, pagerduty]
  enforcement: enforce
  agents:
    - name: strategic-agent
      allocation: 0.3
    - name: analytical-agent
      allocation: 0.25
    - name: tactical-agent
      allocation: 0.25
    - name: monitoring-agent
      allocation: 0.1
    - name: reporting-agent
      allocation: 0.1
```

### 6.3 Hybrid Template (Cost-Conscious)

```yaml
apiVersion: ioa.dev/v0.2
kind: Budget
metadata:
  name: hybrid-monthly
spec:
  domain: analytics
  period: monthly
  limits:
    tokens:
      daily: 500000
      monthly: 10000000
    cost:
      daily: 25.00
      monthly: 500.00
      currency: USD
  alerts:
    - threshold: 0.7
      severity: info
      channels: [slack-ops]
    - threshold: 0.9
      severity: warning
      channels: [slack-ops, email-lead]
    - threshold: 0.95
      severity: critical
      channels: [slack-ops, email-lead, sms-oncall]
  enforcement: warn
  agents:
    - name: data-pipeline
      allocation: 0.5
    - name: insight-reporter
      allocation: 0.3
    - name: alert-monitor
      allocation: 0.2
```

## 7. Economics Dashboard Spec

A compliant IOA economics dashboard should show:

| Panel | Data Source | Visualization |
|-------|------------|---------------|
| Total spend (period) | Budget.status.consumed | Number + trend |
| Budget utilization | Budget.status.utilizationRate | Gauge (0-100%) |
| Spend by domain | Aggregate Budget.status per domain | Stacked bar |
| Spend by agent | Agent.status.costConsumed | Table |
| Cost per decision | Decision.status.executionCost | Table |
| Projected overrun | Budget.status.projectedOverrun | Boolean + date |
| Alert history | Budget.status.alertsTriggered | Timeline |
| Token consumption | Telemetry events | Time series |

## 8. Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| **No budget at all** | Uncontrolled spending | Always set Budget per domain |
| **Infinite budget** | False safety | Set realistic limits based on expected usage |
| **Per-request budgets** | Too granular, constant blocking | Budget at daily/monthly level |
| **Ignoring output tokens** | Output often costs 3-5x more | Track input AND output separately |
| **Static budgets** | Doesn't adapt to growth | Review and adjust each period |
| **Budget without alerts** | Surprises at month-end | Always set at least 2 alert thresholds |
