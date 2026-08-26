# Exposing extension entities

Fields added to an already-exposed entity flow through automatically. **New** extension
entities, however, may need to be projected into a service to become reachable.

## Extend a service

```cds
using { OrdersService } from '@capire/fiori';

extend service OrdersService with {
  entity x_Customers   as projection on extension.x_Customers;
  entity x_SalesRegion as projection on extension.x_SalesRegion;
}
```

The extension entities (`extension.x_*`) must exist; the projection makes them available via
the existing service's OData endpoints (read-only unless you add handlers).

## New fields on existing entities

Adding a field via `extend Books with { ISBN : String }` needs no service change — the field
appears on the existing `Books` entity set and in `$metadata`. Add UI annotations
(`@UI.LineItem` position, etc.) to surface it in Fiori.

## Naming

By convention, tenant/extension artifacts are prefixed (`x_...`) to distinguish them from base
model definitions and to support governance/whitelisting.

## Guidance

Extend the **service** to expose new extension entities; extend the **entity** to add fields
(auto-exposed). Annotate new fields for UI where they should appear. Keep extension artifacts
clearly named (e.g. `x_`).
