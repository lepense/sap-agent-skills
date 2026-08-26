# SaaS tenant extensions (MTX)

In a multitenant SaaS app, subscribers extend the base model **for their own tenant** at
runtime — without the provider redeploying — through the **MTX** (Model Transaction eXtensions)
extensibility services.

## How it works

- The provider deploys the base app with `cds add multitenancy` (adds the MTX sidecar).
- A subscriber pushes a **tenant extension** (a small CDS project with `extend`/`annotate` +
  optional CSV data) via the MTX Extensibility API / `cds push`.
- MTX validates the extension against the provider's rules, activates it for that tenant, and
  adapts the tenant's HDI schema — other tenants are unaffected.

## Example tenant extension

```cds
using { my.bookshop.Books } from '_base';   // the base model, as seen by the extension
extend Books with {
  x_customerNote : String;
  x_priority     : Integer;
}
annotate Books with { x_priority @title: 'Priority' };
```

## Provider responsibilities

- **Whitelist** which entities/services are extensible and which fields/types are allowed.
- **Reserve** extension capacity where needed (see governance.md).
- **Version** the base model so tenant extensions keep working across upgrades.

## Consumer flow

Subscribers use the SAP-provided extensibility tooling / API to author, deploy, and remove
their tenant extensions; the changes are isolated to their tenant.

## Guidance

Enable tenant extensibility through MTX (never by per-customer code branches); govern what can
be extended; and keep base entities extension-stable so tenant extensions survive upgrades.
