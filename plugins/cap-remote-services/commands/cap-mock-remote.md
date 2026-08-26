---
description: Mock an imported remote service for local development and tests.
---

Set up mocking so the app never calls the real remote system in the inner loop:

1. **In-process (fastest):** just run `cds watch` — CAP auto-mocks imported APIs in the shared
   in-memory DB. Confirm the `mocking <service>` log line.
2. **Mock data:** provide CSV for the mocked remote entities (matching the imported model's
   namespace/entity) so reads return rows to develop against.
3. **Separate process (realistic):** run the API as its own mock server —
   `cds mock srv/external/<API>` in one terminal, `cds watch` (consumer) in another. The
   consumer connects over HTTP (check the `connect to ... url: http://localhost:...` log).
4. **In tests:** `cds.test` uses the in-process mock automatically; assert your consumption
   logic (mashups, enrichment, resilience), not the remote API itself.
5. **Real system:** reserve for **hybrid** runs (`cds bind` + `--profile hybrid`) and a gated
   integration stage — never the default loop or unit tests.

Choose in-process for speed and `cds mock` when you need the real over-the-wire topology.
