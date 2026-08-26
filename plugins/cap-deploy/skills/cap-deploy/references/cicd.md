# CI/CD

Automate build, test, and deploy so releases are repeatable. The same `cds build` / `mbt` /
`cf deploy` (or `cds up -2 k8s`) commands run in a pipeline.

## Pipeline stages

1. **Install & build:** `npm ci` → `cds build --production`.
2. **Test:** `npm test` (offline unit/integration); optionally `cds bind --exec -- node --test`
   for cloud-bound tests in a gated stage.
3. **Package:** `mbt build` (CF) or image build (`cds up -2 k8s` builds images).
4. **Deploy:** `cf deploy mta_archives/*.mtar` (CF) or `helm upgrade --install` / `cds up -2 k8s`
   (Kyma).

## GitHub Actions (Cloud Foundry) sketch

```yaml
name: deploy
on: { push: { branches: [ main ] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm test
      - run: npx cds build --production
      - run: npm i -g mbt && mbt build
      - name: Deploy to CF
        run: |
          cf api "$CF_API"
          cf auth "$CF_USER" "$CF_PASSWORD"
          cf target -o "$CF_ORG" -s "$CF_SPACE"
          cf deploy mta_archives/*.mtar -f
        env:
          CF_API: ${{ secrets.CF_API }}
          CF_USER: ${{ secrets.CF_USER }}
          CF_PASSWORD: ${{ secrets.CF_PASSWORD }}
          CF_ORG: ${{ secrets.CF_ORG }}
          CF_SPACE: ${{ secrets.CF_SPACE }}
```

## Guidance

- Store all credentials as CI secrets — never in the repo.
- Use a technical/CI user (or a service key) for CF/Kyma auth, not a personal login.
- Promote through spaces/namespaces (dev → test → prod) with environment-specific `.mtaext`
  or Helm values.
- Keep the deploy gated on a green test run.
