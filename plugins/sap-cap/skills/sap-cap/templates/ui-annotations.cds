using { CatalogService } from '../srv/service';

annotate CatalogService.Books with @title: '{i18n>Book}' {
  title  @title: '{i18n>Title}';
  author @title: '{i18n>Author}' @Common.Text: author.name;
  price  @title: '{i18n>Price}';
  stock  @title: '{i18n>Stock}';
}

annotate CatalogService.Books with @(UI: {
  SelectionFields: [ author_ID, price ],
  LineItem: [
    { Value: title },
    { Value: author.name, Label: '{i18n>Author}' },
    { Value: price },
    { Value: currency.symbol, Label: ' ' },
    { Value: stock }
  ]
});

annotate CatalogService.Books with {
  author @Common.ValueList: { CollectionPath: 'Authors' };
}
