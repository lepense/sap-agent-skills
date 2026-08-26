---
description: Configure CAP mock users for testing authorization locally.
---

Set up mock users so tests can exercise authentication and `@restrict`/`@requires` rules:

1. **Add mock users** under `cds.requires.auth` in the development profile (in `package.json`
   or `.cdsrc.json`). Give each user the roles you need to test. See `templates/mock-users.json`.
2. **Cover the roles** your services require — at minimum an authorized user and an
   unauthorized one, plus users for any instance-based `@restrict` conditions (e.g. a `buyer`
   whose rows differ).
3. **Use them in tests:** pass `{ auth: { username: '<user>', password: '' } }` per request, or
   set `cds.test(...).defaults.auth` for all requests.
4. **Assert both directions:** anonymous → 401, wrong role → 403, correct role → 200, and that
   instance-based rules filter rows correctly.
5. **Keep it dev-only:** mock auth belongs to the `[development]` profile; production uses
   XSUAA/IAS — never ship mock users as the production auth strategy.

Confirm by running the auth tests (see the `cap-write-service-test` command) and checking the
401/403/200 assertions pass.
