# IOA Backlog — v0.2 Runtime Architecture

**Data:** 2026-02-25
**Projeto:** IOA (Applied Organizational Intelligence)
**Versão atual:** v0.2.0 "Runtime Architecture"
**Repo:** github.com/cognitive-organization/ioa

---

## Épicos

| Épico | Nome | Prioridade | Sprint Alvo |
|-------|------|------------|-------------|
| EPIC-A | IOA Runtime Core | P0 | Sprint 1-2 |
| EPIC-B | Security & Trust | P0 | Sprint 1-2 |
| EPIC-C | Economics & Cost | P0 | Sprint 2-3 |
| EPIC-D | Workflow Orchestration | P0 | Sprint 2-3 |
| EPIC-E | Decision Schema Fix | P0 | Sprint 1 |
| EPIC-F | Memory Resource | P1 | Sprint 3-4 |
| EPIC-G | Telemetry vs Observability | P1 | Sprint 3-4 |
| EPIC-H | Cognitive Load Metrics | P1 | Sprint 4 |
| EPIC-I | Docs / Movement / Quickstart | P1 | Sprint 2-4 |
| EPIC-J | CLI Enhancements (Opcional) | P2 | Sprint 4+ |

---

## Grafo de Dependências

```
EPIC-A (Runtime Core) → EPIC-B, EPIC-C, EPIC-D, EPIC-E
EPIC-E (Decision Fix) → independente, pode iniciar Sprint 1
EPIC-B (Security) → depende de EPIC-A para resource model
EPIC-C (Economics) → depende de EPIC-A para resource model
EPIC-D (Workflow) → depende de EPIC-A, parcialmente de EPIC-B
EPIC-F (Memory) → depende de EPIC-A, EPIC-B (classificação de dados)
EPIC-G (Telemetry) → depende de EPIC-A
EPIC-H (Cognitive Load) → depende de EPIC-G
EPIC-I (Docs) → roda em paralelo, consome todos os outros EPICs
EPIC-J (CLI) → depende de EPIC-A, EPIC-E
```

```
        ┌──────────┐
        │  EPIC-A   │ Runtime Core
        └────┬─────┘
             │
     ┌───────┼────────┬──────────┐
     ▼       ▼        ▼          ▼
  EPIC-B  EPIC-C   EPIC-D     EPIC-J
  Security Economics Workflow   CLI
     │                │
     ▼                │
  EPIC-F ◄────────────┘
  Memory
             │
     ┌───────┘
     ▼
  EPIC-G ──► EPIC-H
  Telemetry   Cognitive Load

  EPIC-E (Decision Fix) → independente
  EPIC-I (Docs) → paralelo a todos
```

---

## Issues

---

### EPIC-A: IOA Runtime Core

---

#### IOA-001: Definir Resource Model v0.2 Completo

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-A — IOA Runtime Core |
| **Sprint** | 1 |
| **Story Points** | 8 |
| **Owner Agent** | Agent 01 (Chief Architect) |

**Objetivo:**
Consolidar o resource model com todos os resource kinds (Domain, Agent, Decision, Telemetry, Governance, Workflow, Config, SecurityPolicy, Budget, Memory, Controller). Documentar spec/status para cada um. Este é o artefato fundacional que desbloqueia todos os outros épicos.

**Artefatos a Produzir:**
- `docs/resource-model.md`
- `docs/diagrams/resource-dependencies.md`

**Critérios de Aceitação:**
- [ ] Todos os 11 resource kinds documentados com descrição, propósito e exemplos
- [ ] Spec/status split definido formalmente para cada resource kind
- [ ] Dependency map completo entre resources (quem referencia quem)
- [ ] Aprovado por Agent 02 (Security) e Agent 04 (Schemas)
- [ ] Nenhum resource kind sem pelo menos 1 exemplo YAML

**Riscos / Dependências:**
- Scope creep se novos resources surgirem durante a definição
- Nenhuma dependência — este é o ponto de partida

---

#### IOA-002: Especificar Controller Reconciliation Pattern

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-A — IOA Runtime Core |
| **Sprint** | 2 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 01 (Chief Architect) |

**Objetivo:**
Definir o pattern de reconciliation loop (Watch -> Diff -> Plan -> Act -> Report) como spec implementável. Incluir interface de controller, lifecycle hooks e error handling. Este pattern é o coração do runtime IOA.

**Artefatos a Produzir:**
- `docs/controller-spec.md`
- `packages/schemas/src/controller.schema.json` (draft)

**Critérios de Aceitação:**
- [ ] Controller interface definida com tipos claros
- [ ] Lifecycle hooks documentados (onCreate, onUpdate, onDelete, onReconcile)
- [ ] Error handling patterns com retry e backoff
- [ ] 1+ exemplo completo de reconciliation loop

**Riscos / Dependências:**
- Complexidade alta — pode precisar de simplificação para v0.2
- Depende de IOA-001 (resource model definido)

---

### EPIC-B: Security & Trust

---

#### IOA-003: Criar SecurityPolicy Resource Schema

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-B — Security & Trust |
| **Sprint** | 2 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 02 (Security & Trust Governor) + Agent 04 (Schemas) |

**Objetivo:**
Implementar o schema SecurityPolicy com spec/status, cobrindo agent identity, data scopes, zero-trust rules e audit configuration. Este resource é pré-requisito para qualquer deployment de produção.

**Artefatos a Produzir:**
- `packages/schemas/src/security-policy.schema.json`
- `packages/schemas/src/types/resources.ts` (update)
- `examples/ai-native-startup/.ioa/security/default-security.yaml`

**Critérios de Aceitação:**
- [ ] Schema valida com AJV sem erros
- [ ] TypeScript types atualizados e 1:1 com o schema
- [ ] Exemplo funcional no ai-native-startup
- [ ] Cross-ref validation com agent.schema.json (agentRef, permissões)
- [ ] Documentação inline no schema (descriptions em todos os campos)

**Riscos / Dependências:**
- Over-engineering security constraints para um standard que ainda está evoluindo
- Depende de IOA-001 (resource model consolidado)

---

#### IOA-004: Threat Model por Resource Kind

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-B — Security & Trust |
| **Sprint** | 2 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 02 (Security & Trust Governor) |

**Objetivo:**
Documentar threat model para cada resource kind existente: attack vectors, mitigation strategies e trust boundaries. Garantir que o standard IOA tem consciência de segurança desde o design.

**Artefatos a Produzir:**
- `docs/security/threat-model.md`

**Critérios de Aceitação:**
- [ ] Threat model para os 7 resource kinds existentes (Domain, Agent, Decision, Telemetry, Governance, Workflow, Config)
- [ ] Mitigations mapeadas para cada threat
- [ ] Trust boundaries definidas entre resources, agents e domínios

**Riscos / Dependências:**
- Precisa de expertise em AI security (prompt injection, data poisoning, privilege escalation)
- Depende parcialmente de IOA-001

---

### EPIC-C: Economics & Cost

---

#### IOA-005: Criar Budget Resource Schema

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-C — Economics & Cost |
| **Sprint** | 2 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 03 (Economics & FinOps) + Agent 04 (Schemas) |

**Objetivo:**
Implementar o schema Budget com spec/status: limites por domain/agent, token accounting, alertas e enforcement mode. Sem controle de custos, organizações AI-native ficam vulneráveis a gastos descontrolados.

**Artefatos a Produzir:**
- `packages/schemas/src/budget.schema.json`
- `packages/schemas/src/types/resources.ts` (update)
- `examples/ai-native-startup/.ioa/budgets/product-budget.yaml`

**Critérios de Aceitação:**
- [ ] Schema valida com AJV sem erros
- [ ] Types atualizados e sincronizados com o schema
- [ ] Exemplo funcional com budget por domain
- [ ] budgetRef funciona em domain e agent schemas (cross-reference)

**Riscos / Dependências:**
- Modelos de pricing de LLMs mudam rápido — precisa ser vendor-agnostic
- Depende de IOA-001 (resource model)

---

#### IOA-006: Token Accounting Model & Cost Templates

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-C — Economics & Cost |
| **Sprint** | 3 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 03 (Economics & FinOps) |

**Objetivo:**
Definir como contabilizar tokens consumidos por agent/domain/workflow. Criar templates de budget para diferentes cenários (startup, enterprise, cost-conscious). Estabelecer framework de ROI para decisões AI.

**Artefatos a Produzir:**
- `docs/economics/token-accounting.md`
- `templates/budget-startup.yaml`
- `templates/budget-enterprise.yaml`

**Critérios de Aceitação:**
- [ ] Modelo de accounting definido com unidades claras
- [ ] 3+ templates de budget para cenários distintos
- [ ] Cost-per-decision calculável a partir dos dados do modelo
- [ ] ROI framework documentado com exemplos numéricos

**Riscos / Dependências:**
- Abstração correta entre vendor-specific e standard é crítica
- Depende de IOA-005 (Budget schema implementado)

---

### EPIC-D: Workflow Orchestration

---

#### IOA-007: Workflow Pattern Catalog

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-D — Workflow Orchestration |
| **Sprint** | 2 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 05 (Workflow Orchestrator) |

**Objetivo:**
Documentar 5+ patterns de workflow reutilizáveis: sequential, fan-out/fan-in, saga, event-driven e approval-gate. Cada pattern com descrição, quando usar, state transitions e exemplos YAML validáveis.

**Artefatos a Produzir:**
- `docs/workflows/pattern-catalog.md`
- `examples/` (3+ workflow YAMLs adicionais)

**Critérios de Aceitação:**
- [ ] 5+ patterns documentados com diagramas de estado
- [ ] 3+ exemplos YAML que validam contra workflow.schema.json
- [ ] State transitions formais para cada pattern
- [ ] Compensation logic (rollback) documentada para cada pattern
- [ ] Quando usar / quando não usar para cada pattern

**Riscos / Dependências:**
- Patterns podem ser abstratos demais sem runtime concreto
- Depende de IOA-001 (resource model) e parcialmente de IOA-003 (security para approval-gate)

---

#### IOA-008: Workflow State Machine & Error Handling

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-D — Workflow Orchestration |
| **Sprint** | 3 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 05 (Workflow Orchestrator) |

**Objetivo:**
Formalizar o state machine de workflows (pending -> running -> completed/failed/compensating) e definir error handling patterns. Sem isto, workflows falham silenciosamente.

**Artefatos a Produzir:**
- `docs/workflows/state-machine.md`
- `docs/workflows/error-handling.md`

**Critérios de Aceitação:**
- [ ] State machine formal com todas as transições válidas
- [ ] Error categories definidas (transient, permanent, partial)
- [ ] Retry policies documentadas (exponential backoff, circuit breaker)
- [ ] Timeout handling para steps individuais e workflow total

**Riscos / Dependências:**
- Complexidade de compensation logic em workflows distribuídos
- Depende de IOA-007 (patterns definidos)

---

### EPIC-E: Decision Schema Fix

---

#### IOA-009: Audit e Fix de Enums e Consistência

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-E — Decision Schema Fix |
| **Sprint** | 1 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 04 (Schemas & Standards) |

**Objetivo:**
Auditar todos os enums em todos os 7 schemas existentes. Garantir que Decision.status inclui "active" (gap conhecido). Gerar Schema Consistency Report documentando todas as inconsistências encontradas e corrigidas.

**Artefatos a Produzir:**
- `docs/schemas/consistency-report.md`
- `packages/schemas/src/*.schema.json` (fixes)
- `packages/schemas/src/types/resources.ts` (fixes)

**Critérios de Aceitação:**
- [ ] Enum audit completo para os 7 schemas
- [ ] Decision.status corrigido para incluir "active"
- [ ] Consistency report sem erros residuais
- [ ] TypeScript types 1:1 com schemas JSON (zero drift)
- [ ] CI verde após todas as correções

**Riscos / Dependências:**
- Breaking changes se enums mudam em schemas já consumidos
- Independente — pode iniciar imediatamente na Sprint 1

---

### EPIC-F: Memory Resource

---

#### IOA-010: Criar Memory Resource Schema

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-F — Memory Resource |
| **Sprint** | 3 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 07 (Memory Systems) + Agent 04 (Schemas) |

**Objetivo:**
Implementar Memory resource com spec/status: scopes (domain/agent/org), retention policies, entry types e indexing metadata. Memória é o que permite que organizações AI-native aprendam ao longo do tempo.

**Artefatos a Produzir:**
- `packages/schemas/src/memory.schema.json`
- `packages/schemas/src/types/resources.ts` (update)
- `examples/ai-native-startup/.ioa/memory/` (examples)

**Critérios de Aceitação:**
- [ ] Schema valida com AJV sem erros
- [ ] Types atualizados e sincronizados
- [ ] 3+ exemplos (domain memory, agent memory, org memory)
- [ ] Retention policies integradas com lifecycle hooks
- [ ] Cross-ref com agent e domain schemas (memoryRef)

**Riscos / Dependências:**
- Scope pode ficar broad demais — manter foco em estrutura, não em implementação
- Depende de IOA-001 (resource model) e IOA-003 (classificação de dados)

---

#### IOA-011: Compounding Memory Patterns

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-F — Memory Resource |
| **Sprint** | 4 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 07 (Memory Systems) |

**Objetivo:**
Documentar patterns de memória que ganham valor com o tempo: decision memory (aprender com decisões passadas), workflow memory (otimizar workflows recorrentes) e cross-domain context propagation. Este é o diferencial intelectual do IOA.

**Artefatos a Produzir:**
- `docs/memory/compounding-patterns.md`
- `docs/memory/retention-policies.md`

**Critérios de Aceitação:**
- [ ] 3+ compounding patterns documentados com exemplos concretos
- [ ] Retention templates para diferentes cenários (short/medium/long-term)
- [ ] Context propagation rules entre domínios
- [ ] Exemplos práticos mostrando valor composto ao longo de sprints

**Riscos / Dependências:**
- Conceito relativamente novo — pode precisar de iteração baseada em feedback
- Depende de IOA-010 (Memory schema)

---

### EPIC-G: Telemetry vs Observability

---

#### IOA-012: Event Taxonomy & Mandatory Events

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-G — Telemetry vs Observability |
| **Sprint** | 3 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 06 (Telemetry & Observability) |

**Objetivo:**
Definir taxonomia completa de events por resource kind. Listar events obrigatórios vs opcionais. Clarificar a separação entre telemetry (emissão de dados) e observability (consumo e análise de dados).

**Artefatos a Produzir:**
- `docs/telemetry/event-taxonomy.md`
- `docs/telemetry/observability-guide.md`

**Critérios de Aceitação:**
- [ ] Events definidos para 7+ resource kinds
- [ ] Mandatory vs optional classificados para cada kind
- [ ] Telemetry vs Observability clarificado com diagrama
- [ ] Naming conventions padronizadas (verb.noun.qualifier)

**Riscos / Dependências:**
- Over-engineering event model para um standard que pode não ter runtime ainda
- Depende de IOA-001 (resource model consolidado)

---

#### IOA-013: SLI/SLO Templates por Resource Kind

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-G — Telemetry vs Observability |
| **Sprint** | 4 |
| **Story Points** | 2 |
| **Owner Agent** | Agent 06 (Telemetry & Observability) |

**Objetivo:**
Definir SLIs e SLOs padrão para Domain e Agent resources. Criar templates reutilizáveis que organizações possam adotar imediatamente para medir saúde operacional.

**Artefatos a Produzir:**
- `docs/telemetry/sli-slo-templates.md`
- `templates/sli-domain.yaml`
- `templates/sli-agent.yaml`

**Critérios de Aceitação:**
- [ ] SLIs definidos para Domain (availability, throughput, error rate)
- [ ] SLIs definidos para Agent (latency, accuracy, cost efficiency)
- [ ] SLOs com thresholds padrão e justificativa
- [ ] Templates YAML funcionais e validáveis

**Riscos / Dependências:**
- SLOs genéricos podem não ser úteis sem contexto real
- Depende de IOA-012 (event taxonomy)

---

### EPIC-H: Cognitive Load Metrics

---

#### IOA-014: Cognitive Load Metrics Schema

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-H — Cognitive Load Metrics |
| **Sprint** | 4 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 06 (Telemetry & Observability) |

**Objetivo:**
Formalizar métricas de cognitive load por agent/domain: routine vs novel ratio, context switching cost, decision complexity score. Estas métricas revelam quando um agent ou domínio está sobrecarregado e precisa de refactoring organizacional.

**Artefatos a Produzir:**
- `docs/telemetry/cognitive-load-metrics.md`
- Telemetry schema update (opcional, se necessário)

**Critérios de Aceitação:**
- [ ] Métricas definidas formalmente com unidades e fórmulas
- [ ] 3+ cognitive load indicators (routine/novel ratio, switching cost, complexity score)
- [ ] Measurement guidelines práticas
- [ ] Integration path com schemas existentes (telemetry, agent)

**Riscos / Dependências:**
- Métricas podem ser difíceis de medir na prática sem instrumentação real
- Depende de IOA-012 (event taxonomy) e IOA-013 (SLI/SLO framework)

---

### EPIC-I: Docs / Movement / Quickstart

---

#### IOA-015: Reescrever README Principal

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-I — Docs / Movement / Quickstart |
| **Sprint** | 2 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 08 (Docs & Movement) |

**Objetivo:**
README que vende IOA em 30 segundos: what/why/quickstart/vision. Copy-pasteable, funcional, com badges e links. O README é a porta de entrada — se não convence em 30s, o projeto morre.

**Artefatos a Produzir:**
- `README.md` (rewrite completo)

**Critérios de Aceitação:**
- [ ] Quickstart funcional em menos de 5 minutos (install -> init -> validate)
- [ ] What/Why/How claro e conciso
- [ ] Badges (npm, CI, license, version)
- [ ] Links para docs, exemplos e contributing guide
- [ ] Testado end-to-end em ambiente limpo

**Riscos / Dependências:**
- Nenhum risco significativo
- Pode ser iniciado em paralelo a qualquer épico

---

#### IOA-016: Manifesto IOA v0.2 + Anti-Patterns Playbook

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-I — Docs / Movement / Quickstart |
| **Sprint** | 3 |
| **Story Points** | 3 |
| **Owner Agent** | Agent 08 (Docs & Movement) |

**Objetivo:**
Criar manifesto conciso (menos de 2000 palavras) que articula a visão IOA e playbook de anti-patterns (10+ patterns) que tornam IOA memorável e compartilhável. O manifesto transforma IOA de "mais um framework" em movimento.

**Artefatos a Produzir:**
- `docs/manifesto.md`
- `docs/anti-patterns.md`

**Critérios de Aceitação:**
- [ ] Manifesto com menos de 2000 palavras, tom claro e direto
- [ ] 10+ anti-patterns documentados
- [ ] Cada anti-pattern com seção "Em vez disso, faça..."
- [ ] Linkado do README principal

**Riscos / Dependências:**
- Tom pode não ressoar com audiência técnica — precisa de review externo
- Roda em paralelo

---

#### IOA-017: Getting Started Guide + Glossário

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-I — Docs / Movement / Quickstart |
| **Sprint** | 4 |
| **Story Points** | 2 |
| **Owner Agent** | Agent 08 (Docs & Movement) |

**Objetivo:**
Guia passo-a-passo: install -> init -> create domain -> create agent -> validate -> status. Glossário com todos os termos IOA para eliminar ambiguidade.

**Artefatos a Produzir:**
- `docs/getting-started.md`
- `docs/glossary.md`

**Critérios de Aceitação:**
- [ ] Guide testado end-to-end em ambiente limpo
- [ ] Cada step com output esperado (copy-paste friendly)
- [ ] Glossário com 30+ termos definidos
- [ ] Zero jargão usado sem definição prévia

**Riscos / Dependências:**
- CLI precisa estar estável (depende de IOA-009 para schemas corretos)
- Depende da maioria dos outros épicos estarem avançados

---

### EPIC-J: CLI Enhancements

---

#### IOA-018: CLI Generate Commands

| Campo | Valor |
|-------|-------|
| **Épico** | EPIC-J — CLI Enhancements (Opcional) |
| **Sprint** | 4 |
| **Story Points** | 5 |
| **Owner Agent** | Agent 09 (DX / CLI Scaffolder) + Agent 04 (Schemas) |

**Objetivo:**
Adicionar `ioa generate domain|agent|workflow` que scaffolda resources individuais com templates válidos. Reduz fricção de adoção e garante que novos resources já nascem conformes com o standard.

**Artefatos a Produzir:**
- `packages/cli/src/commands/generate.ts`
- `packages/templates/scaffolds/domain.yaml.hbs`
- `packages/templates/scaffolds/agent.yaml.hbs`
- `packages/templates/scaffolds/workflow.yaml.hbs`

**Critérios de Aceitação:**
- [ ] Generate funcional para domain, agent e workflow
- [ ] Output valida contra schemas correspondentes
- [ ] Interactive prompts para campos obrigatórios
- [ ] Testes unitários para cada generator

**Riscos / Dependências:**
- Template maintenance overhead — cada mudança de schema pode quebrar templates
- Depende de IOA-001 (resource model) e IOA-009 (schemas consistentes)

---

## Sprint Planning (Sugestão)

### Sprint 1 (Semana 1) — Foundation

| Issue | Título | SP |
|-------|--------|----|
| IOA-001 | Definir Resource Model v0.2 Completo | 8 |
| IOA-009 | Audit e Fix de Enums e Consistência | 3 |

**Total Story Points:** 11
**Foco:** Resource model + schema fixes (fundação para todo o resto)
**Resultado esperado:** Resource model documentado, schemas consistentes, CI verde

---

### Sprint 2 (Semana 2) — Security + Economics + Workflow

| Issue | Título | SP |
|-------|--------|----|
| IOA-002 | Especificar Controller Reconciliation Pattern | 5 |
| IOA-003 | Criar SecurityPolicy Resource Schema | 5 |
| IOA-004 | Threat Model por Resource Kind | 3 |
| IOA-005 | Criar Budget Resource Schema | 5 |
| IOA-007 | Workflow Pattern Catalog | 5 |
| IOA-015 | Reescrever README Principal | 3 |

**Total Story Points:** 26
**Foco:** Fechar P0 gaps (Security, Economics, Workflow) + README
**Resultado esperado:** 3 novos schemas, threat model, workflow patterns, README vendedor

---

### Sprint 3 (Semana 3) — Depth + Memory + Telemetry

| Issue | Título | SP |
|-------|--------|----|
| IOA-006 | Token Accounting Model & Cost Templates | 3 |
| IOA-008 | Workflow State Machine & Error Handling | 3 |
| IOA-010 | Criar Memory Resource Schema | 5 |
| IOA-012 | Event Taxonomy & Mandatory Events | 3 |
| IOA-016 | Manifesto IOA v0.2 + Anti-Patterns Playbook | 3 |

**Total Story Points:** 17
**Foco:** P1 resources (Memory, Telemetry refinement) + docs de movimento
**Resultado esperado:** Memory schema, event taxonomy, manifesto publicado

---

### Sprint 4 (Semana 4) — Polish + DX

| Issue | Título | SP |
|-------|--------|----|
| IOA-011 | Compounding Memory Patterns | 3 |
| IOA-013 | SLI/SLO Templates por Resource Kind | 2 |
| IOA-014 | Cognitive Load Metrics Schema | 3 |
| IOA-017 | Getting Started Guide + Glossário | 2 |
| IOA-018 | CLI Generate Commands | 5 |

**Total Story Points:** 15
**Foco:** Patterns avançados, métricas, CLI e getting started
**Resultado esperado:** IOA completo para early adopters, DX polida

---

## Ritual de Sprint

| Dia | Cerimonia | Atividade |
|-----|-----------|-----------|
| Segunda | Planning | Priorizar issues, assign owners, definir scope da sprint |
| Quarta | Checkpoint | Review riscos, drift detection, resolver blockers |
| Sexta | Release Notes | O que mudou em schemas/docs, schema consistency check, merge to main |

---

## Métricas de Progresso

| Métrica | Target Sprint 1 | Target Sprint 2 | Target Sprint 3 | Target Sprint 4 |
|---------|-----------------|-----------------|-----------------|-----------------|
| Resource kinds com spec/status | 7 | 9 | 10 | 11 |
| Schemas validando | 7 | 9 | 10 | 10+ |
| P0 gaps fechados | 1 (Decision) | 3 | 4 | 5/5 |
| P1 gaps fechados | 0 | 0 | 2 | 3/3 |
| Exemplos validando | 14 | 18 | 22 | 25+ |
| Docs pages | 4 (_strategy) | 8 | 12 | 15+ |
| Anti-patterns | 0 | 0 | 10+ | 10+ |
| CLI commands | 4 | 4 | 4 | 7+ |

---

## Resumo de Story Points

| Prioridade | Issues | Story Points | % do Total |
|------------|--------|-------------|------------|
| P0 | IOA-001 a IOA-009 (9 issues) | 37 | 53.6% |
| P1 | IOA-010 a IOA-017 (8 issues) | 24 | 34.8% |
| P2 | IOA-018 (1 issue) | 5 | 7.2% |
| **Total** | **18 issues** | **69** | **100%** |

---

*Backlog gerado em 2026-02-25. Revisão prevista a cada Sprint Planning (segundas).*
