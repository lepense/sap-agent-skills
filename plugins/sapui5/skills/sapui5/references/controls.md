# Common controls (sap.m and friends)

`sap.m` is the primary responsive control library. Common building blocks:

## Layout / app frame

- `sap.m.App` / `sap.m.Shell` — app container.
- `sap.m.Page` — a screen with header/footer and content.
- `sap.f.FlexibleColumnLayout` — list-detail (1–3 columns) master pattern.
- `sap.ui.layout.form.SimpleForm` / `sap.m.f.Form` — labeled input layouts.

## Lists and tables

- `sap.m.List` + `sap.m.StandardListItem` — simple responsive lists.
- `sap.m.Table` + `sap.m.ColumnListItem` — responsive tables.
- `sap.ui.table.Table` — grid table for large datasets (desktop).

## Inputs

- `sap.m.Input`, `sap.m.TextArea`, `sap.m.Select`, `sap.m.ComboBox`,
  `sap.m.DatePicker`, `sap.m.CheckBox`, `sap.m.Switch`.
- `sap.m.SearchField` — filtering.

## Actions and feedback

- `sap.m.Button` (`press=".onSave"`), `sap.m.MenuButton`.
- `sap.m.Dialog` (load from a fragment), `sap.m.MessageBox`, `sap.m.MessageToast`.
- `sap.m.MessagePopover` — bound to the message model.

## Display

- `sap.m.ObjectHeader` / `sap.f.DynamicPage` — object detail headers.
- `sap.m.ObjectStatus`, `sap.m.ObjectNumber` — status/number formatting.

Prefer `sap.m` responsive controls so apps work across phone, tablet, and desktop. Reach for
`sap.ui.table` only when you need a high-volume grid on desktop.
