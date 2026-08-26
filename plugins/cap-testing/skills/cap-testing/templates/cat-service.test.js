// test/cat-service.test.js — HTTP + programmatic tests for CatalogService.
// Run with:  node --test   (or jest / mocha)
const cds = require('@sap/cds')
const { GET, POST, expect } = cds.test(__dirname + '/..')

describe('CatalogService', () => {

  it('serves the Books list (HTTP)', async () => {
    const { status, data } = await GET('/odata/v4/browse/Books')
    expect(status).to.equal(200)
    expect(data.value).to.be.an('array')
  })

  it('reads a single book (tagged template)', async () => {
    const res = await GET`/odata/v4/browse/Books/201`
    expect(res.status).to.equal(200)
    expect(res.data).to.contain({ ID: 201 })
  })

  it('decrements stock on submitOrder (programmatic)', async () => {
    const cat = await cds.connect.to('CatalogService')
    const before = await SELECT.one.from('CatalogService.Books').columns('stock').where({ ID: 201 })
    await cat.send('submitOrder', { book: 201, quantity: 2 })
    const after = await SELECT.one.from('CatalogService.Books').columns('stock').where({ ID: 201 })
    expect(after.stock).to.equal(before.stock - 2)
  })

  it('rejects an oversized order (409)', async () => {
    try {
      await POST('/odata/v4/browse/submitOrder', { book: 201, quantity: 999999 })
      expect.fail('expected the request to be rejected')
    } catch (e) {
      expect(e.response.status).to.equal(409)
    }
  })
})
