// Override labels/UI/security metadata without editing the base model.
using { CatalogService } from '@capire/bookshop';

// Entity-level label
annotate CatalogService.Books with @title: 'Publications';

// Element-level labels
annotate CatalogService.Books with {
  title  @title: 'Name';
  author @title: 'Written by';
}

// Surface an extension field in the Fiori list
annotate CatalogService.Books with @(UI.LineItem: [
  { Value: title },
  { Value: author.name },
  { Value: x_note, Label: 'Note' }
]);
