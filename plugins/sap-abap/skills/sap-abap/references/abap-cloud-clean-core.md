# ABAP Cloud and clean core

**ABAP Cloud** is SAP's development model for building cloud-ready, upgrade-stable
applications and extensions — on the SAP BTP ABAP Environment, S/4HANA Cloud (public and
private), and S/4HANA on-premise (via ABAP Cloud).

## Clean core principles

- **Use released APIs only.** Consume SAP functionality through objects with a **released**
  API state (public release contract): released CDS views, RAP business objects, released
  classes/interfaces, and released database tables. ADT shows the release state.
- **No modifications.** Never modify SAP repository objects. Extend through sanctioned
  extension points (BAdIs, CDS extensions, RAP extensibility).
- **Stay in your namespace.** Keep custom code decoupled from SAP internals so upgrades and
  cloud updates don't break it.
- **Language scope.** ABAP Cloud restricts the language to a cloud-safe subset (`ABAP for
  Cloud Development`), enforced by ADT — no direct access to unreleased objects or forbidden
  statements.

## Why it matters

Clean-core code survives upgrades and works identically across on-premise and cloud. Custom
logic that reaches into SAP internals or unreleased APIs breaks on the next upgrade — the
opposite of clean core.

## Checking release state

In ADT, an object's **API State** (e.g. *Released*, *Use in Cloud Development*) tells you
whether it is safe to consume. If a needed API is not released, request a released
alternative rather than reaching into internals.
