using { API_BUSINESS_PARTNER as external } from '../srv/external/API_BUSINESS_PARTNER';
using { my.travel as my } from '../db/schema';

service TravelService {

  // Local entity combined with remote suppliers.
  entity Travels as projection on my.Travels;

  // Mashup: expose selected remote Business Partner fields as our own Suppliers.
  @readonly entity Suppliers as projection on external.A_BusinessPartner {
    key BusinessPartner      as ID,
        BusinessPartnerName  as name,
        BusinessPartnerCategory as category
  }
}
