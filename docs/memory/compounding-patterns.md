# IOA Compounding Memory Patterns

Version: v0.2
Date: 2026-02-25
Owner: Agent 07 (Memory Systems Architect)

## 1. What Is Compounding Memory?

Most memory in AI systems is static — stored once, retrieved as-is, eventually forgotten. **Compounding memory** is different: it gains value over time as it is referenced, validated, and enriched by subsequent decisions, workflows, and observations.

Like compound interest in finance, compounding memory grows its organizational value the longer it exists and the more it connects to other knowledge.

## 2. The Compounding Mechanism

```
┌─────────────┐     referenced by      ┌─────────────────┐
│  Memory A   │ ────────────────────── │  Decision D-005 │
│  value: 1.0 │                        └─────────────────┘
└─────────────┘
       │              referenced by      ┌─────────────────┐
       │         ────────────────────── │  Memory B        │
       │                                │  (builds on A)   │
       │                                └─────────────────┘
       ▼
  value: 3.2  (compounded)
```

**Value increases when:**
- Another Memory references it (via `spec.references`)
- A Decision cites it as context
- A Workflow uses it as input
- An Agent retrieves it (accessCount increases)
- Its observations are validated by outcomes

**Value decreases when:**
- It goes unreferenced for extended periods
- Its content is contradicted by newer observations
- It is superseded by a newer Memory entry

## 3. Compounding Patterns

### Pattern 1: Decision Memory Chain

Each Decision creates a Memory entry capturing the context, rationale, and outcome. Future Decisions reference past Decision Memories, building an institutional knowledge chain.

```yaml
# Memory from Decision DEC-001
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: dec-001-rationale
spec:
  scope: organization
  sourceAgent: insight-reporter
  sourceDomain: product
  entryType: decision
  content: "Chose IOA doctrine over ad-hoc agent management. Key factor: K8s familiarity of engineering team reduced adoption friction. ROI: feature velocity +20% in first quarter."
  tags: [decision, ioa-adoption, framework-choice]
  references:
    - kind: Decision
      name: dec-001-agent-framework
  confidence: 0.95
  retention:
    duration: permanent
```

```yaml
# Later Decision DEC-005 references DEC-001's memory
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: dec-005-context
spec:
  scope: organization
  sourceAgent: insight-reporter
  sourceDomain: product
  entryType: decision
  content: "Extended IOA adoption to analytics domain. Referenced dec-001 outcome showing +20% feature velocity. Analytics team also K8s-familiar (validated assumption A1 from DEC-001)."
  references:
    - kind: Decision
      name: dec-005-analytics-adoption
    - kind: Memory
      name: dec-001-rationale    # Compounds DEC-001's memory
  confidence: 0.90
```

**Compounding effect:** dec-001-rationale's compoundingValue increases each time a new decision references it.

### Pattern 2: Workflow Learning Loop

After each workflow execution, an agent creates a Memory entry with performance data. Over time, these memories reveal optimization opportunities.

```yaml
# After workflow execution #47
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: churn-response-run-047
spec:
  scope: domain
  sourceAgent: growth-optimizer
  sourceDomain: growth
  entryType: observation
  content: "Churn response workflow run #47. Total time: 4.2 min (vs avg 6.1 min). The 'classify' step was 60% faster due to cached model. Retention offer accepted by customer within 30 min."
  tags: [workflow-performance, churn, optimization]
  references:
    - kind: Workflow
      name: churn-response
  confidence: 1.0
  retention:
    duration: "180d"
```

```yaml
# After 50+ runs, a pattern memory emerges
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: churn-response-optimization-pattern
spec:
  scope: organization
  sourceAgent: insight-reporter
  sourceDomain: growth
  entryType: pattern
  content: "Analysis of 50 churn-response workflow runs shows: (1) Cached model reduces classify step by 55-65%. (2) Offers delivered within 2h have 3.2x acceptance rate. (3) Fan-out pattern for analysis reduced total time by 40%. Recommend: always use cached model, set hard SLO of 2h end-to-end."
  summary: "Churn workflow optimization: cached model -60%, 2h SLO = 3.2x retention"
  tags: [pattern, workflow-optimization, churn, slo]
  references:
    - kind: Workflow
      name: churn-response
    - kind: Memory
      name: churn-response-run-047
  confidence: 0.92
  retention:
    duration: permanent
```

**Compounding effect:** Individual run memories are relatively low-value. The pattern memory that emerges from them is high-value and permanently retained.

### Pattern 3: Error → Learning → Prevention

When an error occurs, it becomes a Memory. When the error is analyzed, a learning Memory is created. When a prevention mechanism is built, it references both.

```yaml
# Step 1: Error observed
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: error-budget-overrun-2026-02
spec:
  scope: domain
  sourceDomain: product
  sourceAgent: product-analyst
  entryType: error
  content: "Budget overrun detected: product domain consumed 140% of monthly token budget. Root cause: product-analyst agent triggered recursive analysis loop on ambiguous user feedback batch."
  tags: [error, budget-overrun, recursive-loop]
  references:
    - kind: Budget
      name: product-q1-budget
    - kind: Agent
      name: product-analyst
  confidence: 1.0
```

```yaml
# Step 2: Learning derived
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: learning-recursive-loop-prevention
spec:
  scope: organization
  sourceAgent: insight-reporter
  sourceDomain: product
  entryType: learning
  content: "Recursive analysis loops occur when agent receives ambiguous input and re-processes it. Prevention: (1) Set maxIterations constraint on analytical agents. (2) Add input validation for batch size. (3) Set agent tokenBudget.alertAt to 0.5 for early warning."
  tags: [learning, prevention, recursive-loop, budget]
  references:
    - kind: Memory
      name: error-budget-overrun-2026-02
  confidence: 0.88
  supersedes: null
  retention:
    duration: permanent
```

**Compounding effect:** The error memory has value because it identifies the problem. The learning memory compounds that value by adding the solution. Future errors that match the pattern can reference the learning.

### Pattern 4: Cross-Domain Context Propagation

Memory created in one domain becomes relevant to another domain through shared events or workflows.

```yaml
# Created in growth domain
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: user-segment-high-value
spec:
  scope: organization      # Visible to all domains
  sourceAgent: growth-optimizer
  sourceDomain: growth
  entryType: context
  content: "High-value user segment identified: users who complete onboarding within 24h and use 3+ features in first week have 85% 12-month retention. This segment represents 22% of new signups."
  tags: [user-segment, retention, onboarding, cross-domain]
  references:
    - kind: Domain
      name: growth
  confidence: 0.87
```

```yaml
# Referenced by product domain agent
apiVersion: ioa.dev/v0.2
kind: Memory
metadata:
  name: product-onboarding-optimization
spec:
  scope: domain
  sourceAgent: product-analyst
  sourceDomain: product
  entryType: learning
  content: "Based on growth team's high-value user segment data, optimized onboarding flow to surface 3 key features within first session. A/B test shows 15% increase in feature adoption within 24h."
  references:
    - kind: Memory
      name: user-segment-high-value    # Cross-domain reference
    - kind: Domain
      name: product
  confidence: 0.82
```

**Compounding effect:** The growth domain's insight becomes more valuable when the product domain acts on it and validates it with results.

## 4. Retention Policies

| Memory Type | Recommended Retention | Rationale |
|-------------|----------------------|-----------|
| error | 90-180 days | Useful for recent pattern matching, less relevant over time |
| observation | 30-90 days | Operational data, high volume |
| learning | 1 year or permanent | Hard-won knowledge, applies broadly |
| pattern | permanent | Organizational wisdom, highest compound value |
| context | 90-365 days | Situational, may become stale |
| decision | permanent | Institutional memory, always valuable for auditability |

### Auto-Expiration Rules

```yaml
retention:
  duration: "90d"         # Maximum lifetime
  archiveAfter: "60d"     # Move to cold storage after 60 days
  autoExpire: true         # Delete after duration (vs. keep in archive)
```

**Exception:** Memories with `compoundingValue > threshold` should NOT auto-expire even if `autoExpire: true`. A controller should check compoundingValue before expiration.

## 5. Memory Scoping Guide

| Scope | Visibility | Use Case | Example |
|-------|-----------|----------|---------|
| **agent** | Only the creating agent | Private working memory, intermediate results | Agent's analysis cache |
| **domain** | All agents in the domain | Domain-specific knowledge | Product roadmap insights |
| **organization** | All agents in all domains | Cross-domain patterns, institutional knowledge | Best practices, anti-patterns |

### Promotion Path

Memory can be promoted to broader scope:

```
agent-private → domain → organization
```

Promotion happens when an agent-private observation proves valuable to the domain, or a domain-level pattern applies across the organization. Promotion is a manual or controller-driven action (create new Memory with broader scope, reference original).

## 6. Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Store everything** | Memory becomes noise | Use entryType and tags to classify; set retention policies |
| **No references** | Memories are isolated, can't compound | Always add references to related resources |
| **Permanent everything** | Storage grows unbounded | Only patterns and decisions are permanent; observations expire |
| **Agent-private hoarding** | Valuable knowledge stays hidden | Promote insights to domain or organization scope |
| **No confidence scores** | Can't distinguish reliable from unreliable | Always set confidence; update as evidence changes |
