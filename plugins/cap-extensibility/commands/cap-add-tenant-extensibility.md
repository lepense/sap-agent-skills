---
description: Enable SaaS tenant extensibility (MTX) and govern what subscribers may extend.
---

Set up subscriber (tenant) extensibility for a multitenant CAP app. Steps:

1. **Enable multitenancy/MTX:** `cds add multitenancy` (adds the MTX sidecar) plus
   `cds add hana,xsuaa` and a deploy target — tenant extensions require the SaaS runtime.
2. **Configure the Extensibility service:** under `cds.requires` define the extension
   **allowlist** (which entities/services/namespaces are extensible), an **element prefix**
   (`x_`), and field limits. See `templates/extensibility-config.json`.
3. **Reserve capacity if needed:** apply an `extensible` aspect to entities that must absorb a
   known number of tenant fields.
4. **Keep the base extension-stable:** treat extensible entities/fields as a contract — don't
   rename/remove elements subscribers depend on.
5. **Document for subscribers:** what they can extend and how to author/push a tenant extension
   (see `templates/tenant-extension.cds`) via the MTX Extensibility API/tooling.
6. **Validate:** MTX rejects extensions that violate the allowlist; test onboarding + an
   extension in a hybrid setup.

Govern extensibility (allowlist, prefixes, limits) so tenant extensions stay isolated,
validated, and upgrade-safe. Never branch code per customer.
