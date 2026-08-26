# Hybrid testing

Hybrid testing runs the app **locally** but bound to **real** Cloud Foundry service instances
(HANA, XSUAA, messaging). It catches integration issues before a full deploy.

## Bind to cloud services

```sh
cf login                      # target the space with the service instances
cds bind -a <app>             # auto-bind to the app's CF service instances
# or bind a specific service under a named profile:
cds bind -2 <service-instance> --profile hybrid
```

`cds bind` stores the binding in `.cdsrc-private.json` (keep it out of git).

## Run with the hybrid profile

```sh
# Node.js
cds watch --profile hybrid

# Java (from the srv module)
mvn cds:watch -Dspring-boot.run.profiles=hybrid
```

Now local code uses the cloud HANA/XSUAA — you can reproduce production data and auth behavior
locally.

## Tests against cloud services

```sh
cds bind --exec -- node --test
```

This injects the bindings (VCAP-style) for the test run, so integration tests exercise real
services. Keep these in an opt-in job, separate from the fast offline suite.

## Multitenancy (MTX sidecar)

```sh
cds bind -a <app>                       # main app
cd mtx/sidecar && cds bind -a <app-mtx> # sidecar
cds build --production                  # HDI artifacts
cds watch mtx/sidecar --profile hybrid  # run sidecar
cds watch --profile hybrid              # run main app (another terminal)
```

## Guidance

Use hybrid runs to validate HANA schema, XSUAA roles, and destinations before deploying.
Never commit binding secrets; `cds bind` keeps them in a private file.
