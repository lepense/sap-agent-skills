---
description: Build and deploy a CAP app to Cloud Foundry (MTA), or to Kyma (Helm).
---

Deploy the user's prepared CAP app. Confirm the target first.

**Cloud Foundry (MTA):**
1. `cds build --production` — generate deployables.
2. `mbt build` — produce `mta_archives/<app>_<version>.mtar` (install `mbt` if missing).
3. `cf login` and target the org/space.
4. `cf deploy mta_archives/<app>_<version>.mtar` (or the convenience `cds up`).
5. Verify: `cf apps`, hit the approuter URL, check logs with `cf logs <app> --recent`.

**Kyma (Helm):**
1. `cds add kyma` if not already (interactive: cluster domain + registry).
2. Ensure Docker, `kubectl`/`helm`, kubeconfig, and registry access.
3. `cds up -2 k8s` (add `-n <namespace>` to target a namespace).
4. Verify: `kubectl get pods`, check the API rule/host, review pod logs.

Before deploying, run a **hybrid** check (`cds bind` + `cds watch --profile hybrid`) to catch
HANA/XSUAA issues locally. Never deploy the raw project — always the `cds build --production`
output. Report the deployed URL and how you verified it.
