# Resilience

Remote calls fail, time out, and rate-limit. Design consumption so your app degrades
gracefully instead of crashing.

## Handle errors

```js
const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
this.after('READ', 'Travels', async (rows) => {
  try {
    const names = await bupa.run(SELECT.from('A_BusinessPartner')
      .columns('BusinessPartner', 'BusinessPartnerName')
      .where({ BusinessPartner: ids }))
    // enrich...
  } catch (e) {
    req.warn?.(`Supplier names unavailable: ${e.message}`)   // degrade, don't fail the whole read
  }
})
```

Decide per use case whether a remote failure should **fail** the request (`req.reject`) or
**degrade** (return local data with a warning).

## Avoid N+1 remote reads

Never call the remote service inside a loop over local rows. Collect the keys and issue one
batched read:

```js
const ids = [...new Set(rows.map(r => r.supplier_ID).filter(Boolean))]
const suppliers = await bupa.run(SELECT.from('A_BusinessPartner').where({ BusinessPartner: ids }))
```

Push filters/selects down (`req.query` / `$filter`/`$select`) so you fetch only what you need.

## Timeouts and retries

- Set sensible HTTP timeouts on the remote service configuration; don't let a slow system hang
  your request indefinitely.
- Retry only **idempotent** reads, with backoff and a small cap; never blindly retry writes.
- Consider a short **cache** for slow, rarely-changing reference data.

## Guidance

Batch, push down, time out, and choose fail-vs-degrade deliberately. Test the failure paths
(mock the remote returning errors) — not just the happy path.
