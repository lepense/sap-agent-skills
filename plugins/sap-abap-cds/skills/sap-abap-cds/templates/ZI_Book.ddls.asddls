@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Book (interface view)'
@Metadata.allowExtensions: true
define view entity ZI_Book
  as select from zbook
  association [0..1] to ZI_Author as _Author on $projection.AuthorId = _Author.Id
{
  key id            as Id,
      title         as Title,
      author_id     as AuthorId,

      @Semantics.amount.currencyCode: 'CurrencyCode'
      price         as Price,
      @Semantics.currencyCode: true
      currency_code as CurrencyCode,

      stock         as Stock,
      price * stock as InventoryValue,

      _Author.Name  as AuthorName,

      _Author
}
