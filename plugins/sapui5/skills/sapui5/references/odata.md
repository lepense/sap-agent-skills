# OData models

## OData V4 (preferred for new apps)

`sap.ui.model.odata.v4.ODataModel`. Configure via a `dataSource` in the manifest; V4 uses
binding-level parameters rather than a separate metadata read call.

```xml
<Table items="{
    path: '/Books',
    parameters: { $count: true, $orderby: 'title' }
  }">
  <columns><Column><Text text="{i18n>title}"/></Column></columns>
  <items>
    <ColumnListItem>
      <cells><Text text="{title}"/></cells>
    </ColumnListItem>
  </items>
</Table>
```

- List binding parameters use OData system query options: `$filter`, `$orderby`, `$select`,
  `$expand`, `$count`.
- Create/update through the binding API: `oListBinding.create({...})`, then
  `oModel.submitBatch(...)`; UI5 groups changes into `$batch` requests.

## OData V2 (existing services)

`sap.ui.model.odata.v2.ODataModel`. Reads metadata up front; changes are collected and sent
with `submitChanges()` (deferred groups) after `setUseBatch(true)`.

## Choosing

Use **V4** for new development — leaner, better performance, and the model UI5 continues to
invest in. Use **V2** only when the backend service is V2. Both are declared as models in
`manifest.json`; controls bind the same way.

## Error handling

Attach to the model's request/error events (V2) or handle promise rejections from binding
operations (V4). Surface backend messages via the `sap.ui.core.message` manager and a
`MessagePopover`/`MessageBox`.
