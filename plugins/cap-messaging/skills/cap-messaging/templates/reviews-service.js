const cds = require('@sap/cds')

// Emitter: publishes a "Reviewed" event after a review is written.
module.exports = class ReviewsService extends cds.ApplicationService {
  async init() {
    this.after(['CREATE', 'UPDATE'], 'Reviews', async (review) => {
      // Emitted through the service -> uses the (persistent) outbox:
      // only delivered if this transaction commits.
      await this.emit('Reviewed', {
        subject: review.subject,
        rating:  review.rating
      })
    })
    return super.init()
  }
}
