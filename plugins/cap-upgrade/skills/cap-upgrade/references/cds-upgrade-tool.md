# The cds upgrade assistant

`cds upgrade` scans a CAP project for breaking changes and gives migration guidance toward the
current major (e.g. CDS 10). It is an assistant, not an automatic rewriter.

## Run it

```sh
npm i -g @sap/cds-dk    # get the latest design-time toolkit
cds upgrade             # scan the current project and report findings
```

## What it does

- Inspects your model, config, and dependencies for constructs that changed or were removed in
  the target major.
- Produces a **report of findings** with suggested steps.
- Provides incremental guidance (the tool has been evolving — treat its status/coverage as
  advisory and confirm against the official migration guide).

## How to use the output

1. Read every finding; map each to a concrete change in your code/config.
2. Apply changes in small, reviewable commits.
3. Re-run `cds upgrade` to confirm findings are resolved.
4. Build and run the full test suite after addressing the report.

## Guidance

Use `cds upgrade` as a checklist generator alongside the release migration guide — not as a
substitute for reading it. Never assume the tool caught everything; your regression tests are
the real proof the upgrade is safe.
