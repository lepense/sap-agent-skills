using { my.bookshop as my } from '../db/schema';

service ReviewsService {

  entity Reviews as projection on my.Reviews;

  // Declared event with a typed, lean payload.
  event Reviewed {
    subject : String;   // Book ID
    count   : Integer;
    rating  : Decimal;
  }

  // Custom broker topic (interop with external naming conventions).
  @topic: 'bookshop.reviews.reviewed.v1'
  event ReviewedExternal {
    subject : String;
    rating  : Decimal;
  }
}
