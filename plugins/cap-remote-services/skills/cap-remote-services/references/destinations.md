# Destinations and authentication

On SAP BTP, a **destination** carries the remote system's URL and authentication, keeping
credentials out of your app.

## Wiring

1. Configure a **destination** (e.g. `S4HANA`) in the BTP subaccount (Destinations service):
   URL and an auth type (BasicAuthentication, OAuth2ClientCredentials, PrincipalPropagation,
   OAuth2SAMLBearerAssertion, …).
2. Bind the **destination** and **connectivity** (for on-premise via Cloud Connector) services
   to your app in `mta.yaml`.
3. Reference the destination in the required service credentials:

```jsonc
"API_BUSINESS_PARTNER": {
  "kind": "odata-v2",
  "model": "srv/external/API_BUSINESS_PARTNER",
  "[production]": { "credentials": { "destination": "S4HANA", "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER" } }
}
```

## Auth flows

- **Technical user** (BasicAuthentication / OAuth2ClientCredentials) — app-to-system, one
  identity for all users.
- **Principal propagation / OAuth2SAMLBearer** — forward the logged-in user's identity to the
  remote system so its authorizations apply per user.

## On-premise systems

Reach on-premise S/4HANA through the **SAP Cloud Connector** + the connectivity service; the
destination is marked as on-premise and routed via the Cloud Connector.

## Local / hybrid

For hybrid runs, bind the destination service (`cds bind`) so local code uses the real
destination. Never place real credentials in the repo; for a quick local test you may use a
`url` with `[development]` credentials from an untracked file.

## Guidance

Prefer destinations over embedded URLs/credentials; choose principal propagation when the
remote system must enforce per-user authorizations.
