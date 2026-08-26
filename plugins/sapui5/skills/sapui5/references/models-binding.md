# Models and data binding

## Model types

- `sap.ui.model.json.JSONModel` — local/client state.
- `sap.ui.model.odata.v4.ODataModel` — OData V4 (preferred for new apps).
- `sap.ui.model.odata.v2.ODataModel` — OData V2 (existing services).
- `sap.ui.model.resource.ResourceModel` — i18n texts (named `i18n`).

Declare models in `manifest.json` under `sap.ui5.models`; UI5 instantiates them for you.

## Binding modes

- **Property binding:** `text="{/title}"` or relative `text="{title}"` under a context.
- **Aggregation (list) binding:** bind an aggregation to a collection with a template:

```xml
<List items="{/Books}">
  <StandardListItem title="{title}" description="{author/name}"/>
</List>
```

- **Element (context) binding:** bind a whole view/control to one entity:

```js
this.getView().bindElement("/Books(" + sId + ")");
```

- **Expression binding:** `visible="{= ${stock} > 0 }"`.
- **Formatter:** `number="{ path: 'price', formatter: '.formatPrice' }"`.

## Two-way binding

JSONModel defaults to two-way binding; OData models use one-way by default and switch to
two-way for editable forms. Set `bindingMode` in the model config when needed.

## i18n

```xml
<Page title="{i18n>listTitle}"/>
```

Texts live in `i18n/i18n.properties` (plus locale variants). Never hardcode display strings.
