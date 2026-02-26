# IOA Workflow State Machine

Version: v0.2
Date: 2026-02-25
Owner: Agent 05 (Workflow Orchestrator)

## 1. Workflow States

A Workflow resource has a `status.state` field that tracks its lifecycle:

```
                          ┌──────────────┐
                          │              │
                          ▼              │
┌──────┐    ┌────────┐    ┌───────────┐  │   ┌───────────┐
│ idle │───>│ queued │───>│ executing │──┼──>│ completed │
└──────┘    └────────┘    └───────────┘  │   └───────────┘
                               │        │
                               │        │   ┌──────────────┐
                               ▼        └──>│    failed    │
                          ┌─────────┐       └──────────────┘
                          │ blocked │              │
                          └─────────┘              ▼
                                          ┌──────────────┐
                                          │ compensating │
                                          └──────────────┘
                                                 │
                                          ┌──────┴──────┐
                                          ▼             ▼
                                    ┌──────────┐  ┌──────────┐
                                    │ completed│  │  failed  │
                                    │(rollback)│  │(partial) │
                                    └──────────┘  └──────────┘
```

### State Definitions

| State | Description | Entry Condition | Exit Condition |
|-------|-------------|-----------------|----------------|
| **idle** | Workflow defined but not triggered | Initial state after creation | Trigger event received or manual start |
| **queued** | Waiting for execution resources | Trigger condition met | Execution slot available |
| **executing** | Steps are being processed | Dequeued for execution | All steps complete OR failure |
| **blocked** | Waiting for external input (e.g., approval gate) | Step requires human input | Human approval/rejection received |
| **completed** | All steps finished successfully | Last step completed | Terminal state |
| **failed** | One or more steps failed | Step failure + failurePolicy != compensate | Terminal state OR triggers compensation |
| **compensating** | Running compensation actions in reverse | failurePolicy == compensate + failure occurred | All compensations complete |

### Valid State Transitions

| From | To | Trigger |
|------|----|---------|
| idle | queued | Trigger event or manual start |
| queued | executing | Execution resources available |
| executing | blocked | Step requires external input |
| executing | completed | All steps finished |
| executing | failed | Step failed + policy != compensate |
| executing | compensating | Step failed + policy == compensate |
| blocked | executing | External input received |
| blocked | failed | Timeout on blocked step |
| compensating | completed | All compensations successful |
| compensating | failed | Compensation itself failed |

### Invalid Transitions (MUST NOT occur)

- idle → executing (must go through queued)
- completed → any (terminal)
- failed → executing (must restart as new workflow)
- compensating → executing (cannot resume after compensation starts)

## 2. Step States

Individual steps within a workflow have their own lifecycle:

```
┌─────────┐    ┌─────────┐    ┌───────────┐
│ pending │───>│ running │───>│ completed │
└─────────┘    └─────────┘    └───────────┘
                    │
                    ├────────> ┌──────────┐
                    │          │ skipped  │  (onFailure: skip)
                    │          └──────────┘
                    │
                    └────────> ┌──────────┐
                               │  failed  │
                               └──────────┘
```

| Step State | Description |
|-----------|-------------|
| **pending** | Dependencies not yet met |
| **running** | Currently executing |
| **completed** | Finished successfully |
| **failed** | Execution failed |
| **skipped** | Skipped due to upstream failure (onFailure: skip) |

## 3. Error Handling

### 3.1 Error Categories

| Category | Description | Default Response | Retry? |
|----------|-------------|-----------------|--------|
| **Transient** | Network timeout, rate limit, temporary unavailability | Retry with backoff | Yes |
| **Agent Error** | Agent returned invalid output, crashed | Log + skip or abort | Configurable |
| **Timeout** | Step exceeded its timeout limit | Abort step, trigger onFailure | No |
| **Validation** | Step input/output doesn't match schema | Abort step, log error | No |
| **External** | External API failure, data unavailable | Retry or skip | Configurable |
| **Governance** | Action blocked by governance policy | Block + escalate | No |

### 3.2 Retry Policy

```yaml
retryPolicy:
  maxRetries: 3           # Maximum retry attempts
  backoff: "exponential"  # constant | linear | exponential
  initialDelay: "1s"      # Delay before first retry
  maxDelay: "60s"         # Maximum delay between retries
```

**Backoff strategies:**

| Strategy | Delay Pattern | Use Case |
|----------|--------------|----------|
| constant | 5s, 5s, 5s | Known recovery time |
| linear | 5s, 10s, 15s | Gradual backoff |
| exponential | 1s, 2s, 4s, 8s | Rate limiting, overload |

### 3.3 onFailure Actions

Each step defines what happens when it fails:

| Action | Behavior |
|--------|----------|
| **abort** | Stop entire workflow, mark as failed |
| **skip** | Skip this step, continue with next (if dependencies allow) |
| **compensate** | Trigger compensation for this and all previous completed steps |

### 3.4 Timeout Handling

```yaml
# Step-level timeout
steps:
  - name: analyze
    timeout: "5m"        # This step must complete in 5 minutes

# Workflow-level timeout
timeout: "30m"           # Entire workflow must complete in 30 minutes
```

Rules:
- Step timeout triggers step failure → onFailure action
- Workflow timeout triggers workflow failure → failurePolicy
- Workflow timeout overrides any step timeout
- Blocked state (waiting for human) counts against workflow timeout

## 4. Compensation Logic

### 4.1 Compensation Order

Compensation runs in **reverse order** of completed steps:

```
Execution:    Step A → Step B → Step C → Step D (fails)
Compensation: Undo C → Undo B → Undo A
```

### 4.2 Compensation Rules

1. **Only completed steps are compensated** — pending/skipped steps are ignored
2. **Reverse order is mandatory** — the last completed step is undone first
3. **Compensations must be idempotent** — safe to run multiple times
4. **Compensation failure does NOT trigger further compensation** — the workflow enters terminal `failed` state with partial rollback
5. **Read-only steps don't need compensation** — only steps that mutate state

### 4.3 Compensation Example

```yaml
spec:
  steps:
    - name: create-account      # Mutates: creates user record
      onFailure: compensate
    - name: provision-workspace  # Mutates: allocates resources
      onFailure: compensate
    - name: setup-analytics      # Mutates: creates tracking config
      onFailure: compensate
    - name: send-welcome         # Side effect: sends email
      onFailure: skip            # Can't unsend email, so skip

  compensation:
    - step: setup-analytics
      action: "Remove analytics configuration"
      agent: data-pipeline
    - step: provision-workspace
      action: "Delete workspace and release resources"
      agent: product-analyst
    - step: create-account
      action: "Deactivate account (soft delete)"
      agent: growth-optimizer
```

Note: `send-welcome` has onFailure: skip, not compensate — you cannot unsend an email.

## 5. Concurrency and DAG Execution

### 5.1 Parallel Execution

Steps without dependencies (or with the same dependencies) can execute in parallel:

```yaml
steps:
  - name: step-a
    # No dependencies → starts immediately
  - name: step-b
    dependsOn: [step-a]
  - name: step-c
    dependsOn: [step-a]   # Same dependency as step-b
  - name: step-d
    dependsOn: [step-b, step-c]  # Waits for BOTH
```

Execution timeline:
```
Time →
step-a: ████████
step-b:          ████████
step-c:          ██████          (parallel with step-b)
step-d:                  ████████
```

### 5.2 DAG Validation Rules

1. **No cycles** — A step cannot (directly or indirectly) depend on itself
2. **All dependencies must exist** — dependsOn references must match step names
3. **At least one root** — At least one step must have no dependencies
4. **Connected graph** — All steps must be reachable from a root

## 6. Guidelines

1. **Set timeouts for everything** — Steps without timeout can hang forever
2. **Use skip for non-critical steps** — Don't abort a workflow because a notification failed
3. **Compensations are for mutations only** — Read-only analysis doesn't need compensation
4. **Test the failure path** — Simulate failures to verify compensation logic works
5. **Keep workflows under 10 steps** — Split large workflows into sub-workflows
6. **Log step transitions** — Emit telemetry events for every state change
7. **Use approval gates for irreversible actions** — Pattern 4 from the pattern catalog
