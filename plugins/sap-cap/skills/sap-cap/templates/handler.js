// srv/service.js — custom logic for CatalogService.
// Declarative-first: only what cannot be annotated lives here.
const cds = require('@sap/cds')

module.exports = class CatalogService extends cds.ApplicationService {
  init() {
    const { Books } = this.entities

    // Validation / defaulting: before the default handler runs.
    this.before('CREATE', 'Books', (req) => {
      if (req.data.stock < 0) return req.reject(400, 'Stock must not be negative')
    })

    // Custom action: replaces the default (there is none for actions).
    this.on('submitOrder', async (req) => {
      const { book, quantity } = req.data
      const row = await SELECT.one.from(Books).columns('stock').where({ ID: book })
      if (!row) return req.error(404, `Book ${book} not found`)
      if (row.stock < quantity) return req.reject(409, 'Insufficient stock')
      await UPDATE(Books).set({ stock: { '-=': quantity } }).where({ ID: book })
      return { stock: row.stock - quantity }
    })

    // Enrich results after read.
    this.after('READ', 'Books', (books) => {
      for (const b of [books].flat()) if (b?.stock === 0) b.title += ' (out of stock)'
    })

    return super.init()
  }
}
