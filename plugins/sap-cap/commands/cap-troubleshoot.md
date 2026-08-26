---
description: Diagnose and fix a failing SAP CAP build, deploy, or runtime error.
---

Diagnose the CAP problem the user is hitting. Work methodically:

1. **Capture the exact error.** Ask for the full command and output if not provided. Note
   whether it fails at **compile** (`cds build`/`cds compile`), **startup** (`cds watch`),
   or **deploy** (`cf deploy`/`cds up`).
2. **Reproduce locally.** Run `cds watch` and read the loaded-model log — a wrong/missing
   `using` path or namespace is the most common startup failure.
3. **Common causes to check:**
   - Model errors: unresolved `using` imports, duplicate namespaces, association `on`
     conditions referencing the wrong field.
   - DB init: malformed CSV (header must be `<namespace>-<Entity>` columns), missing key.
   - Auth: `@requires`/`@restrict` present but `xs-security.json` stale — re-run
     `cds compile --to xsuaa`.
   - Deploy: HANA/XSUAA service not bound, or `gen/` artifacts not rebuilt
     (`cds build --production`).
4. **Verify APIs via MCP.** If an API/annotation/flag is suspect, confirm it with the CAP
   MCP server rather than guessing.
5. **Fix and confirm.** Apply the minimal fix, re-run the failing command, and confirm it
   passes before moving on.
