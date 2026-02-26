# The IOA Manifesto

**Applied Organizational Intelligence — v0.2**

---

## The Problem

Organizations are adding AI agents with no architecture.

They bolt on chatbots, automate workflows, deploy copilots — all without asking: *how should an AI-augmented organization actually work?*

The result: fragmented agents with no governance, decisions made by AI with no audit trail, costs invisible, data flowing without classification, and no one can tell you which agent does what, for whom, at what cost, under what rules.

This is the organizational equivalent of writing a distributed system with no API contracts, no monitoring, and no access control.

We've seen this before. In software, it led to microservice chaos. In organizations, it will lead to something worse: **ungoverned intelligence**.

## The Thesis

**Organizations need architecture, not just automation.**

Just as Kubernetes brought declarative infrastructure to computing, organizations need a declarative model for their intelligent systems. Not a product. Not a framework. A **standard**.

IOA — Applied Organizational Intelligence — is that standard.

## What IOA Proposes

### 1. Domains First, Not Tools First

Don't start with "let's add an AI agent." Start with: *what are the bounded contexts of this organization?* What does each domain own? What data flows between them? What KPIs define success?

Structure precedes intelligence. Without domain boundaries, agents are just expensive chaos.

### 2. Agents Are Citizens, Not Plugins

An AI agent in an IOA organization is not a bolt-on. It has:
- A **type** (autonomous, supervised, advisory, reactive)
- A **role** (strategic, tactical, analytical, governance, observer)
- A **domain** it serves
- **Capabilities** it declares
- **Budgets** it respects
- **Governance** it follows
- An **identity** that can be verified

Agents are first-class organizational participants with explicit contracts.

### 3. Decisions Are Resources, Not Chat Logs

Every significant decision — whether made by a human, an agent, or both — is a **tracked resource** with:
- Context and options evaluated
- Assumptions that can be validated
- KPI impact measured over time
- Review dates that trigger re-evaluation

You can query your organization's decision history like you query a database.

### 4. Desired State vs. Actual State

IOA borrows the most powerful idea from Kubernetes: **spec/status separation**.

`spec` is what you want. `status` is what you have. Controllers reconcile the gap.

This means organizations can declare their intent and continuously verify reality matches.

### 5. Security Is Not Optional

Every agent has an identity. Every data asset has a classification. Zero-trust is the default, not the aspiration. Prompt injection defenses are built into the model, not bolted on after an incident.

Security is a first-class resource (SecurityPolicy), not a checkbox in a governance policy.

### 6. Cost Is Visible

Every token consumed is attributed to a domain, an agent, a workflow, a decision. Budgets have limits, alerts, and enforcement. ROI is calculable.

If you can't tell me what an agent costs, you can't tell me if it's worth having.

### 7. Everything Is Observable

If an agent acts, there's a telemetry event. If a workflow runs, there's a trace. If a decision is made, there's an audit record. If a policy is violated, there's an alert.

Observability is not a feature — it's a property of the architecture.

## What IOA Is Not

- **Not a product.** IOA is an open standard. No vendor lock-in, no SaaS subscription.
- **Not a framework.** IOA doesn't run your agents. It defines how to describe, govern, and observe them.
- **Not prescriptive about AI models.** Use Claude, GPT, Llama, or a human. IOA doesn't care. The standard is model-agnostic.
- **Not just documentation.** IOA is backed by JSON Schemas, a CLI, TypeScript types, and validators. It's executable.

## The Standard

IOA consists of:

1. **Doctrine** — 12 principles for AI-native organizational design
2. **Resource Model** — Kubernetes-style YAML declarations (Domain, Agent, Decision, Telemetry, Governance, Workflow, SecurityPolicy, Budget, Memory, Controller)
3. **Schemas** — JSON Schema validation with cross-reference checking
4. **CLI** — `ioa init`, `ioa validate`, `ioa status`, `ioa migrate`
5. **Controller Pattern** — Watch/Diff/Plan/Act/Report reconciliation loop

## Why Now

The AI agent proliferation is happening in 2025-2026. Organizations are deploying agents faster than they can govern them. The window for establishing architectural standards is narrow:

- Too early (2023): not enough agent adoption to motivate standards
- **Right now (2025-2026): proliferation creates pain, standards create relief**
- Too late (2028): lock-in to proprietary platforms makes standards irrelevant

IOA exists because the alternative — ungoverned, unobservable, unaccountable AI in organizations — is unacceptable.

## Join

IOA is open source, MIT licensed, and welcomes contributors.

- **GitHub**: [cognitive-organization/ioa](https://github.com/cognitive-organization/ioa)
- **CLI**: `npx @ioa/cli init`
- **Doctrine**: 12 principles in `packages/doctrine/`

The standard is versioned. The doctrine is amendable. The conversation is open.

**Build organizations that are intelligent by design, not by accident.**

---

*IOA v0.2 "Runtime Architecture" — February 2026*
