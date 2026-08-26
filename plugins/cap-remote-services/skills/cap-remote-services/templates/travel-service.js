const cds = require('@sap/cds')

module.exports = class TravelService extends cds.ApplicationService {
  async init() {
    const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
    const { A_BusinessPartner } = bupa.entities

    // Delegate Suppliers reads to the remote service (push the query down).
    this.on('READ', 'Suppliers', (req) => bupa.run(req.query))

    // Enrich local Travels with remote supplier names — batched, resilient.
    this.after('READ', 'Travels', async (rows, req) => {
      const list = [rows].flat().filter(Boolean)
      const ids = [...new Set(list.map(t => t.supplier_ID).filter(Boolean))]
      if (!ids.length) return
      try {
        const suppliers = await bupa.run(
          SELECT.from(A_BusinessPartner)
            .columns('BusinessPartner', 'BusinessPartnerName')
            .where({ BusinessPartner: ids })
        )
        const byId = Object.fromEntries(
          suppliers.map(s => [s.BusinessPartner, s.BusinessPartnerName])
        )
        for (const t of list) t.supplierName = byId[t.supplier_ID]
      } catch (e) {
        req.warn?.(`Supplier names unavailable: ${e.message}`) // degrade, don't fail the read
      }
    })

    return super.init()
  }
}
