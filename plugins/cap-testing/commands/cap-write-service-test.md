---
description: Write tests for a CAP service — HTTP + programmatic, with auth and edge cases.
---

Write a focused test suite for a CAP service. Steps:

1. **Set up the harness:** in a test file, `const { GET, POST, expect } = cds.test(<projectRoot>)`.
   Use `node --test` (or jest/mocha). See `templates/cat-service.test.js`.
2. **Programmatic tests (most coverage):** `cds.connect.to('<Service>')`, then drive each
   custom handler — determinations, validations, actions — asserting the effect with CQL
   reads. Cover the failure path (rejections) too.
3. **HTTP tests (protocol/auth):** a few `GET`/`POST` calls to prove routing, OData options
   (`$filter`/`$expand`), and status codes for the main flows.
4. **Authorization:** for restricted services, test anonymous → 401, wrong role → 403, and
   authorized → 200 using mock users (`{ auth: { username, password: '' } }`). See
   `templates/admin-auth.test.js`.
5. **Test data:** rely on CSV fixtures for the baseline; insert per-test data for edge cases;
   keep tests independent.
6. **Java projects:** add JUnit + Spring `MockMvc` integration tests and Mockito handler unit
   tests — see `templates/CatalogServiceIT.java`.
7. **Run:** `node --test` (or `npm test`); confirm green.

Bias toward programmatic tests for logic and a thin band of HTTP tests for the protocol. Always
assert negative cases, not just happy paths.
