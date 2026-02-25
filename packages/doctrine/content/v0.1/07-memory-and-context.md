# Principle 7: Memory and Context

**Statement:** Organizational knowledge persists across sessions, agents, and team changes. Context is explicit, versioned, and queryable -- not trapped in individual heads or chat logs.

## Rationale

The most fragile component of any organization is its institutional memory. When a key team member leaves, critical knowledge leaves with them. When a project transitions between teams, context is lost in the handover. When an AI agent starts a new session, it begins with a blank slate unless someone deliberately reconstructed its context. This fragility is not a technical limitation -- it is an architectural failure.

Memory and Context establishes organizational knowledge as a managed, persistent resource. Context is not the incidental byproduct of conversation threads and meeting notes. It is an explicitly designed layer with defined schemas, versioning, retention policies, and query interfaces. When a new agent is deployed in a domain, it should inherit that domain's accumulated context: past decisions, active constraints, historical patterns, and current priorities. When a team member rotates into a new role, the domain's context layer provides the onboarding foundation.

This principle also addresses the temporal dimension of organizational intelligence. Context is not static -- it evolves with every decision, every event, and every feedback cycle. A well-designed memory system captures not just the current state but the trajectory: how did we get here, what did we try, what worked, and what did we learn. Without this temporal depth, organizations are condemned to repeat mistakes that they have already paid the cost of discovering.

## Guidelines

- Define a context schema for each domain that captures: active decisions, current constraints, historical patterns, domain-specific vocabulary, and priority stack.
- Implement context versioning. When context changes, the previous version is preserved with a timestamp and the reason for the change.
- Make context queryable by both humans and agents. A natural language query like "What were the last three decisions in the billing domain?" should return structured results.
- Design agent handoff protocols that transfer relevant context between sessions. An agent resuming work on a task should not need to rediscover context from scratch.
- Separate ephemeral context (session-specific, disposable) from persistent context (domain knowledge, decision history, organizational patterns).
- Establish context hygiene practices: regular review and pruning of stale context, validation of assumed-true assertions, and archival of superseded knowledge.

## Anti-Patterns

- **Chat log memory**: Relying on conversation histories as the primary knowledge store. Chat logs are unstructured, unsearchable, and inaccessible to agents that did not participate in the original conversation.
- **Hero knowledge**: Critical organizational knowledge that exists only in one person's head. When that person is unavailable, the organization's capability degrades.
- **Context amnesia**: AI agents that restart every session without access to prior context, forcing humans to re-explain background, constraints, and priorities repeatedly.
- **Write-only memory**: Documenting everything but organizing nothing. A knowledge base that cannot be efficiently queried is effectively empty.

## Relationship to Other Principles

Memory and Context provides the persistence layer for **Decision Architecture** (Principle 3) -- decisions are a primary form of organizational memory. **Event-Driven Telemetry** (Principle 4) feeds the memory system with structured signals. **Agent Topology** (Principle 2) defines which agents can access which context scopes. **Feedback Loops** (Principle 8) generate learning that must be captured in organizational memory. **Evolutionary Architecture** (Principle 12) depends on historical context to inform architectural changes.
