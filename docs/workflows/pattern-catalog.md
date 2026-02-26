# IOA Workflow Pattern Catalog

Version: v0.2
Date: 2026-02-25
Owner: Agent 05 (Workflow Orchestrator)

## Overview

IOA Workflows are multi-agent, cross-domain orchestrations modeled as DAGs (Directed Acyclic Graphs). This catalog documents reusable patterns for common orchestration scenarios.

Each pattern includes: description, when to use, structure, example YAML, compensation strategy, and anti-patterns.

---

## Pattern 1: Sequential Pipeline

**Description:** Steps execute one after another in a fixed order. Each step depends on the previous.

**When to use:** Linear processing where each stage transforms input for the next.

**Structure:**
```
[Step A] → [Step B] → [Step C] → [Step D]
```

**Example: Content Review Pipeline**
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: content-review-pipeline
  owner:
    name: "Content Team"
    role: content-ops
spec:
  description: "Review and publish content through quality stages"
  domainsInvolved:
    - product
    - growth
  trigger:
    event: product.content-submitted
  steps:
    - name: classify
      agent: content-classifier
      action: "Classify content type and priority"
      timeout: "2m"
      retryPolicy:
        maxRetries: 2
        backoff: "30s"
      onFailure: abort
    - name: review
      agent: quality-reviewer
      action: "Review content for accuracy and compliance"
      dependsOn: [classify]
      timeout: "10m"
      onFailure: abort
    - name: optimize
      agent: seo-optimizer
      action: "Optimize content for search and engagement"
      dependsOn: [review]
      timeout: "5m"
      onFailure: skip
    - name: publish
      agent: content-publisher
      action: "Publish to all configured channels"
      dependsOn: [optimize]
      timeout: "3m"
      onFailure: compensate
  compensation:
    - step: publish
      action: "Unpublish content from all channels"
      agent: content-publisher
  timeout: "25m"
  failurePolicy: compensate
```

**Compensation:** Only the last step (publish) needs compensation -- earlier steps are read-only.

**Anti-patterns:**
- Using sequential when steps are actually independent (use fan-out instead)
- No timeout on individual steps

---

## Pattern 2: Fan-Out / Fan-In

**Description:** Multiple steps execute in parallel (fan-out), then a single step aggregates results (fan-in).

**When to use:** When multiple independent analyses need to happen, then be combined.

**Structure:**
```
              ┌─ [Step B1] ─┐
[Step A] ──── ├─ [Step B2] ─┤ ──── [Step C]
              └─ [Step B3] ─┘
```

**Example: Multi-Source Risk Assessment**
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: risk-assessment
  owner:
    name: "Risk Team"
    role: risk-ops
spec:
  description: "Assess risk from multiple data sources in parallel, then consolidate"
  domainsInvolved:
    - analytics
    - product
    - growth
  trigger:
    event: analytics.risk-signal
    condition: "riskScore >= 0.7"
  steps:
    - name: trigger-analysis
      agent: data-pipeline
      action: "Parse risk signal and prepare analysis context"
      timeout: "2m"
      onFailure: abort
    - name: financial-risk
      agent: financial-analyst
      action: "Assess financial exposure and revenue impact"
      dependsOn: [trigger-analysis]
      timeout: "5m"
      onFailure: skip
    - name: user-impact
      agent: product-analyst
      action: "Assess user base impact and churn probability"
      dependsOn: [trigger-analysis]
      timeout: "5m"
      onFailure: skip
    - name: competitive-risk
      agent: growth-optimizer
      action: "Assess competitive landscape implications"
      dependsOn: [trigger-analysis]
      timeout: "5m"
      onFailure: skip
    - name: consolidate
      agent: insight-reporter
      action: "Consolidate all risk assessments into unified report"
      dependsOn: [financial-risk, user-impact, competitive-risk]
      timeout: "3m"
      onFailure: abort
  timeout: "20m"
  failurePolicy: abort
```

**Compensation:** Not needed -- all steps are analytical (read-only).

**Anti-patterns:**
- Fan-in step not handling missing results (when a parallel step is skipped)
- Too many parallel steps (>5 creates cognitive load on the consolidation agent)

---

## Pattern 3: Saga (Compensating Transactions)

**Description:** A sequence of steps where each step has a compensating action. If any step fails, previously completed steps are rolled back in reverse order.

**When to use:** When steps mutate state and you need all-or-nothing semantics.

**Structure:**
```
[Step A] → [Step B] → [Step C] ──── (if C fails) ──── [Undo B] → [Undo A]
```

**Example: Customer Onboarding**
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: customer-onboarding
  owner:
    name: "Growth Team"
    role: growth-ops
spec:
  description: "Full customer onboarding with rollback capability"
  domainsInvolved:
    - growth
    - product
    - analytics
  trigger:
    event: growth.user-signed-up
  steps:
    - name: create-account
      agent: growth-optimizer
      action: "Create customer account and profile"
      timeout: "2m"
      onFailure: compensate
    - name: provision-workspace
      agent: product-analyst
      action: "Provision product workspace and initial configuration"
      dependsOn: [create-account]
      timeout: "5m"
      onFailure: compensate
    - name: setup-analytics
      agent: data-pipeline
      action: "Initialize analytics tracking for new customer"
      dependsOn: [provision-workspace]
      timeout: "3m"
      onFailure: compensate
    - name: send-welcome
      agent: growth-optimizer
      action: "Send welcome email and schedule onboarding sequence"
      dependsOn: [setup-analytics]
      timeout: "1m"
      onFailure: skip
  compensation:
    - step: setup-analytics
      action: "Remove analytics tracking configuration"
      agent: data-pipeline
    - step: provision-workspace
      action: "Delete provisioned workspace and configuration"
      agent: product-analyst
    - step: create-account
      action: "Deactivate customer account"
      agent: growth-optimizer
  timeout: "15m"
  failurePolicy: compensate
```

**Key principle:** Compensation runs in REVERSE order. The last completed step is compensated first.

**Anti-patterns:**
- Compensation that can itself fail (compensations should be idempotent)
- Not testing the compensation path
- Using saga for read-only operations (unnecessary overhead)

---

## Pattern 4: Approval Gate

**Description:** Workflow pauses at a gate and waits for human approval before proceeding. Implements Human Override Principle (P9).

**When to use:** High-impact decisions, compliance-required approvals, escalation paths.

**Structure:**
```
[Step A] → [Step B] → [GATE: human approval] → [Step C] → [Step D]
```

**Example: Production Deployment**
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: production-deployment
  owner:
    name: "Engineering"
    role: engineering-lead
spec:
  description: "Deploy to production with mandatory human approval"
  domainsInvolved:
    - product
  trigger:
    event: product.release-ready
  steps:
    - name: validate
      agent: product-analyst
      action: "Run pre-deployment validation checks"
      timeout: "5m"
      onFailure: abort
    - name: stage
      agent: data-pipeline
      action: "Deploy to staging environment"
      dependsOn: [validate]
      timeout: "10m"
      onFailure: compensate
    - name: approval-gate
      agent: insight-reporter
      action: "GATE: Request human approval with staging results. Block until approved."
      dependsOn: [stage]
      timeout: "24h"
      onFailure: compensate
    - name: deploy
      agent: data-pipeline
      action: "Deploy to production"
      dependsOn: [approval-gate]
      timeout: "15m"
      onFailure: compensate
    - name: verify
      agent: product-analyst
      action: "Run post-deployment health checks"
      dependsOn: [deploy]
      timeout: "5m"
      onFailure: abort
  compensation:
    - step: deploy
      action: "Rollback production to previous version"
      agent: data-pipeline
    - step: stage
      action: "Cleanup staging environment"
      agent: data-pipeline
  timeout: "26h"
  failurePolicy: compensate
```

**Key principle:** The gate step has a long timeout (24h) because it waits for human input. The gate agent should emit a telemetry alert requesting approval.

**Anti-patterns:**
- Gate without timeout (workflow hangs forever)
- Auto-approving gates (defeats the purpose)
- Too many gates (approval fatigue, same as override fatigue)

---

## Pattern 5: Event-Driven Chain

**Description:** Workflow steps are triggered by events rather than explicit dependencies. Loose coupling between steps.

**When to use:** Long-running processes where steps happen asynchronously, potentially hours or days apart.

**Structure:**
```
[Event A] → [Step 1] → emits [Event B]
                                  │
[Event B] → [Step 2] → emits [Event C]
                                  │
[Event C] → [Step 3]
```

**Example: Feedback-to-Feature Loop**
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: feedback-to-feature
  owner:
    name: "Product Team"
    role: product-lead
spec:
  description: "Transform user feedback into product features through analysis chain"
  domainsInvolved:
    - product
    - analytics
  trigger:
    event: product.feedback-batch-ready
    condition: "feedbackCount >= 50"
  steps:
    - name: analyze-sentiment
      agent: product-analyst
      action: "Analyze feedback sentiment and extract themes"
      timeout: "10m"
      onFailure: abort
    - name: cluster-features
      agent: product-analyst
      action: "Cluster feedback into potential feature requests"
      dependsOn: [analyze-sentiment]
      timeout: "5m"
      onFailure: abort
    - name: prioritize
      agent: insight-reporter
      action: "Score and prioritize feature clusters by impact and effort"
      dependsOn: [cluster-features]
      timeout: "5m"
      onFailure: abort
    - name: create-proposals
      agent: product-analyst
      action: "Create Decision resources (proposed) for top-priority features"
      dependsOn: [prioritize]
      timeout: "5m"
      onFailure: skip
  timeout: "30m"
  failurePolicy: abort
```

**Key principle:** This pattern works well with telemetry events. Each step can emit events that trigger downstream workflows.

**Anti-patterns:**
- Circular event chains (A triggers B triggers A)
- Events without correlationId (impossible to trace the chain)

---

## Pattern Selection Guide

| Scenario | Recommended Pattern | Key Factor |
|----------|-------------------|------------|
| Data processing pipeline | Sequential | Order matters, each step transforms data |
| Multi-source analysis | Fan-Out/Fan-In | Independent analyses, then aggregation |
| State-mutating operations | Saga | Need rollback capability |
| Compliance/high-impact | Approval Gate | Human oversight required |
| Long-running async | Event-Driven Chain | Steps separated by hours/days |
| Simple 2-step operation | Sequential | Don't over-engineer |

## Common Guidelines

1. **Always set timeouts** -- both per-step and overall workflow
2. **Compensation for mutations** -- any step that changes state needs a compensating action
3. **Idempotent compensations** -- compensating actions should be safe to retry
4. **Maximum 10 steps** -- more than 10 steps suggests the workflow should be split
5. **Cross-domain = governance** -- workflows spanning multiple domains require governance policy review
6. **CorrelationId** -- propagate correlation IDs through all steps for traceability
7. **Test the failure path** -- run workflows with simulated failures to verify compensation logic
