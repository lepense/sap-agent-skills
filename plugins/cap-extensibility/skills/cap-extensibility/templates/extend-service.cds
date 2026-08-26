// Expose new extension entities through an existing service.
using { OrdersService } from '@capire/fiori';

// The extension entities must exist (e.g. defined in db/extension.cds).
extend service OrdersService with {
  entity x_Customers   as projection on extension.x_Customers;
  entity x_SalesRegion as projection on extension.x_SalesRegion;
}
