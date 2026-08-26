# Security: XSUAA, approuter, IAS

Production auth on BTP uses **XSUAA** (or **IAS**) for tokens/roles, fronted by an **app
router** that handles login and serves UIs.

## XSUAA

```sh
cds add xsuaa
cds compile --to xsuaa   # regenerate xs-security.json after auth-annotation changes
```

`xs-security.json` derives **scopes** and **role-templates** from your CDS roles (`@requires`,
`@restrict`). Role collections in the BTP cockpit map roles to users. Re-run
`cds compile --to xsuaa` whenever roles change.

## App router

The app router is the single entry point: it authenticates the user (OAuth flow with XSUAA),
forwards authenticated requests to the CAP service, and serves the UI. Options:

- `cds add approuter` — a standalone `@sap/approuter` module you control (`xs-app.json` routes).
- `cds add workzone` — a managed app router via SAP Build Work Zone.
- `cds add portal` — Cloud Portal + HTML5 Application Repository for multitenant UIs.

`xs-app.json` defines routes: which paths need auth, which forward to the backend
destination, and which serve static UI resources.

## IAS

For Identity Authentication Service:

```sh
cds add ias
```

Adds a managed identity service binding (credential-type `X509_GENERATED`) to `mta.yaml`.
Establish tenant trust before deploying.

## Guidance

Express authorization declaratively in CDS (`@requires`/`@restrict`); let XSUAA enforce it.
Never bypass the approuter to expose the backend directly; keep secrets in service bindings.
