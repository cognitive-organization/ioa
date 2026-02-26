# IOA Threat Model

Version: v0.2
Date: 2026-02-25
Owner: Agent 02 (Security & Trust Governor)

## 1. Scope

This document identifies threats to IOA-managed organizations. It covers each resource kind, common attack vectors for AI-native systems, and recommended mitigations.

IOA is a standard, not a runtime. Threats here apply to any implementation that follows the IOA resource model.

## 2. Trust Model

### Trust Boundaries

```
┌──────────────────────────────────────────────────────────────┐
│  ORGANIZATION BOUNDARY                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  DOMAIN BOUNDARY (e.g., "product")                     │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Agent A  │  │  Agent B  │  │  Data (classified)  │ │ │
│  │  │ (trusted) │  │ (trusted) │  │  internal/confid.   │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          ↕ events (cross-domain)             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  DOMAIN BOUNDARY (e.g., "analytics")                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────┐                            │
│  │  CONTROLLER PLANE            │                            │
│  │  (elevated privileges)       │                            │
│  └──────────────────────────────┘                            │
│                          ↕ API calls                         │
│  ┌──────────────────────────────┐                            │
│  │  EXTERNAL (LLM providers,   │                            │
│  │   APIs, users, attackers)    │                            │
│  └──────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

Trust levels:
1. **Organization boundary** — outermost, all IOA resources live here
2. **Domain boundary** — isolation layer; agents from domain A should not access domain B data without explicit event contracts
3. **Agent scope** — each agent has explicit capabilities, inputs, outputs
4. **External** — untrusted (LLM providers, external APIs, user inputs)

## 3. Threats by Resource Kind

### 3.1 Domain

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Domain boundary violation | Agent accessing data from another domain without event contract | Data leak, governance bypass | Medium | Cross-reference validation (agents must be listed in domain.spec.agents); SecurityPolicy.dataScopes |
| Unauthorized domain modification | Attacker modifying domain spec to change boundaries | Scope expansion, unauthorized data access | Low | Version control, audit trail, human approval for domain changes |
| KPI manipulation | Agent falsifying status.health or KPI metrics | False confidence, wrong decisions | Medium | Independent telemetry verification, multiple controllers |
| Cost hiding | Omitting or underreporting costToDate | Budget overrun | Medium | Budget resource cross-validation, independent cost tracking |

### 3.2 Agent

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Agent impersonation | Unauthorized process acting as a registered agent | Data access, unauthorized actions | High | agentIdentity (SecurityPolicy), certificate/token auth |
| Capability escalation | Agent performing actions outside declared capabilities | Governance bypass | Medium | Strict capability enforcement, audit of actual vs declared actions |
| Prompt injection | External input manipulating agent behavior | Arbitrary actions, data exfiltration | High | promptInjectionDefense in SecurityPolicy, input sanitization, output validation |
| Token budget abuse | Agent consuming tokens beyond allocation | Cost overrun, DoS | Medium | tokenBudget enforcement, Budget resource alerts |
| Model poisoning | Compromised LLM model returning malicious outputs | Wrong decisions, data manipulation | Low | Model versioning (agent.spec.model), output validation, human review for critical decisions |
| Memory exfiltration | Agent leaking persistent memory contents | Data breach | Medium | Memory scope enforcement (agent-private/domain/organization), data classification |

### 3.3 Decision

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Decision tampering | Modifying rationale or chosen option after acceptance | Historical revisionism, accountability loss | Medium | Immutable audit trail, version control, decision.status lifecycle |
| Assumption staleness | Assumptions marked "valid" that are actually invalidated | Wrong decisions persist | High | reviewDate enforcement, automated assumption re-validation |
| Unauthorized reversal | Agent reversing a human-made decision | Governance bypass | Medium | requiresApproval in governance, initiatedBy tracking |

### 3.4 Telemetry

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Event spoofing | Fake telemetry events from unauthorized source | False metrics, wrong alerts | High | Source verification (source.agent + source.domain), correlationId chain |
| PII leakage | Telemetry payloads containing personal data | Privacy violation, compliance breach | High | Data classification on payloads, automatic PII scanning, retention policies |
| Alert suppression | Attacker disabling alerts or modifying thresholds | Threats go undetected | Medium | Audit on alertRule modifications, separation of alert config from runtime |
| Retention violation | Events deleted before retention period | Compliance violation, audit gap | Low | Immutable storage, retention enforcement by controller |

### 3.5 Governance

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Policy bypass | Agent operating outside governance policy | Ungoverned actions | Medium | Controller enforcement, audit level=full for critical domains |
| Escalation path manipulation | Modifying escalation paths to avoid oversight | Human override undermined | Low | Version control on governance policies, change audit |
| Override fatigue | Too many human override requests leading to rubber-stamping | False compliance | Medium | Override rate monitoring (status.overrideFrequency), cognitive load tracking |

### 3.6 Workflow

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Step injection | Adding unauthorized steps to a running workflow | Arbitrary code execution | Medium | Immutable workflow spec during execution, version pinning |
| Compensation abuse | Triggering compensation logic to roll back legitimate work | Service disruption | Low | Compensation requires explicit trigger, audit trail |
| Timeout manipulation | Extending timeouts to keep workflows running indefinitely | Resource exhaustion | Low | Hard timeout limits, controller monitoring |
| Cross-domain privilege escalation | Workflow step in domain A gaining access to domain B data | Data breach | High | SecurityPolicy per domain, cross-domain workflow requires governance approval |

### 3.7 SecurityPolicy (planned)

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Policy weakening | Modifying enforcement from "enforce" to "observe" | Security downgrade | Medium | Audit trail on policy changes, dual-approval for enforcement changes |
| Identity spoofing | Bypassing agentIdentity requirements | Unauthorized access | High | Certificate-based identity, zero-trust with verifyOnEveryCall |

### 3.8 Budget (planned)

| Threat | Vector | Impact | Likelihood | Mitigation |
|--------|--------|--------|------------|------------|
| Budget inflation | Setting artificially high limits to avoid alerts | Unconstrained spending | Low | Budget approval workflow, historical comparison |
| Cost misattribution | Agent costs attributed to wrong domain/agent | Incorrect accountability | Medium | Agent-level token tracking, correlationId per request |

## 4. Cross-Cutting Threats

### 4.1 Prompt Injection (CRITICAL)

The #1 threat to AI-native organizations. Attackers inject instructions via:
- User inputs processed by agents
- Data ingested from external sources
- Cross-agent communication payloads

**Defense layers:**
1. **Input sanitization** — strip known injection patterns (SecurityPolicy.promptInjectionDefense)
2. **Output validation** — verify agent outputs match expected schema (agent.spec.outputs)
3. **Capability enforcement** — agents can only perform declared actions
4. **Human review** — critical decisions require human approval
5. **Monitoring** — telemetry alerts on anomalous agent behavior

### 4.2 Supply Chain (LLM Providers)

Agents depend on external LLM providers. Risks:
- Provider compromise (model weights tampered)
- API key leakage
- Rate limiting / availability
- Provider accessing organization data via prompts

**Mitigations:**
- Model versioning (agent.spec.model with provider, name, version)
- API key rotation policies (SecurityPolicy)
- Fallback providers or graceful degradation
- Data classification to limit what goes to external providers

### 4.3 Controller Privilege Escalation

Controllers with enforcementMode: enforce have elevated privileges. A compromised controller can:
- Block legitimate operations
- Modify resource status
- Suppress alerts

**Mitigations:**
- Least-privilege controller configurations
- Multiple independent controllers (separation of concerns)
- Human override always available (Principle #9)
- Controller actions auditable via telemetry

## 5. STRIDE Analysis Summary

| Category | Top Threats | Primary Resource | Mitigation |
|----------|------------|-----------------|------------|
| **S**poofing | Agent impersonation, event spoofing | Agent, Telemetry | agentIdentity, source verification |
| **T**ampering | Decision tampering, policy weakening | Decision, SecurityPolicy | Immutable audit, version control |
| **R**epudiation | Untracked agent actions | All | Audit trail, telemetry events |
| **I**nformation Disclosure | PII in telemetry, memory exfiltration | Telemetry, Agent | Data classification, retention policies |
| **D**enial of Service | Token budget abuse, timeout manipulation | Agent, Workflow | Budget enforcement, hard timeouts |
| **E**levation of Privilege | Cross-domain escalation, capability escalation | Workflow, Agent | SecurityPolicy, capability enforcement |

## 6. Risk Matrix

| Risk Level | Description | Response |
|------------|------------|----------|
| **Critical** | Prompt injection, cross-domain data breach | Immediate mitigation required. SecurityPolicy with enforce mode. |
| **High** | Agent impersonation, event spoofing, PII leakage | Mitigation in v0.2.1 (SecurityPolicy resource). |
| **Medium** | KPI manipulation, capability escalation, policy bypass | Controller monitoring + alerts. |
| **Low** | Timeout manipulation, budget inflation | Standard governance policies sufficient. |

## 7. Security Checklist for IOA Implementations

- [ ] All agents have declared identity (agentIdentity in SecurityPolicy)
- [ ] All data assets classified (dataScopes with classification levels)
- [ ] Prompt injection defenses enabled for agents processing external input
- [ ] Audit trail enabled with immutable storage
- [ ] Budget limits set with alerts at 70%, 90%, 100%
- [ ] Human override paths tested and documented
- [ ] Cross-domain workflows reviewed for privilege escalation
- [ ] Telemetry events validated for PII before emission
- [ ] Controller actions logged and auditable
- [ ] Decision assumptions have scheduled review dates
- [ ] Governance policies version-controlled with change audit
- [ ] Model versions pinned and tracked (agent.spec.model)
