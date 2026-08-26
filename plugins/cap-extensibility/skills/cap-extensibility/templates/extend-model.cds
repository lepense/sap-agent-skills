// Add fields and associations to an existing entity — from your own file.
using { my.bookshop.Books } from '@capire/bookshop';

extend Books with {
  ISBN     : String(17);
  supplier : Association to Suppliers;
  x_note   : String;                 // extension field (x_ prefix by convention)
}

entity Suppliers : cuid, managed {
  name : String;
}
