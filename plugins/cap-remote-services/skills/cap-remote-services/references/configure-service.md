# Configuring the remote service

`cds import` registers the service under `cds.requires`. Configure its kind, model, and how it
reaches the real system per profile.

## package.json

```jsonc
"cds": {
  "requires": {
    "API_BUSINESS_PARTNER": {
      "kind": "odata-v2",                 // odata-v2 | odata (v4) | rest
      "model": "srv/external/API_BUSINESS_PARTNER",
      // local dev: mocked automatically (see mocking.md)
      "[hybrid]":     { "credentials": { "destination": "S4HANA", "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER" } },
      "[production]": { "credentials": { "destination": "S4HANA", "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER" } }
    }
  }
}
```

- **`kind`** — protocol: `odata-v2` (many S/4 APIs), `odata`/`odata-v4`, or `rest`.
- **`model`** — path to the imported model (no extension).
- **Per-profile `credentials`** — how to reach the system: a **destination** name (BTP) plus a
  `path`, or a direct `url`. Keep production/hybrid pointing at real systems; leave development
  to auto-mocking.

## Destinations vs url

- **Destination** (recommended on BTP): reference a destination configured in the subaccount;
  it carries the URL and auth. Bind the destination + connectivity services to the app.
- **url** (local/simple): a direct base URL, optionally with `[development]` credentials — but
  never commit real secrets.

See [destinations.md](destinations.md) for wiring destinations and authentication.

## Guidance

Configure the remote system **per profile** so the inner loop mocks, hybrid/production use the
real destination, and no credentials live in the repo.
