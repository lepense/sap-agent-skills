// test/admin-auth.test.js — authorization tests for the restricted AdminService.
const cds = require('@sap/cds')
const { GET, expect } = cds.test(__dirname + '/..')

describe('AdminService authorization', () => {

  it('denies anonymous access (401)', async () => {
    await expect(GET('/odata/v4/admin/Books')).to.be.rejectedWith(/401/)
  })

  it('allows an admin user (200)', async () => {
    const { status } = await GET('/odata/v4/admin/Books', {
      auth: { username: 'alice', password: '' }
    })
    expect(status).to.equal(200)
  })

  it('forbids a viewer without the admin role (403)', async () => {
    await expect(
      GET('/odata/v4/admin/Books', { auth: { username: 'bob', password: '' } })
    ).to.be.rejectedWith(/403/)
  })
})
