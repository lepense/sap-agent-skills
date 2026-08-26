# Verification policy

The value of this repo is **verified** SAP guidance — not plausible-sounding text. Every
version-sensitive claim must be traceable to an official source and recorded in the
source-verification ledger.

## The ledger

`ledger/sources.json` holds one entry per version-sensitive claim:

```json
{
  "plugin": "sap-cap",
  "claim": "cds add mta scaffolds a Cloud Foundry deployment descriptor",
  "package": "@sap/cds",
  "version": "9.x",
  "source": "https://cap.cloud.sap/docs/guides/deployment/",
  "verifiedOn": "2026-08-26",
  "method": "mcp"
}
```

`ledger.schema.json` enforces the shape; CI fails on violations.

- **`method: "mcp"`** — verified live against the SAP CAP MCP server
  (`search_docs` / `search_model`).
- **`method: "manual"`** — verified by a human against official docs or the package
  registry, with the URL recorded in `source`.

## What must be verified

- Package names and version ranges (`@sap/cds`, `@cap-js/*`, tool CLIs).
- CLI commands and their flags.
- API/annotation names that could be hallucinated.

Conceptual guidance (e.g. "prefer declarative annotations over custom handlers") does not
need a ledger entry, but must not contradict verified facts.

## Verifying CAP content via MCP

In an environment with the SAP CAP MCP server, use `search_docs` for concepts/CLI and
`search_model` for CDS model questions before writing version-sensitive text. Record each
check as a ledger entry with `method: "mcp"`.

## Staleness

Version pins are re-verified quarterly. When a re-verification changes a fact, update the
guidance **and** bump `verifiedOn` in the corresponding ledger entry in the same commit.
