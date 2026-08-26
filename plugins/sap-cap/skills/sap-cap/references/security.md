# Security

CAP is declarative-first for authorization: express access rules as annotations; the runtime
enforces them for every protocol. Use XSUAA (or IAS) on SAP BTP.

## Authorization annotations

```cds
service AdminService @(requires: 'admin') {          // whole service
  entity Books as projection on my.Books;
}

service CatalogService {
  @readonly entity Books as projection on my.Books;  // anyone may read
  entity Orders @(restrict: [
    { grant: 'READ',  to: 'authenticated-user', where: 'buyer = $user' },
    { grant: '*',     to: 'admin' }
  ]) as projection on my.Orders;
}
```

- `@requires: '<role>'` — require a role for the service/entity.
- `@restrict: [{ grant, to, where }]` — fine-grained rules; `where` supports instance-based
  checks like `buyer = $user`.

Prefer these over code. Use a `before` handler only for dynamic rules that cannot be
expressed declaratively.

## XSUAA setup

```sh
cds add xsuaa
cds compile --to xsuaa      # regenerate xs-security.json after annotation changes
```

`xs-security.json` derives scopes and role-templates from your CDS roles:

```json
{
  "scopes": [ { "name": "$XSAPPNAME.admin", "description": "admin" } ],
  "role-templates": [
    { "name": "admin", "scope-references": [ "$XSAPPNAME.admin" ], "description": "Administrators" }
  ]
}
```

## Local development

`cds watch` mocks users so you can test roles without a real identity provider. Configure
mocked users under `cds.requires.auth.users` in `.cdsrc.json`/`package.json` for local role
testing. Never hardcode real credentials; rely on service bindings in production.

## IAS

For IAS-based auth: `cds add ias` adds a managed identity service binding to `mta.yaml`
(credential-type `X509_GENERATED`). Establish tenant trust before deploying.
