## What & why

Describe the change and which plugin/skill it affects.

## Checklist

- [ ] Content is authored fresh (no copying from GPL-licensed sources) and focused on CAP.
- [ ] Version-sensitive claims are recorded in `ledger/sources.json` with an official source.
- [ ] Added/updated eval scenarios under the skill's `evals/`.
- [ ] Ran the full gate locally:
  - [ ] `npm test`
  - [ ] `npm run validate`
  - [ ] `npm run evals`
  - [ ] `npm run sync` (and committed the regenerated `.claude-plugin/marketplace.json`)

## How verified

Which official docs / commands confirm the change is correct?
