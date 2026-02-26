# IOA Controller Reconciliation Specification

Version: v0.2.2 (draft)
Status: Draft
Date: 2026-02-25

## 1. Overview

Controllers are the runtime mechanism that make IOA's spec/status model operational. Without controllers, resources are just documents. With controllers, they become a self-correcting system.

A controller is a process (human, AI agent, or automation) that:
1. Watches one or more resource kinds
2. Compares spec (desired state) to status (actual state)
3. Takes actions to converge actual toward desired
4. Reports results by updating status

This is the Kubernetes controller pattern applied to organizational architecture.

## 2. Controller Interface

### 2.1 Controller Resource

```yaml
apiVersion: ioa.dev/v0.2
kind: Controller
metadata:
  name: domain-health-controller
  owner:
    name: "Platform Team"
    role: infrastructure
spec:
  targetKind: Domain
  targetSelector:
    matchLabels:
      tier: production
  reconcileInterval: "5m"
  driftThreshold: 0.15
  actions:
    onDrift:
      - type: alert
        severity: warning
        channels: ["slack-ops"]
      - type: reconcile
        strategy: gradual
    onError:
      - type: alert
        severity: critical
        channels: ["pagerduty"]
      - type: pause
        reason: "Manual investigation required"
    onHealthy:
      - type: log
        level: info
  hooks:
    preReconcile:
      - name: validate-budget
        action: "check budget.status.utilizationRate < 0.9"
      - name: check-security-policy
        action: "verify securityPolicy.status.violations == 0"
    postReconcile:
      - name: emit-telemetry
        event: "controller.reconciliation-completed"
      - name: update-dashboard
        action: "refresh domain.status.lastEvaluation"
  enforcementMode: warn    # enforce | warn | advise | observe
status:
  lastReconcile: "2026-02-25T10:00:00Z"
  reconcileCount: 142
  driftDetected: false
  lastDriftAt: "2026-02-24T15:30:00Z"
  actionsPerformed:
    - type: reconcile
      target: "domain/product"
      at: "2026-02-24T15:30:00Z"
      result: success
  healthyResources: 3
  unhealthyResources: 0
  conditions:
    - type: Reconciling
      status: "False"
      reason: AllHealthy
      message: "All 3 domains are healthy"
      lastTransitionTime: "2026-02-25T10:00:00Z"
```

### 2.2 Required Spec Fields

| Field | Type | Description |
|-------|------|-------------|
| targetKind | string | Resource kind to watch (Domain, Agent, etc.) |
| targetSelector | object | Label-based selector for filtering resources |
| reconcileInterval | string | How often to run the reconciliation loop |
| enforcementMode | enum | enforce, warn, advise, observe |

### 2.3 Optional Spec Fields

| Field | Type | Description |
|-------|------|-------------|
| driftThreshold | number | 0-1, threshold for triggering drift actions |
| actions.onDrift | array | Actions when drift detected |
| actions.onError | array | Actions when reconciliation fails |
| actions.onHealthy | array | Actions when all resources healthy |
| hooks.preReconcile | array | Checks before reconciliation |
| hooks.postReconcile | array | Actions after reconciliation |

## 3. Reconciliation Loop

### 3.1 The Five Phases

```
┌─────────────────────────────────────────────────────────────┐
│                  RECONCILIATION LOOP                        │
│                                                             │
│   ┌───────┐    ┌──────┐    ┌──────┐    ┌─────┐    ┌──────┐│
│   │ WATCH │───>│ DIFF │───>│ PLAN │───>│ ACT │───>│REPORT││
│   └───────┘    └──────┘    └──────┘    └─────┘    └──────┘│
│       ▲                                              │      │
│       └──────────────────────────────────────────────┘      │
│                    reconcileInterval                        │
└─────────────────────────────────────────────────────────────┘
```

**Phase 1: WATCH**
- Select resources matching targetKind + targetSelector
- Load current spec and status for each resource
- Filter to resources that haven't been reconciled within the interval

**Phase 2: DIFF**
- Compare spec (desired) vs status (actual) for each resource
- Calculate drift score (0.0 = perfect convergence, 1.0 = total divergence)
- Drift types:
  - **Field drift**: spec field doesn't match status observation
  - **KPI drift**: KPI targets in spec not met by status metrics
  - **Health drift**: status.conditions show unhealthy state
  - **Budget drift**: cost consumed exceeds budget allocation
  - **Security drift**: violations detected against security policy

**Phase 3: PLAN**
- If drift score < driftThreshold → skip (already converged)
- If drift score >= driftThreshold → generate action plan
- Run preReconcile hooks (abort if any hook fails in enforce mode)
- Determine actions based on drift type and enforcementMode

**Phase 4: ACT**
- Execute planned actions based on enforcementMode:
  - **enforce**: Block non-compliant operations, force state changes
  - **warn**: Allow operation but emit warning + alert
  - **advise**: Log recommendation, no blocking
  - **observe**: Passive monitoring, log only
- Record each action performed with timestamp and result

**Phase 5: REPORT**
- Update Controller.status (lastReconcile, driftDetected, actionsPerformed, etc.)
- Update target resource's status.conditions
- Run postReconcile hooks (emit telemetry, update dashboards)
- Emit controller.reconciliation-completed telemetry event

### 3.2 Drift Score Calculation

The drift score is a weighted average across drift dimensions:

```
driftScore = Σ(weight_i × dimension_score_i) / Σ(weight_i)

Dimensions:
  - kpi_drift:      weight=0.3, score=fraction of KPIs not meeting target
  - health_drift:   weight=0.3, score=fraction of conditions with status="False"
  - budget_drift:   weight=0.2, score=max(0, (consumed - allocated) / allocated)
  - security_drift: weight=0.2, score=violations / total_rules
```

### 3.3 Error Handling

| Error Type | Default Behavior | Configurable? |
|------------|-----------------|---------------|
| Hook failure (preReconcile) | Skip reconciliation | Yes (failOpen vs failClosed) |
| Action execution failure | Log error, continue loop | Yes (stopOnError) |
| Resource not found | Remove from watch list | No |
| Timeout | Cancel current cycle, alert | Yes (timeout field) |

## 4. Controller Types (by target)

| Controller | Watches | Key Drift Dimensions | Example Actions |
|------------|---------|---------------------|-----------------|
| Domain Health | Domain | KPIs, cost, incidents | Scale agents, alert stakeholders |
| Agent Performance | Agent | error rate, latency, cost | Restart, throttle, escalate |
| Budget Guardian | Budget | utilization vs limits | Throttle agents, alert, block |
| Security Auditor | SecurityPolicy | violations, threats | Block operations, escalate |
| Workflow Monitor | Workflow | execution state, timeout | Retry, compensate, abort |
| Decision Tracker | Decision | assumptions validity, review dates | Flag for review, archive |

## 5. Implementation Notes

### 5.1 Controller is NOT an AI Agent

A controller can be:
- A human reviewing a dashboard
- A cron job running `ioa validate`
- An AI agent with appropriate permissions
- A CI/CD pipeline step
- Any process that implements the Watch/Diff/Plan/Act/Report interface

IOA does not prescribe the implementation. The Controller resource describes the WHAT, not the HOW.

### 5.2 Controller vs Agent

| Aspect | Controller | Agent |
|--------|-----------|-------|
| Purpose | Maintain convergence | Perform domain work |
| Operates on | Resources (meta-level) | Domain data |
| Lifecycle | Continuous loop | Event/schedule triggered |
| Output | Status updates | Domain artifacts |
| Scope | Cross-resource | Within domain |

### 5.3 Multiple Controllers per Resource

Multiple controllers can watch the same resource kind (e.g., a budget controller AND a security controller both watching Agents). When this happens:
- Each controller updates its own conditions in status.conditions
- Condition types must be namespaced (e.g., "BudgetHealthy", "SecurityCompliant")
- No controller may delete conditions set by another controller

## 6. Telemetry Events

Controllers MUST emit these telemetry events:

| Event | Category | When |
|-------|----------|------|
| controller.reconciliation-started | audit | Start of each cycle |
| controller.reconciliation-completed | audit | End of each cycle |
| controller.drift-detected | alert | Drift score exceeds threshold |
| controller.action-performed | audit | Each action taken |
| controller.error | alert | Any error during reconciliation |

## 7. Security Considerations

- Controllers with enforcementMode: enforce have elevated privileges — they can block operations
- Controller credentials should follow least-privilege principle
- All controller actions are auditable via telemetry events
- Human override (Principle #9) takes precedence over controller actions
