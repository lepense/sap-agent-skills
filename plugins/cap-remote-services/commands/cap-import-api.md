---
description: Import an external OData API into a CAP project and configure it as a remote service.
---

Import and wire an external API for the user. Steps:

1. **Get the EDMX:** the user downloads the API's OData `$metadata` (`.edmx`), e.g. from the
   SAP Business Accelerator Hub (Business Partner, etc.).
2. **Import:** `cds import <file>.edmx` (add `--as cds` for a human-readable model). Artifacts
   land in `srv/external/` and the service is added to `package.json > cds.requires`.
3. **Configure `cds.requires`:** set `kind` (`odata-v2` for many S/4 APIs, `odata`/`odata-v4`,
   or `rest`), `model` (path without extension), and per-profile `credentials` (a BTP
   `destination` + `path`, or a `url`). Use `templates/package-requires.json`.
4. **Destination (BTP):** ensure a destination exists and bind the destination/connectivity
   services for hybrid/production; for on-premise, route via the Cloud Connector.
5. **Verify locally:** `cds watch` — CAP auto-mocks the imported API; confirm it connects/mocks
   in the log. Add mock CSV data if you need rows.

Keep imported artifacts under `srv/external/` and never hand-edit generated `.csn`. Configure
the real system per profile so dev mocks and production uses the destination.
