---
description: Preview a Fiori elements app with mock or backend data, and troubleshoot preview issues.
---

Preview the user's Fiori elements app and fix preview problems:

1. **Mock preview first:** `npm run start-mock` (uses `ui5-mock.yaml` + the
   `sap-fe-mockserver` middleware serving `localService/metadata.xml` + mock data). Fast and
   deterministic — validate new pages/annotations here.
2. **Backend preview:** `npm start` (proxies to the configured system per `ui5.yaml`).
3. **Common issues:**
   - **Blank page:** wrong `sap.app.id`/namespace, or missing `sap.fe.templates` dependency.
   - **No data (mock):** metadata/mockdata path in `ui5-mock.yaml` wrong, or entity set name
     mismatch.
   - **No data (backend):** proxy/destination misconfigured, service URL wrong, or auth
     needed.
   - **Annotations not reflected:** annotation file not referenced in `manifest.json`
     `dataSources`, or targeting the wrong entity type.
4. **Edit mock data** under `localService/data` to exercise edge cases (empty list, long
   text, many rows).

Report what you changed and confirm the app renders with the expected columns/pages.
