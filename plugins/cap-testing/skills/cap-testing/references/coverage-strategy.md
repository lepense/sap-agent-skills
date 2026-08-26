# Coverage strategy: what to test where

Aim for a fast, layered suite. Put most logic coverage at the service level and prove the
protocol/auth with a few integration tests — the CAP shape of the test pyramid.

## Layers

| Layer | How | Covers | Speed |
|---|---|---|---|
| **Unit (programmatic)** | `cds.connect.to` + CQL / `send` | determinations, validations, actions, calculations | fastest |
| **Integration (HTTP)** | `GET`/`POST` from `cds.test` | routing, OData, annotations, auth wiring | fast (in-memory) |
| **Cloud integration** | `cds bind --exec` | real HANA/XSUAA behavior | slow — opt-in |

## What to always cover

- Every **custom handler** (before/on/after) — happy path and failure.
- Every **validation** — assert the rejection and its message/status.
- **Authorization:** anonymous → 401, wrong role → 403, instance-based `@restrict` filtering.
- **Key OData flows:** list/read/create/update/delete for the main entities, plus `$filter`/
  `$expand` where the app relies on them.

## What not to over-test

- Framework behavior CAP already guarantees (generic CRUD without custom logic) — a light
  smoke test is enough.
- Don't duplicate the same assertion at every layer; choose the cheapest layer that proves it.

## Guidance

Most tests programmatic (fast, focused), a thinner band of HTTP tests for protocol/auth, and a
minimal set of cloud-bound tests only where real-service behavior matters. Keep the default CI
suite offline and green.
