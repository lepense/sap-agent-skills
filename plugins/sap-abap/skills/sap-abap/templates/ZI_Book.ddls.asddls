@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Book (interface view)'
define root view entity ZI_Book
  as select from zbook
{
  key id            as Id,
      title         as Title,
      author        as Author,
      price         as Price,
      currency_code as CurrencyCode,
      stock         as Stock,
      @Semantics.user.createdBy: true
      created_by    as CreatedBy,
      @Semantics.systemDateTime.createdAt: true
      created_at    as CreatedAt,
      last_changed_by as LastChangedBy,
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at as LastChangedAt
}
