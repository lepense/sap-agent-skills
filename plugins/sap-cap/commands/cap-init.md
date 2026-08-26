---
description: Scaffold a new SAP CAP project (Node.js or Java), declarative-first.
---

Scaffold a new CAP project for the user. Follow these steps:

1. **Choose runtime.** Ask whether they want **Node.js** or **Java** if not already clear.
2. **Initialize.** Run `cds init <name>` (add `--add java` for a Java project). This creates
   the `db/`, `srv/`, `app/` structure.
3. **Model the domain.** Create `db/schema.cds` with entities using `@sap/cds/common` aspects
   (`cuid`, `managed`). Prefer associations/compositions; add `@mandatory`, `@assert.range`,
   and `localized` where appropriate. Use the `templates/data-model.cds` shape as reference.
4. **Define a service.** Create `srv/<name>-service.cds` exposing entities as
   `projection on` — read-only where users only read. See `templates/service.cds`.
5. **Add sample data.** Put CSVs under `db/data/` named `<namespace>-<Entity>.csv`.
6. **Run it.** `cds watch` (Node.js) or `mvn cds:watch` (Java) — verify the service loads and
   the in-memory DB initializes from the CSVs.

Stay declarative-first: only add custom handlers when a requirement cannot be annotated. If
unsure about any CAP API or CLI flag, consult the CAP MCP server before writing code.
