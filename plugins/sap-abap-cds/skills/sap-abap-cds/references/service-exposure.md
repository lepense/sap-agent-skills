# Exposing CDS as OData

A CDS view becomes a consumable OData service in two main ways.

## RAP service (preferred, ABAP Cloud)

Expose CDS through a **service definition** + **service binding** (see the `sap-abap` skill):

```abap
define service ZUI_Book {
  expose ZC_Book as Book;
}
```

Then create an **OData V4 – UI** binding (for Fiori elements) or **OData V4 – Web API**
binding and activate it. This is the clean-core way and supports RAP behavior (draft, actions).

## Consumption view for the service

The exposed view is typically a **consumption view** (`ZC_*`) projecting an interface view and
carrying `@UI`/`@Consumption`/`@OData` annotations (or a metadata extension). Keep behavior in
the RAP BO, presentation in the consumption view.

## Legacy: @OData.publish

The older `@OData.publish: true` on a CDS view auto-generates an OData V2 service. Avoid it for
new clean-core development — prefer service definition + binding, which gives explicit control
and V4 support.

## Guidance

For new apps: interface view → consumption view (annotations) → service definition → service
binding (OData V4). Reserve `@OData.publish` for quick legacy scenarios only.
