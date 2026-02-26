# IOA Event Taxonomy

Version: v0.2
Date: 2026-02-25
Owner: Agent 06 (Telemetry & Observability Lead)

## 1. Overview

Every IOA resource kind emits telemetry events. This taxonomy defines:
- **Mandatory events** that every implementation MUST emit
- **Recommended events** that implementations SHOULD emit
- **Naming conventions** for event names
- **Payload schemas** for each event

## 2. Naming Convention

All events follow the pattern: `{domain}.{resource_kind}_{action}`

Examples:
- `product.agent_started`
- `growth.workflow_completed`
- `system.controller_drift-detected`

For system-level events (controllers, security), use `system` as the domain prefix.

### Rules

| Rule | Example | Anti-Pattern |
|------|---------|-------------|
| lowercase only | `product.feature_released` | `Product.Feature_Released` |
| dots separate domain from event | `growth.user_acquired` | `growth-user-acquired` |
| underscores within event name | `agent_state_changed` | `agentStateChanged` |
| past tense for completed actions | `workflow_completed` | `workflow_complete` |
| present tense for state changes | `agent_running` | `agent_ran` |

## 3. Event Categories

| Category | Purpose | Retention Hint |
|----------|---------|---------------|
| **metric** | Quantitative measurement (counts, gauges, histograms) | 90-365 days |
| **log** | Detailed operational information | 30-90 days |
| **trace** | Request/workflow execution path with correlationId | 30-90 days |
| **alert** | Condition requiring attention | 365 days |
| **audit** | Compliance-relevant action (who did what when) | 1-7 years |

## 4. Mandatory Events by Resource Kind

### 4.1 Domain Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.domain_health_changed` | alert | Domain health transitions (healthy->degraded, etc.) | `{ previousHealth, currentHealth, reason }` |
| `{domain}.domain_evaluated` | metric | After controller evaluates domain status | `{ health, cognitiveLoadScore, activeAgents, activeIncidents }` |

### 4.2 Agent Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.agent_started` | audit | Agent begins execution | `{ agentName, type, role, model }` |
| `{domain}.agent_completed` | audit | Agent finishes execution | `{ agentName, durationMs, tokensConsumed, success }` |
| `{domain}.agent_failed` | alert | Agent execution failed | `{ agentName, error, errorCategory }` |
| `{domain}.agent_state_changed` | log | Agent state transitions | `{ agentName, previousState, currentState, reason }` |
| `{domain}.agent_overridden` | audit | Human overrode agent decision | `{ agentName, overriddenBy, reason }` |

### 4.3 Decision Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.decision_proposed` | audit | New decision created | `{ decisionId, initiatedBy, domain }` |
| `{domain}.decision_accepted` | audit | Decision accepted | `{ decisionId, deciders, chosen }` |
| `{domain}.decision_activated` | audit | Decision moved to active | `{ decisionId }` |
| `{domain}.decision_superseded` | audit | Decision replaced by newer one | `{ decisionId, supersededBy }` |
| `{domain}.decision_review_due` | alert | Decision review date approaching | `{ decisionId, reviewDate, daysUntilReview }` |

### 4.4 Telemetry Meta-Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `system.telemetry_emitted` | trace | Any telemetry event emitted (meta) | `{ eventName, correlationId, source }` |
| `system.telemetry_alert_triggered` | alert | Alert rule condition met | `{ eventName, alertRule, severity, value }` |

### 4.5 Governance Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.governance_policy_applied` | audit | Governance policy evaluated | `{ policyName, domain, result }` |
| `{domain}.governance_escalation_triggered` | alert | Escalation path activated | `{ policyName, level, role, reason }` |
| `{domain}.governance_override_requested` | audit | Human override requested | `{ channel, requestedBy, context }` |
| `{domain}.governance_compliance_changed` | alert | Compliance status changed | `{ previousStatus, currentStatus, reason }` |

### 4.6 Workflow Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.workflow_started` | audit | Workflow execution begins | `{ workflowName, trigger, domainsInvolved }` |
| `{domain}.workflow_step_completed` | trace | Individual step finished | `{ workflowName, stepName, agent, durationMs, correlationId }` |
| `{domain}.workflow_step_failed` | alert | Step execution failed | `{ workflowName, stepName, error, onFailure }` |
| `{domain}.workflow_completed` | audit | Workflow finished successfully | `{ workflowName, totalDurationMs, stepsCompleted, costAccumulated }` |
| `{domain}.workflow_failed` | alert | Workflow failed | `{ workflowName, failedStep, failurePolicy }` |
| `{domain}.workflow_compensating` | alert | Compensation started | `{ workflowName, failedStep, compensationSteps }` |

### 4.7 SecurityPolicy Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `system.security_violation_detected` | alert | Security policy violated | `{ policyName, violation, agent, severity }` |
| `system.security_access_denied` | audit | Access blocked by policy | `{ agent, resource, operation, reason }` |
| `system.security_identity_verified` | audit | Agent identity verified | `{ agent, method, success }` |
| `system.security_injection_detected` | alert | Prompt injection detected | `{ agent, pattern, action }` |

### 4.8 Budget Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.budget_threshold_reached` | alert | Alert threshold crossed | `{ budgetName, threshold, utilizationRate, severity }` |
| `{domain}.budget_exceeded` | alert | Budget limit exceeded | `{ budgetName, limit, consumed, enforcement }` |
| `{domain}.budget_agent_overspend` | alert | Agent exceeded allocation | `{ budgetName, agentName, allocation, consumed }` |

### 4.9 Controller Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `system.controller_reconciliation_started` | audit | Reconciliation loop begins | `{ controllerName, targetKind, resourceCount }` |
| `system.controller_reconciliation_completed` | audit | Reconciliation loop ends | `{ controllerName, durationMs, driftDetected, actionsPerformed }` |
| `system.controller_drift_detected` | alert | Drift above threshold | `{ controllerName, targetResource, driftScore, threshold }` |
| `system.controller_action_performed` | audit | Controller took action | `{ controllerName, actionType, target, result }` |

### 4.10 Memory Events

| Event | Category | When | Mandatory Payload |
|-------|----------|------|-------------------|
| `{domain}.memory_created` | audit | New memory entry stored | `{ memoryName, entryType, scope, sourceAgent }` |
| `{domain}.memory_accessed` | log | Memory entry retrieved | `{ memoryName, accessedBy, relevanceScore }` |
| `{domain}.memory_expired` | log | Memory entry expired | `{ memoryName, duration, accessCount }` |
| `{domain}.memory_superseded` | audit | Memory replaced by newer entry | `{ memoryName, supersededBy }` |

## 5. CorrelationId Propagation

All events within a workflow execution MUST share the same correlationId:

```
workflow_started        correlationId: "abc-123"
  └─ step_completed     correlationId: "abc-123"
     └─ agent_started   correlationId: "abc-123"
     └─ agent_completed correlationId: "abc-123"
  └─ step_completed     correlationId: "abc-123"
workflow_completed      correlationId: "abc-123"
```

Format: UUID v4 or ULID (configured in Telemetry.spec.correlationId.format).

## 6. Event Count Summary

| Resource Kind | Mandatory Events | Total |
|---------------|-----------------|-------|
| Domain | 2 | 2 |
| Agent | 5 | 5 |
| Decision | 5 | 5 |
| Telemetry | 2 | 2 |
| Governance | 4 | 4 |
| Workflow | 6 | 6 |
| SecurityPolicy | 4 | 4 |
| Budget | 3 | 3 |
| Controller | 4 | 4 |
| Memory | 4 | 4 |
| **Total** | **39** | **39** |
