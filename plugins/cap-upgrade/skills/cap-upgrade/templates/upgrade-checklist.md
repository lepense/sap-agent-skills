# CAP major-upgrade checklist (e.g. CDS 9 -> 10)

- [ ] Read the target release's migration guide + notes; list breaking changes affecting us.
- [ ] Baseline: clean tree, `npm test` green on the current version.
- [ ] Record versions: `cds version`, `npm ls @sap/cds`.
- [ ] Raise Node.js/JDK to the new minimum (local, CI `setup-node`, deploy buildpack/image).
      - CDS 10: Node.js 22+ (24 recommended); set `"engines": { "node": ">=22" }`.
- [ ] Confirm the app still starts on the current CAP version with the new Node/JDK.
- [ ] Bump `@sap/cds` (+ `@sap/cds-dk`, `@cap-js/*`) to the target major; `npm install`.
- [ ] Run `cds upgrade`; resolve every finding in small commits.
- [ ] `cds build --production` succeeds.
- [ ] `npm test` (and `mvn test` for Java) green; re-check changed defaults (auth/DB/OData).
- [ ] Regenerate `xs-security.json` if auth changed (`cds compile --to xsuaa`).
- [ ] Hybrid run against real HANA/XSUAA (`cds bind` + `--profile hybrid`).
- [ ] Deploy to a test space/namespace; smoke-test; then promote.
- [ ] Update CHANGELOG and tag the release.
