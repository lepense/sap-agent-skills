const cds = require('@sap/cds')

// Subscriber: reacts to the Reviewed event and to an external S/4 event.
// Handlers are idempotent because brokers deliver at-least-once.
module.exports = async function () {

  // Subscribe to another CAP service's declared event.
  const reviews = await cds.connect.to('ReviewsService')
  reviews.on('Reviewed', async (msg) => {
    const { subject, rating } = msg.data
    // Idempotent: setting the rating is naturally idempotent.
    await UPDATE('sap.capire.bookshop.Books').set({ rating }).where({ ID: subject })
  })

  // Low-level: subscribe directly to an external (e.g. S/4) event type.
  const messaging = await cds.connect.to('messaging')
  messaging.on('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', async (msg) => {
    const { BusinessPartner } = msg.data
    // e.g. refresh a local replica of the business partner (idempotent upsert)
    await UPSERT.into('Suppliers').entries({ ID: BusinessPartner })
  })
}
