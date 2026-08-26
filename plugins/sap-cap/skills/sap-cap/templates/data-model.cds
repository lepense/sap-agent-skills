namespace my.bookshop;

using { cuid, managed, Currency } from '@sap/cds/common';

entity Books : cuid, managed {
  title    : localized String(111)  @mandatory;
  descr    : localized String;
  stock    : Integer                @assert.range: [0, 99999];
  price    : Decimal(9,2);
  currency : Currency;
  author   : Association to Authors  @mandatory;
  genre    : Association to Genres;
}

entity Authors : cuid, managed {
  name  : String  @mandatory;
  books : Association to many Books on books.author = $self;
}

entity Genres : cuid {
  name     : localized String  @mandatory;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
