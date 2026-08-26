---
name: sap-cap
description: Build and extend SAP CAP applications (Node.js or Java) using a declarative-first approach with CDS, OData, and Fiori elements.
license: MIT
---

# SAP CAP developer

## What this covers

Expert guidance for building and extending SAP Cloud Application Programming Model (CAP)
applications in **Node.js** or **Java**. The principles are unified across runtimes; the
language-specific mechanics live in [references/nodejs.md](references/nodejs.md) and
[references/java.md](references/java.md). Keep models and services lean and declarative;
reach for code only when declaration cannot express the requirement.

## Runtime choice (Node.js vs Java)

- **Node.js** (`@sap/cds`): fastest inner loop, JavaScript/TypeScript handlers, ideal for
  most greenfield services and teams already in the JS ecosystem.
- **Java** (`@sap/cds` + CAP Java SDK, Spring Boot): choose when the team/organization
  standardizes on Java/Spring or needs its ecosystem.

Pick one runtime per service. The CDS model, annotations, and architectural rules below are
identical either way — only handler implementation differs.

## Using the CAP MCP server

When unsure about a CAP API, CLI flag, annotation, or CDS construct, **consult the CAP MCP
server** (`search_docs` for docs/CLI, `search_model` for the project's CSN model) instead
of guessing. This project wires it in [`.mcp.json`](../../.mcp.json). Verifying against the
docs prevents hallucinated APIs.

## Project setup rules

Scaffold and iterate with the `cds` CLI:

```sh
cds init <project>       # new CAP project
cds add <facet>          # add capabilities: hana, xsuaa, mta, multitenancy, ...
cds watch                # Node.js: recompile + restart on change
# Java: use `mvn cds:watch` instead of `cds watch`
```

Standard folder layout:

- `db/` — domain data model (entities, aspects) and `db/data/*.csv` sample data.
- `srv/` — service definitions and custom handlers.
- `app/` — UI annotations and Fiori apps.

`cds watch` is a shortcut for `cds serve all --with-mocks --in-memory?`, giving mocked auth
and an in-memory SQLite database for local development.

## CDS modeling

Model the domain in CDL: entities, reusable **aspects**, and **associations**. Expose data
through services as **projections** — never duplicate the model:

```cds
// db/schema.cds
using { cuid, managed } from '@sap/cds/common';
entity Books : cuid, managed {
  title  : String;
  author : Association to Authors;
  stock  : Integer;
}

// srv/cat-service.cds
service CatalogService {
  @readonly entity Books as projection on my.Books;
}
```

Keep the model the single source of truth. See [references/cdl.md](references/cdl.md) for CDL
and [references/cql.md](references/cql.md) for querying (CQL/CQN).

## Declarative first

Prefer **annotations** over hand-written code. Only drop to custom handlers when a
requirement genuinely cannot be declared.

| Requirement | Declarative (preferred) | Custom code (only if needed) |
|---|---|---|
| Read/expose data | `entity … as projection on …` | — |
| Read-only / required fields | `@readonly`, `@mandatory` | — |
| Authorization | `@requires`, `@restrict` | handler-level checks for dynamic rules |
| Field labels / UI | `@title`, `@UI.LineItem`, `@Common.ValueList` | — |
| Input validation | `@assert.range`, `@assert.format`, `@mandatory` | `before` handler for cross-field rules |
| Computed/derived output | calculated elements | `after` handler |
| Custom actions / side effects | declare `action`/`function` | `on` handler implements it |

Annotations live in `.cds` files (domain, service, or `app/` UI-annotation files) and are
protocol-agnostic — they drive OData metadata and Fiori elements automatically. See
[references/annotations.md](references/annotations.md).

## Programmatic custom logic

When declaration is not enough, add lean handlers next to the service definition. Register
for `before` (validation/defaults), `on` (custom actions / replace default), and `after`
(enrich results). Node.js and Java differ only in syntax:

- **Node.js:** `this.before('CREATE','Books',…)`, `this.on('submitOrder',…)`,
  `this.after('READ','Books',(books)=>…)` — full patterns in
  [references/nodejs.md](references/nodejs.md).
- **Java:** `@Before` / `@On` / `@After` methods on an `EventHandler` `@Component` annotated
  with `@ServiceName(…)` — full patterns in [references/java.md](references/java.md).

Use the framework's query API (CQN/`cds.ql`) for data access; never hand-build SQL or OData.

## Sample data

Provide initial data as CSV under `db/data/`, named `<namespace>-<Entity>.csv`. `cds watch`
auto-loads it into the in-memory database for local development and testing.

## Anti-patterns (Don't)

- **Don't** hand-roll OData/REST endpoints or SQL — expose entities via CDS services and
  query with CQN.
- **Don't** duplicate the domain model inside services — use projections.
- **Don't** implement authorization only in code when `@requires`/`@restrict` express it.
- **Don't** hardcode credentials, tenant IDs, or destinations — use CAP's service bindings.
- **Don't** put custom logic in the UI layer that belongs in `before`/`on`/`after` handlers.
- **Don't** guess API names — verify via the CAP MCP server.

## References

- [references/nodejs.md](references/nodejs.md) — Node.js handlers and `cds.ql`.
- [references/java.md](references/java.md) — CAP Java handlers and CQN.
- [references/cdl.md](references/cdl.md) — CDS Definition Language.
- [references/cql.md](references/cql.md) — CDS Query Language.
- [references/annotations.md](references/annotations.md) — common annotations incl. Fiori UI.
- [references/deployment.md](references/deployment.md) — MTA, Cloud Foundry / Kyma, HANA.
- [references/security.md](references/security.md) — XSUAA, `@requires`/`@restrict`, roles.
- [references/multitenancy.md](references/multitenancy.md) — multitenancy basics.
