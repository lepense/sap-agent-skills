---
name: sap-abap
description: Develop modern ABAP with ABAP Cloud and clean core — the ABAP RESTful Application Programming Model (RAP), object-oriented ABAP, ADT, and ABAP Unit testing.
license: MIT
---

# ABAP developer

## What this covers

Modern, **clean-core** ABAP development: the **ABAP RESTful Application Programming Model
(RAP)** for building business objects and OData services, object-oriented ABAP, the ABAP
Development Tools (**ADT**) in Eclipse, and **ABAP Unit** testing. Target **ABAP Cloud**
(SAP BTP ABAP Environment, S/4HANA Cloud, and S/4HANA on-premise via ABAP Cloud). Prefer
released APIs and RAP over classic patterns. Detail lives in [references/](references).

## ABAP Cloud and clean core

**ABAP Cloud** is the development model for cloud-ready, upgrade-stable apps. **Clean core**
means:

- Build on **released** SAP APIs and extension points only — never modify SAP objects.
- Use public released CDS views, RAP BOs, and released classes/interfaces (check the release
  contract / "API state" in ADT).
- Keep custom code in your own namespace, decoupled from SAP internals, so upgrades stay
  clean.

See [references/abap-cloud-clean-core.md](references/abap-cloud-clean-core.md).

## Tooling: ADT

Develop in **ABAP Development Tools (ADT)** for Eclipse — not SE80. ADT is where you edit
CDS, behavior definitions, classes, and run/debug/test. See [references/adt.md](references/adt.md).

## Modern ABAP language

Use modern, expression-oriented ABAP:

- Inline declarations (`DATA(x) = ...`), `VALUE #( )`, `CORRESPONDING #( )`,
  constructor expressions, `FOR` iterations, table expressions (`itab[ ... ]`).
- Prefer `SELECT ... INTO TABLE @DATA(...)` with proper `WHERE`; avoid `SELECT *` and nested
  loops over DB.
- Strings with `|...{ }...|` templates.

See [references/modern-abap.md](references/modern-abap.md).

## Object-oriented ABAP

Model logic in classes and interfaces; keep methods small and single-purpose; use
dependency injection for testability. Avoid procedural reports and global includes for new
code. See [references/oo-abap.md](references/oo-abap.md).

## RAP: business objects and services

A RAP business object is defined declaratively and implemented in a behavior pool:

1. **Data model** — CDS view entities (root + children), with a composition hierarchy.
2. **Behavior definition** (`.bdef`) — declares the BO: `managed` or `unmanaged`, fields,
   operations (`create`/`update`/`delete`), plus determinations, validations, and actions.
3. **Behavior implementation** — an ABAP class (behavior pool) implementing the declared
   logic.
4. **Service definition** (`.srvd`) — exposes entities.
5. **Service binding** — binds the service to a protocol (typically **OData V4** UI or Web
   API).

Prefer **managed** BOs (framework handles persistence) unless you must wrap legacy logic
(then **unmanaged**). See [references/rap.md](references/rap.md) and
[references/rap-behavior.md](references/rap-behavior.md).

## Testing: ABAP Unit

Write **ABAP Unit** tests (`FOR TESTING` methods in a local test class) for classes and RAP
behavior. Use test doubles and the RAP test-double framework to isolate the BO. See
[references/abap-unit.md](references/abap-unit.md).

## Error handling

Use class-based exceptions (`CX_*`), raise with `RAISE EXCEPTION TYPE`, and surface RAP
issues via the `REPORTED`/`FAILED` structures in behavior implementations rather than
`MESSAGE`. See [references/error-handling.md](references/error-handling.md).

## Anti-patterns (Don't)

- **Don't** modify SAP objects or call unreleased APIs — it breaks clean core.
- **Don't** write new logic as classic reports/module pools — use RAP + OO.
- **Don't** use `SELECT *` or `SELECT` inside `LOOP` — select what you need, set-based.
- **Don't** hardcode clients, languages, or text — use CDS/annotations and message classes.
- **Don't** put business logic in the UI (Fiori) that belongs in the RAP behavior.
- **Don't** skip ABAP Unit tests for behavior implementations.

## References

- [references/abap-cloud-clean-core.md](references/abap-cloud-clean-core.md) — ABAP Cloud & clean core.
- [references/adt.md](references/adt.md) — ABAP Development Tools.
- [references/modern-abap.md](references/modern-abap.md) — modern language constructs.
- [references/oo-abap.md](references/oo-abap.md) — object-oriented ABAP.
- [references/rap.md](references/rap.md) — RAP business object structure.
- [references/rap-behavior.md](references/rap-behavior.md) — determinations, validations, actions.
- [references/abap-unit.md](references/abap-unit.md) — ABAP Unit testing.
- [references/error-handling.md](references/error-handling.md) — exceptions and RAP messages.
