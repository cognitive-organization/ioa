# IOA Anti-Patterns Playbook

Version: v0.2
Date: 2026-02-25

A catalog of common mistakes in AI-native organizational design and what to do instead.

---

## 1. The Agent Spaghetti

**What it looks like:** Agents talk to agents talk to agents with no domain boundaries. Data flows everywhere. No one knows which agent does what.

**Why it happens:** Teams add agents bottom-up without defining domains first. Each team creates agents for their own needs. No one draws boundaries.

**The damage:** Impossible to debug, impossible to audit, impossible to budget. When something goes wrong, you can't trace the cause.

**Instead, do:** Define domains first (Principle #1). Every agent is bound to exactly one domain. Cross-domain communication happens only through explicit event contracts. Use `ioa validate` to verify all agents reference valid domains.

---

## 2. The Invisible Agent

**What it looks like:** An AI agent is running in production, making decisions, consuming tokens — but it's not declared anywhere. No one knows its capabilities, constraints, or cost.

**Why it happens:** Someone deployed a "quick prototype" that became permanent. Or the agent was added to a cron job without registering it in the IOA model.

**The damage:** Ungoverned intelligence. No audit trail. No budget tracking. When the agent does something unexpected, there's no governance to catch it.

**Instead, do:** Every agent MUST be an IOA Agent resource with type, role, domain, capabilities, governance, and tokenBudget declared. No exceptions. Use `ioa status` to verify all agents are registered.

---

## 3. The Decision Black Hole

**What it looks like:** Decisions are made in Slack threads, meetings, or agent conversations — but never recorded. Six months later, no one remembers why the architecture looks this way.

**Why it happens:** Recording decisions feels like bureaucracy. The team "moves fast" and skips documentation.

**The damage:** Decisions are re-litigated endlessly. Assumptions go untested. When a decision turns out wrong, there's no data to learn from.

**Instead, do:** Create a Decision resource for every significant choice. Include options evaluated, rationale, assumptions with testable statements, and a reviewDate. The 10 minutes to record a decision saves 10 hours of re-discussion.

---

## 4. The Omniscient Agent

**What it looks like:** One agent has access to everything — all domains, all data, all capabilities. It's the "super agent" that can do anything.

**Why it happens:** It's easier to give one agent full access than to design proper scopes. Early prototypes often start this way.

**The damage:** Single point of failure. Security nightmare. If compromised (or hallucinating), the blast radius is the entire organization. Violates least-privilege principle.

**Instead, do:** Follow Agent Topology (Principle #2). Each agent has a bounded purpose, serves one domain, and declares explicit capabilities. Use SecurityPolicy.dataScopes to enforce access boundaries.

---

## 5. The Budget Ostrich

**What it looks like:** No one tracks how much AI costs. Agents run without token budgets. The bill arrives at month-end and surprises everyone.

**Why it happens:** "We'll worry about costs later." Token pricing feels negligible at small scale. No one wants to add the overhead of budget tracking.

**The damage:** $50/day becomes $1,500/month becomes "why is our AI bill $18K?" Costs grow linearly with agent count but awareness doesn't.

**Instead, do:** Set a Budget resource for every domain. Use three-tier alerts (70%, 90%, 100%). Track cost-per-decision in Decision.status.executionCost. Know your numbers.

---

## 6. The Fire-and-Forget Workflow

**What it looks like:** A multi-step workflow has no compensation logic. When step 3 fails, steps 1 and 2 have already mutated state. The system is left in an inconsistent state.

**Why it happens:** Compensation logic is hard to design. The team assumes failures won't happen (they will).

**The damage:** Partial operations, orphaned resources, data inconsistency. Manual cleanup required.

**Instead, do:** Use the Saga pattern (Pattern #3 in the catalog). Every step that mutates state MUST have a compensating action. Test the failure path as rigorously as the success path.

---

## 7. The Telemetry Desert

**What it looks like:** Agents run, workflows execute, decisions are made — but no telemetry events are emitted. The organization is operationally blind.

**Why it happens:** Telemetry feels like logging — nice to have, not essential. Teams ship features and skip instrumentation.

**The damage:** Can't detect failures until users complain. Can't measure KPI impact. Can't prove compliance. Can't improve what you can't measure.

**Instead, do:** Implement the 39 mandatory events from the Event Taxonomy. Every agent start/stop, every workflow step, every decision lifecycle change. Use correlationId to trace chains.

---

## 8. The Human Override Theater

**What it looks like:** The system has a "human override" button, but it's never tested. Or it exists in policy but not in code. Or the override notification goes to a Slack channel no one monitors.

**Why it happens:** Human Override (Principle #9) is easy to declare, hard to implement. Teams check the box without building the capability.

**The damage:** When you actually need to override an agent — in a crisis — the mechanism doesn't work. The whole point of human override is to work when everything else is failing.

**Instead, do:** Test override paths monthly. Use Governance.spec.humanOverride with real channels and maxResponseTime. Monitor governance.status.overrideFrequency. If it's always zero, either you never need it (unlikely) or it's not working.

---

## 9. The Stale Decision

**What it looks like:** A Decision resource was created 6 months ago with assumptions. The assumptions have been invalidated by reality, but the decision is still "active." No one has reviewed it.

**Why it happens:** Decisions don't have reviewDate set, or the review process isn't automated.

**The damage:** The organization operates on outdated assumptions. The longer a stale decision persists, the more downstream decisions build on its flawed foundation.

**Instead, do:** Always set Decision.spec.reviewDate. Use controller events (decision_review_due) to trigger automatic reviews. Track assumption status (valid/invalidated/untested) and act on changes.

---

## 10. The Security Afterthought

**What it looks like:** The organization has agents processing confidential data, but there's no SecurityPolicy. Data classification doesn't exist. Prompt injection defense is "we'll handle it when it happens."

**Why it happens:** Security is seen as a Phase 2 concern. The team focuses on functionality first.

**The damage:** Prompt injection is the #1 attack vector for AI-native organizations. Without defenses, a single malicious input can make an agent exfiltrate data, bypass governance, or make unauthorized decisions.

**Instead, do:** Create SecurityPolicy as part of domain setup — not after. Classify all data assets. Enable promptInjectionDefense. Set enforcementMode to at least "warn." Security is not a feature; it's a foundation.

---

## 11. The Monolith Workflow

**What it looks like:** A single workflow with 15+ steps, spanning 4 domains, with complex branching logic. It takes 2 hours to run and is impossible to debug.

**Why it happens:** Organic growth. Started as 3 steps, grew to 15 as edge cases were added.

**The damage:** Cognitive overload for operators. Timeout issues. When one step fails, the entire workflow fails. Compensation logic becomes intractable.

**Instead, do:** Maximum 10 steps per workflow. Split large workflows into sub-workflows that communicate via events. Use the Event-Driven Chain pattern for long-running processes.

---

## 12. The Vanity Dashboard

**What it looks like:** A beautiful dashboard with charts and graphs — but it shows vanity metrics. "Number of agent invocations" instead of "decisions impacted." "Total tokens consumed" instead of "ROI per agent."

**Why it happens:** It's easier to measure activity than outcomes. Activity metrics are available immediately; outcome metrics require linking telemetry to KPIs.

**The damage:** False confidence. The dashboard shows everything is green while the organization is making expensive wrong decisions.

**Instead, do:** Dashboard should answer: "Are KPIs being met?" (Domain.status), "Are we within budget?" (Budget.status), "Is the system healthy?" (conditions), "Are decisions working?" (Decision.status.actualOutcome). Activity metrics are secondary.

---

## Quick Reference

| # | Anti-Pattern | Principle Violated | IOA Fix |
|---|-------------|-------------------|---------|
| 1 | Agent Spaghetti | P1: Domain-First | Domain boundaries + event contracts |
| 2 | Invisible Agent | P2: Agent Topology | Agent resource declaration |
| 3 | Decision Black Hole | P3: Decision Architecture | Decision resources with lifecycle |
| 4 | Omniscient Agent | P5: Governance, P9: Human Override | SecurityPolicy + capability scoping |
| 5 | Budget Ostrich | P9: Cognitive Economics* | Budget resource + alerts |
| 6 | Fire-and-Forget | P8: Feedback Loops | Saga pattern + compensation |
| 7 | Telemetry Desert | P4: Telemetry, P11: Observability | 39 mandatory events |
| 8 | Override Theater | P9: Human Override | Tested override paths |
| 9 | Stale Decision | P3: Decision Architecture | reviewDate + assumption tracking |
| 10 | Security Afterthought | P5: Governance | SecurityPolicy first |
| 11 | Monolith Workflow | P10: Composability | Max 10 steps, sub-workflows |
| 12 | Vanity Dashboard | P11: Observability | KPI-driven dashboards |

*P9 in v0.2 maps to Layer IX: Cognitive Economics
