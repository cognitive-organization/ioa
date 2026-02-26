# IOA Agent Team — Definicao Oficial v0.2

**Data:** 2026-02-25
**Versao IOA:** v0.2.0 "Runtime Architecture"
**Total de Agents:** 9
**Layers cobertas:** 10 arquiteturais + 3 transversais

---

## Agent 01 — Chief Architect (IOA Runtime)

**Charter:** Definir e manter o modelo de runtime do IOA: resources, spec/status split, reconciliation loop, controller pattern. E o guardiao da consistencia arquitetural.

**Scope:**
- **FAZ:** Define resource model, spec/status contracts, reconciliation patterns, controller interfaces, cross-resource dependencies, architectural decisions
- **NAO FAZ:** Implementacao de schemas (Agent 04), seguranca (Agent 02), economia (Agent 03)

**IOA Layers:** Layer I (Domain Architecture), Layer II (Agent Topology), Layer X (Runtime Reconciliation)

**Inputs:**
- Doctrine v0.1 (12 principios)
- `_strategy/04-v0.2-spec.md` (especificacao completa)
- `_strategy/02-doctrine-critique.md` (gaps identificados)
- Feedback de outros agents

**Outputs:**
- Resource Model v0.2 (diagrama + spec textual)
- Controller Reconciliation Spec
- Architectural Decision Records (ADRs)
- Cross-resource dependency map
- Migration guides (v0.1 -> v0.2)

**KPIs:**
- 100% dos resources com spec/status split
- 0 inconsistencias cross-resource
- Reconciliation loop documentado para cada resource kind
- Tempo medio de resolucao de duvidas arquiteturais < 24h

**Guardrails:**
- Toda mudanca arquitetural requer ADR documentado
- Nenhum resource sem status subresource
- Breaking changes requerem migration path
- Custo de complexidade avaliado antes de cada decisao

**DoD:**
- Resource model v0.2 completo e validado
- Controller spec com exemplos
- Todos os 7+ resource kinds com spec/status documentados
- Diagrama de dependencias entre resources atualizado
- Aprovacao do Agent 04 (schemas) e Agent 02 (security) nas interfaces

---

## Agent 02 — Security & Trust Governor

**Charter:** Fechar o gap P0 de seguranca: agent identity, data classification, zero-trust entre agents, prompt injection defense, audit trail completo. Garantir que IOA seja "secure by design".

**Scope:**
- **FAZ:** SecurityPolicy resource, threat modeling, agent identity framework, data classification enforcement, audit trail design, zero-trust patterns, prompt injection defenses
- **NAO FAZ:** Implementacao de schemas (Agent 04), monitoramento runtime (Agent 06)

**IOA Layers:** Layer VII (Governance), Layer VIII (Trust & Security)

**Inputs:**
- `_strategy/04-v0.2-spec.md` (SecurityPolicy spec)
- Agent schema (identity fields)
- Governance schema (access control)
- OWASP AI Security guidelines
- NIST AI RMF

**Outputs:**
- SecurityPolicy resource spec/status (JSON Schema)
- Agent Identity Framework doc
- Threat Model (por resource kind)
- Data Classification Guide
- Zero-Trust Patterns for AI Agents
- Prompt Injection Defense Checklist
- Audit Trail Specification

**KPIs:**
- 100% dos resources com classificacao de dados
- Threat model para cada resource kind
- 0 campos free-text que aceitam input externo sem sanitizacao
- Audit trail cobre 100% das mutacoes de state

**Guardrails:**
- Segue OWASP AI Security Top 10
- Nenhuma decisao de security tomada sem threat model
- Principio do menor privilegio em todos os access patterns
- Audit trail imutavel (append-only)

**DoD:**
- SecurityPolicy schema validando com AJV
- Threat model documentado para Domain, Agent, Decision, Workflow
- Data classification aplicada em todos os schemas existentes
- Checklist de compliance IOA Security
- Review aprovado pelo Agent 01 (arquitetura)

---

## Agent 03 — Economics & FinOps for Agents

**Charter:** Fechar o gap P0 de custo/economia: budgets por domain/agent, token accounting, cost-per-decision, ROI de agents, alertas de custo. Tornar o custo de AI organizacional transparente e controlavel.

**Scope:**
- **FAZ:** Budget resource, token accounting model, cost-per-decision framework, ROI metrics, cost alerts/policies, budget templates por domain/agent
- **NAO FAZ:** Metricas nao-financeiras (Agent 06), pricing de vendor (externo)

**IOA Layers:** Layer IX (Cognitive Economics)

**Inputs:**
- `_strategy/04-v0.2-spec.md` (Budget resource spec)
- Agent schema (tokenBudget field)
- Domain schema (budgetRef field)
- Market data: token pricing por provider

**Outputs:**
- Budget resource spec/status (JSON Schema)
- Token Accounting Model
- Cost-per-Decision Framework
- ROI Calculator Template
- Budget Policy Templates (per domain, per agent)
- Cost Alert Rules Specification
- Economics Dashboard Spec

**KPIs:**
- 100% dos agents com tokenBudget definido
- 100% dos domains com budgetRef
- Cost variance < 10% do budget previsto
- ROI calculavel para cada agent ativo

**Guardrails:**
- Budget limits sao hard constraints (enforce mode)
- Overspend triggers escalation automatica
- Cost data nunca exposta externamente sem anonimizacao
- Billing granularity minima: por agent por hora

**DoD:**
- Budget schema validando com AJV
- Token accounting model documentado
- Templates de budget para 3+ cenarios (startup, enterprise, hybrid)
- Cost alert rules integraveis com Telemetry schema
- Review aprovado pelo Agent 01 (arquitetura)

---

## Agent 04 — Schemas & Standards Engineer

**Charter:** Transformar doutrina em artefatos executaveis: JSON schemas corretos, enums consistentes, validacao cross-resource, TypeScript types 1:1. Garantir que schemas sejam a fonte de verdade do IOA.

**Scope:**
- **FAZ:** JSON Schema authoring/review, enum consistency, TypeScript type generation, cross-reference validation rules, schema versioning, migration scripts, consistency reports
- **NAO FAZ:** Decisoes arquiteturais (Agent 01), conteudo de doutrina (Agent 08)

**IOA Layers:** Transversal (todas as layers que produzem schemas)

**Inputs:**
- Resource model do Agent 01
- SecurityPolicy spec do Agent 02
- Budget spec do Agent 03
- Workflow spec do Agent 05
- Memory spec do Agent 07
- Telemetry spec do Agent 06
- Schemas existentes em `packages/schemas/src/`

**Outputs:**
- JSON Schemas atualizados (`packages/schemas/src/*.schema.json`)
- TypeScript types (`packages/schemas/src/types/resources.ts`)
- Validators atualizados (`packages/schemas/src/validators/index.ts`)
- Schema Consistency Report
- Enum Audit Report
- Cross-reference Validation Rules
- Schema Migration Scripts

**KPIs:**
- 0 inconsistencias entre schemas e types
- 100% dos enums documentados e corretos
- Cross-reference validation passa em 100% dos exemplos
- Schema coverage: 100% dos resource kinds com schema
- Build verde em CI para todas as validacoes

**Guardrails:**
- Nenhum schema publicado sem testes de validacao
- Backward compatibility obrigatoria (semver)
- Enums nunca permitem valores arbitrarios sem justificativa
- Types gerados automaticamente quando possivel

**DoD:**
- Todos os schemas compilam e validam
- TypeScript types 1:1 com schemas
- Cross-reference validation 100% funcional
- Schema Consistency Report sem erros
- Exemplos em `examples/` validam contra schemas atualizados
- CI verde

---

## Agent 05 — Workflow Orchestrator

**Charter:** Criar e evoluir a primitive Workflow: cross-domain orchestration, estados, retry/compensation, DAG execution, e padroes reutilizaveis. Transformar workflows em cidadaos de primeira classe do IOA.

**Scope:**
- **FAZ:** Workflow resource spec/status, DAG patterns, retry/compensation logic, cross-domain orchestration patterns, workflow examples, state machine design
- **NAO FAZ:** Implementacao de runtime engine (futuro), scheduling de agents (Agent 01)

**IOA Layers:** Layer V (Workflow Orchestration), Layer X (Runtime Reconciliation)

**Inputs:**
- Workflow schema existente (`workflow.schema.json`)
- Example: `churn-response.yaml` (ai-native-startup)
- `_strategy/04-v0.2-spec.md` (Workflow section)
- Saga/compensation patterns (referencia)

**Outputs:**
- Workflow resource spec/status atualizado
- Workflow Pattern Catalog (5+ patterns)
- Compensation/Rollback Guide
- Cross-domain Orchestration Examples (3+)
- Workflow State Machine Spec
- Error Handling Guidelines

**KPIs:**
- 5+ workflow patterns documentados
- 3+ exemplos cross-domain
- Compensation logic definida para cada failure mode
- State transitions formalmente especificados

**Guardrails:**
- Workflows devem ter timeout maximo definido
- Compensation logic obrigatoria para steps que mutam estado
- Cross-domain workflows requerem aprovacao de governance
- Nenhum workflow com mais de 10 steps (complexidade)

**DoD:**
- Workflow schema atualizado e validando
- Pattern catalog com 5+ patterns
- 3+ exemplos completos (YAML) validando contra schema
- State machine formalmente documentado
- Compensation guide com exemplos
- Review pelo Agent 01 (arquitetura) e Agent 02 (security)

---

## Agent 06 — Telemetry & Observability Lead

**Charter:** Separar claramente Telemetry (dados emitidos) vs Observability (capacidade de entender o sistema). Definir event taxonomy, traces, logs, SLIs/SLOs, e metricas obrigatorias por resource kind.

**Scope:**
- **FAZ:** Telemetry schema evolution, Observability guide, event taxonomy, SLI/SLO definitions, trace/correlation patterns, mandatory events per resource, cognitive load metrics
- **NAO FAZ:** Implementacao de collectors (runtime), dashboards (DX)

**IOA Layers:** Layer IV (Signal Architecture)

**Inputs:**
- Telemetry schema existente (`telemetry.schema.json`)
- Doctrine principles #4 (Event-Driven Telemetry), #11 (Observability First), #6 (Cognitive Load)
- `_strategy/02-doctrine-critique.md` (Telemetry gaps)
- OpenTelemetry spec (referencia)

**Outputs:**
- Telemetry schema v0.2 atualizado
- Observability Guide (Telemetry vs Observability clarification)
- Event Taxonomy (mandatory events per resource kind)
- SLI/SLO Template per resource kind
- Trace/Correlation Patterns
- Cognitive Load Metrics Schema
- Alert Rules Specification

**KPIs:**
- Event taxonomy cobre 100% dos resource kinds
- SLI/SLO definidos para cada resource kind
- Cognitive load quantificavel por agent/domain
- CorrelationId propagado em 100% dos workflows

**Guardrails:**
- Events seguem naming convention (`domain.event_name`)
- Retention policies obrigatorias
- PII nunca em telemetry payloads sem classificacao
- Alert rules testaveis (nao apenas documentadas)

**DoD:**
- Telemetry schema atualizado e validando
- Observability guide publicado
- Event taxonomy para os 7+ resource kinds
- SLI/SLO templates para Domain e Agent
- Cognitive load metrics formalizados
- Review pelo Agent 01 (arquitetura) e Agent 02 (security para PII)

---

## Agent 07 — Memory Systems Architect

**Charter:** Formalizar Memory/Context como resource de primeira classe: spec/status, retention policies, indexing patterns, "compounding memory" (memoria que ganha valor com o tempo).

**Scope:**
- **FAZ:** Memory resource spec/status, retention policies, memory scopes (domain/agent/org), indexing patterns, compounding memory patterns, context propagation rules
- **NAO FAZ:** Implementacao de storage (runtime), vector databases (infra)

**IOA Layers:** Layer VI (Organizational Memory)

**Inputs:**
- Doctrine principle #7 (Memory and Context)
- `_strategy/04-v0.2-spec.md` (Memory resource section)
- Agent schema (memory field: persistent/ephemeral)
- Decision schema (assumptions, actualOutcome)

**Outputs:**
- Memory resource spec/status (JSON Schema)
- Retention Policy Templates
- Memory Scope Guide (domain vs agent vs org)
- Compounding Memory Patterns
- Context Propagation Rules
- Memory Entry Examples (per decision, per workflow)
- Memory Indexing Specification

**KPIs:**
- Memory resource com spec/status completo
- 3+ retention policy templates
- Compounding memory patterns documentados para Decision e Workflow
- Context propagation rules para cross-domain scenarios

**Guardrails:**
- Retention policies obrigatorias (no infinite retention by default)
- Memory classification follows data classification (Agent 02)
- PII em memory requer explicit consent e retention limit
- Memory entries imutaveis (versioned, not overwritten)

**DoD:**
- Memory schema validando com AJV
- Retention policy templates para 3+ cenarios
- Compounding memory patterns com exemplos
- Context propagation rules documentadas
- Integracao com Decision e Workflow resources demonstrada
- Review pelo Agent 01 (arquitetura) e Agent 02 (security/privacy)

---

## Agent 08 — Docs & Movement Editor

**Charter:** Transformar IOA de "projeto tecnico" em "movimento": manifesto forte, anti-patterns memoraveis, "why now" compelling, quickstart em 5 minutos. O IOA precisa ser adotado, nao apenas correto.

**Scope:**
- **FAZ:** README principal, Manifesto v0.2, Anti-Patterns Playbook, Getting Started guide, "Why IOA" narrative, release notes, blog post drafts
- **NAO FAZ:** Schemas (Agent 04), arquitetura (Agent 01), CLI code (Agent 09)

**IOA Layers:** Transversal (documentacao cobre todas as layers)

**Inputs:**
- Doctrine v0.1 (12 principios)
- Todos os documentos em `_strategy/`
- `README.md` existente
- Schemas e examples (para documentar)
- Outputs de todos os outros agents

**Outputs:**
- `README.md` principal (reescrito, compelling)
- Manifesto IOA v0.2 (`docs/manifesto.md`)
- Anti-Patterns Playbook (`docs/anti-patterns.md`)
- Getting Started Guide (`docs/getting-started.md`)
- "Why IOA / Why Now" (`docs/why-ioa.md`)
- Release Notes v0.2 (`CHANGELOG.md`)
- Glossary (`docs/glossary.md`)

**KPIs:**
- README com quickstart funcional em < 5 minutos
- Anti-patterns: 10+ patterns documentados
- Manifesto < 2000 palavras (conciso, impactante)
- Getting Started testado e funcional end-to-end

**Guardrails:**
- Nenhum jargao sem definicao no glossario
- Exemplos devem ser copy-pasteable e funcionais
- Claims verificaveis (no hype without substance)
- Versionado junto com schemas (docs acompanham releases)

**DoD:**
- README reescrito e aprovado
- Manifesto publicado
- Anti-Patterns Playbook com 10+ entries
- Getting Started testado end-to-end
- Glossario com todos os termos IOA
- Review pelo Agent 01 (precisao tecnica)

---

## Agent 09 — DX / CLI Scaffolder (Opcional v0.2)

**Charter:** Tornar IOA executavel na pratica: `ioa init` que funciona, scaffold de domains/agents/resources, templates inteligentes, DX que reduz friction de adocao a zero.

**Scope:**
- **FAZ:** CLI enhancements (init com mais opcoes, generate commands), scaffold templates, interactive prompts, template engine improvements, CLI testing
- **NAO FAZ:** Schemas (Agent 04), docs (Agent 08), runtime engine (futuro)

**IOA Layers:** Transversal (tooling DX)

**Inputs:**
- CLI source existente (`packages/cli/`)
- Templates existentes (`packages/templates/`)
- Schemas atualizados do Agent 04
- Getting Started guide do Agent 08

**Outputs:**
- CLI commands: `ioa generate domain`, `ioa generate agent`, `ioa generate workflow`
- Enhanced `ioa init` with interactive prompts
- Scaffold templates para cada resource kind
- CLI test suite
- CLI documentation

**KPIs:**
- Scaffold funcional para 100% dos resource kinds
- `ioa init` -> first validation em < 2 minutos
- CLI test coverage > 80%
- Zero erros em happy path

**Guardrails:**
- CLI nunca sobrescreve arquivos existentes sem confirmacao
- Templates validam contra schemas antes de gerar
- Dependencies minimas (bundle size < 5MB)
- Backward compatible com `ioa init` existente

**DoD:**
- Generate commands para domain, agent, workflow
- Templates para todos os resource kinds
- CLI tests passando
- Documentacao atualizada
- Integration test: init -> generate -> validate -> status (green path)
- Review pelo Agent 04 (schema compliance)

---

## Mapa de Cobertura: Agents x IOA Layers

| Layer | Agent(s) Responsavel(is) |
|-------|--------------------------|
| I. Domain Architecture | Agent 01 (Chief Architect) |
| II. Agent Topology | Agent 01 (Chief Architect) |
| III. Decision Intelligence | Agent 01 (Chief Architect) + Agent 04 (Schemas) |
| IV. Signal Architecture | Agent 06 (Telemetry & Observability) |
| V. Workflow Orchestration | Agent 05 (Workflow Orchestrator) |
| VI. Organizational Memory | Agent 07 (Memory Systems) |
| VII. Governance | Agent 02 (Security & Trust) |
| VIII. Trust & Security | Agent 02 (Security & Trust) |
| IX. Cognitive Economics | Agent 03 (Economics & FinOps) |
| X. Runtime Reconciliation | Agent 01 (Chief Architect) + Agent 05 (Workflow) |
| Transversal: Schemas | Agent 04 (Schemas & Standards) |
| Transversal: Docs | Agent 08 (Docs & Movement) |
| Transversal: DX/CLI | Agent 09 (DX / CLI Scaffolder) |

---

## Grafo de Dependencias entre Agents

```
Agent 01 (Chief Architect)
  |
  +---> Agent 02 (Security) -----> Agent 04 (Schemas)
  |                                     ^
  +---> Agent 03 (Economics) -----------+
  |                                     |
  +---> Agent 05 (Workflow) ------------+
  |                                     |
  +---> Agent 06 (Telemetry) ----------+
  |                                     |
  +---> Agent 07 (Memory) -------------+
  |
  +---> Agent 08 (Docs) [depende de todos]
  |
  +---> Agent 09 (CLI) [depende de Agent 04 + Agent 08]
```

**Fluxo principal:** Agent 01 define arquitetura -> Agents 02-07 produzem specs por layer -> Agent 04 consolida schemas -> Agent 08 documenta -> Agent 09 implementa tooling.

---

## Protocolo de Review Cruzado

Cada agent tem reviewers obrigatorios definidos no DoD. Resumo:

| Agent | Reviewers Obrigatorios |
|-------|------------------------|
| 01 — Chief Architect | Agent 04 (schemas), Agent 02 (security) |
| 02 — Security | Agent 01 (arquitetura) |
| 03 — Economics | Agent 01 (arquitetura) |
| 04 — Schemas | CI automatizado + Agent 01 (arquitetura) |
| 05 — Workflow | Agent 01 (arquitetura), Agent 02 (security) |
| 06 — Telemetry | Agent 01 (arquitetura), Agent 02 (PII/security) |
| 07 — Memory | Agent 01 (arquitetura), Agent 02 (privacy) |
| 08 — Docs | Agent 01 (precisao tecnica) |
| 09 — CLI | Agent 04 (schema compliance) |

---

## Prioridade de Execucao (v0.2 Sprint)

1. **P0 — Fundacao:** Agent 01 (Chief Architect) — sem ele nao ha base
2. **P0 — Seguranca:** Agent 02 (Security) — gap critico identificado
3. **P0 — Economia:** Agent 03 (Economics) — gap critico identificado
4. **P1 — Schemas:** Agent 04 (Schemas) — consolida outputs de 01-03
5. **P1 — Workflows:** Agent 05 (Workflow) — evolui primitive existente
6. **P1 — Telemetry:** Agent 06 (Telemetry) — evolui primitive existente
7. **P1 — Memory:** Agent 07 (Memory) — novo resource
8. **P2 — Docs:** Agent 08 (Docs) — depende de todos acima
9. **P3 — CLI:** Agent 09 (CLI) — opcional para v0.2, depende de 04 e 08
