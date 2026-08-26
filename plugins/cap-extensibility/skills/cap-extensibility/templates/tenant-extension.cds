// A subscriber's tenant extension (pushed to the SaaS app via MTX).
// The base model is available under the '_base' namespace to the extension project.
using { my.bookshop.Books } from '_base';

extend Books with {
  x_customerNote : String;
  x_priority     : Integer @assert.range: [1, 5];
}

annotate Books with {
  x_priority @title: 'Priority';
  x_customerNote @title: 'Customer note';
}
