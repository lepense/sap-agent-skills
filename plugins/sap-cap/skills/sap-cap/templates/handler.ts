// srv/service.ts — custom logic for CatalogService (TypeScript).
// Generate typed entities with `cds typer` for full type safety.
import cds from '@sap/cds'

export default class CatalogService extends cds.ApplicationService {
  init() {
    const { Books } = this.entities

    this.before('CREATE', 'Books', (req) => {
      if ((req.data as any).stock < 0) return req.reject(400, 'Stock must not be negative')
    })

    this.on('submitOrder', async (req) => {
      const { book, quantity } = req.data as { book: string; quantity: number }
      const row = await SELECT.one.from(Books).columns('stock').where({ ID: book })
      if (!row) return req.error(404, `Book ${book} not found`)
      if (row.stock < quantity) return req.reject(409, 'Insufficient stock')
      await UPDATE(Books).set({ stock: { '-=': quantity } }).where({ ID: book })
      return { stock: row.stock - quantity }
    })

    this.after('READ', 'Books', (books) => {
      for (const b of [books].flat()) if (b?.stock === 0) b.title += ' (out of stock)'
    })

    return super.init()
  }
}
