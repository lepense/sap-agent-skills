# Guided Development

Guided Development turns common Fiori elements enhancements into step-by-step guides that
apply the code for you — keeping the app annotation-driven and consistent.

## Opening

Command palette → *Fiori: Open Guided Development*.

## Typical guides

- **Add a custom column** to a List Report table.
- **Add a custom action** (button) to a table or Object Page, wired to a controller
  extension or a bound OData action.
- **Enable draft handling** for editable Object Pages.
- **Add a custom section / custom page** to an Object Page.
- **Add a filter field** or configure the selection fields.
- **Add value help** for a field.

## How it works

Each guide explains the change, lets you fill in parameters (entity, field, label), shows the
resulting code diff, and applies it — updating annotations, `manifest.json`, and any
extension files. This is the preferred way to extend a Fiori elements app: you get the
correct annotations and extension wiring without memorizing them.

## When code is unavoidable

For behavior no guide covers, use the **flexible programming model**: controller extensions
and building-block/custom sections. Keep these small and local so the app stays mostly
annotation-driven.
