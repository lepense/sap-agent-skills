using { my.bookshop as my } from '../db/data-model';

/**
 * Public catalog: read-only projection for end users.
 */
service CatalogService @(path: '/browse') {
  @readonly entity Books   as projection on my.Books;
  @readonly entity Authors as projection on my.Authors;

  // Custom action implemented by an `on` handler (see handler template).
  action submitOrder(book : UUID, quantity : Integer) returns { stock : Integer };
}

/**
 * Admin service: full write access, restricted to the `admin` role.
 */
service AdminService @(requires: 'admin') {
  entity Books   as projection on my.Books;
  entity Authors as projection on my.Authors;
  entity Genres  as projection on my.Genres;
}
