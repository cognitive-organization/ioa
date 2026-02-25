# Principle 12: Evolutionary Architecture

**Statement:** Organizations evolve. The architecture supports gradual change: adding domains, retiring agents, splitting responsibilities. Versioning is built in at every level.

## Rationale

No organizational design survives contact with reality unchanged. Markets shift, teams grow and shrink, business models pivot, and AI capabilities advance. An architecture that assumes stability is an architecture that will be abandoned the moment it becomes inconvenient -- which, in practice, means within months. Evolutionary Architecture accepts change as a constant and designs for it explicitly.

The key mechanism is versioning. In IOA, every resource type carries an API version (`ioa.dev/v0.1`). Domains, agents, decisions, events, and the doctrine itself are all versioned artifacts. This means that changes can be introduced incrementally without breaking existing components. A domain can be split into two domains while the old definition remains available during the transition. An agent can be upgraded to a new version while the previous version continues to serve as a fallback. A decision can be superseded by a new decision that references its predecessor, preserving the organizational rationale chain.

Evolutionary Architecture also means that the standard itself evolves. Version 0.1 "Foundation" is not the final word -- it is the starting point. Future versions will add new resource types, refine existing schemas, and incorporate lessons learned from real-world adoption. The doctrine is designed to be extended, not enshrined. Organizations that adopt IOA today should expect the framework to grow with them, and the architecture ensures that growth is non-breaking and backward-compatible.

## Guidelines

- Version every resource type using semantic versioning aligned with the IOA API version. Resource definitions include `apiVersion` as a required field.
- Support multiple active versions during transitions. When a domain is restructured or an agent is upgraded, both old and new versions should coexist until the migration is complete.
- Design migration paths for every schema change. Breaking changes must include documented migration guides and tooling support.
- Implement deprecation policies: resources and schema versions that are no longer recommended should be marked deprecated with a sunset date, not removed abruptly.
- Review the organizational architecture quarterly. Use feedback data (Principle 8) and observability insights (Principle 11) to identify domains that need splitting, agents that need retirement, and processes that need restructuring.
- Treat the IOA doctrine itself as a versioned artifact. Organizations can pin to a specific doctrine version while evaluating upgrades, just as they would with any dependency.

## Anti-Patterns

- **Big bang redesigns**: Attempting to restructure the entire organizational architecture at once. Evolutionary change is incremental; revolution is risky and usually unnecessary.
- **Version avoidance**: Deploying resources without version identifiers, making it impossible to manage transitions or maintain backward compatibility.
- **Permanent prototypes**: "Temporary" agents or domain configurations that persist indefinitely because no one designed the transition to the permanent architecture. Every temporary component should have an expiration date and a migration plan.
- **Breaking changes without migration**: Updating schemas or resource definitions in ways that invalidate existing resources without providing migration tooling or documentation.

## Relationship to Other Principles

Evolutionary Architecture depends on **Composability** (Principle 10) -- only composable systems can evolve incrementally. **Memory and Context** (Principle 7) preserves the historical record needed to understand why the architecture evolved. **Feedback Loops** (Principle 8) provide the data that drives evolutionary decisions. **Domain-First Architecture** (Principle 1) provides the unit of evolution: domains are added, split, merged, and retired as the organization changes. **Decision Architecture** (Principle 3) documents the rationale behind each architectural change.
