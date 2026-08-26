# Mocking remote services

Never depend on the real remote system for the inner loop or unit tests. CAP mocks imported
APIs for you.

## In-process (fast) — `cds watch`

Running `cds watch` auto-mocks imported APIs in the same in-memory DB as your local entities:

```
[cds] - mocking sap.capire.s4.business-partner {
  at: [ '/odata/v4/s4-business-partner' ],
  decl: 's4/external/API_BUSINESS_PARTNER.csn'
}
```

Provide mock data as CSV under a matching data folder so the mocked entities return rows. This
is the fastest loop — the remote API behaves like a local entity.

## Separate process (realistic) — `cds mock`

Run the remote API as its own mock server so the consumer connects over HTTP, closer to
production topology:

```sh
# Terminal 1: mock the API in its own process
cds mock apis/capire/s4.cds

# Terminal 2: start the consumer app (connects to the mock)
cds watch
# [cds] - connect to sap.capire.s4.business-partner > odata {
#   url: 'http://localhost:54476/odata/v4/s4-business-partner' }
```

## In tests

`cds.test` uses the in-process mock automatically, so service tests exercise your consumption
logic against mock data without touching the real system. Assert your mashup/handler behavior,
not the remote API itself.

## Guidance

Use in-process mocking for speed; switch to `cds mock` (separate process) when you need to
validate the real over-the-wire topology. Reserve real-system calls for **hybrid** runs and a
gated integration stage.
