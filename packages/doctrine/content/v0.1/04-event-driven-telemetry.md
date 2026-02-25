# Principle 4: Event-Driven Telemetry

**Statement:** All organizational signals flow as structured events with namespaced types, defined payloads, and explicit metrics impact. Decisions flow from data, not intuition.

## Rationale

In a traditional organization, critical signals are scattered across email threads, dashboard screenshots, verbal updates, and quarterly reports. By the time a signal reaches the decision-maker, it is often stale, stripped of context, or distorted by intermediaries. AI agents make this problem worse if they generate outputs without structured telemetry -- the organization gets more activity but less visibility.

Event-driven telemetry establishes a universal signal layer for the organization. Every meaningful occurrence -- a customer complaint, a deployment failure, a revenue milestone, an agent action -- is emitted as a structured event with a namespaced type (e.g., `domain.customer-support.ticket.escalated`), a defined payload schema, and explicit links to the metrics it affects. Events are the raw material from which dashboards, alerts, decisions, and feedback loops are constructed.

The "event-driven" aspect is deliberate. Events are immutable facts about what happened. They decouple the producer (the domain or agent that emits the event) from the consumer (the dashboard, alert rule, or downstream agent that acts on it). This decoupling enables composability: new consumers can subscribe to existing event streams without modifying producers, and the organization can evolve its telemetry incrementally.

## Guidelines

- Define a standard event envelope: type (namespaced), timestamp, source (domain + agent), payload, and correlation ID.
- Event types follow a hierarchical namespace aligned with domain boundaries (e.g., `sales.pipeline.deal.closed`, `engineering.deploy.completed`).
- Every event type must have a registered schema. Untyped or free-form events are not permitted in production telemetry.
- Link events to the metrics and KPIs they affect. An event without metric relevance should be reconsidered -- it may be noise rather than signal.
- Implement event retention policies. Not all events need to be stored forever; define TTLs based on compliance requirements and analytical value.
- Ensure that agent actions are themselves emitted as events, creating an auditable stream of AI behavior.

## Anti-Patterns

- **Dashboard-driven telemetry**: Building dashboards first and then figuring out what data to collect. Events should be designed from domain semantics, not visualization requirements.
- **Unstructured signals**: Logging free-text messages instead of structured events. "Customer complained about billing" is not telemetry; `billing.complaint.received { customerId, category, severity }` is.
- **Metric islands**: Each domain collecting its own metrics in its own format with no cross-domain correlation capability.
- **Silent agents**: AI agents that take actions without emitting corresponding events. If an agent acts but produces no telemetry, its behavior is invisible to the organization.

## Relationship to Other Principles

Event-Driven Telemetry provides the data substrate for **Decision Architecture** (Principle 3) and **Feedback Loops** (Principle 8). It uses **Domain-First Architecture** (Principle 1) for namespace structure. **Observability First** (Principle 11) builds directly on the event stream. **Governance by Design** (Principle 5) may require specific events for audit and compliance purposes.
