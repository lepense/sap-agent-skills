# Authentication and mock users

Local/test runs use CAP's **mocked** auth strategy (development profile). Configure mock users
and test both anonymous and authorized paths.

## Configure mock users

In `package.json` (or `.cdsrc.json`) under `cds.requires.auth`:

```json
"cds": {
  "requires": {
    "auth": {
      "[development]": {
        "kind": "mocked",
        "users": {
          "alice": { "roles": ["admin"] },
          "bob":   { "roles": ["Viewer"] },
          "viewer-user": { "password": "pass", "tenant": "CrazyCars", "roles": ["Viewer"] }
        }
      }
    }
  }
}
```

## Passing credentials in tests

```js
const { GET } = cds.test(__dirname + '/..')

// per request
await GET('/odata/v4/admin/Books', { auth: { username: 'alice', password: '' } })

// default for all requests
cds.test(__dirname + '/..').defaults.auth = { username: 'alice', password: '' }
```

## What to assert

- **Anonymous → 401** on a restricted service.
- **Authorized role → 200** for the same endpoint with the right mock user.
- **`@restrict` rules:** a user without the role gets **403**; instance-based `where`
  conditions (e.g. `buyer = $user`) return only permitted rows.

```js
it('denies anonymous access to AdminService', async () => {
  await expect(GET('/odata/v4/admin/Books')).to.be.rejectedWith(/401/)
})
it('allows admin', async () => {
  const { status } = await GET('/odata/v4/admin/Books', { auth: { username: 'alice', password: '' } })
  expect(status).to.equal(200)
})
```

Cover authorization explicitly — it is a common source of production bugs.
