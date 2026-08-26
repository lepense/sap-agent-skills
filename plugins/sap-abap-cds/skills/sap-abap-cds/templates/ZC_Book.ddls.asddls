@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Book (consumption view)'
@Metadata.allowExtensions: true
define view entity ZC_Book
  as projection on ZI_Book
{
  key Id,
      Title,
      AuthorId,
      @Consumption.valueHelpDefinition: [ { entity: { name: 'ZI_Author', element: 'Id' } } ]
      AuthorName,
      Price,
      CurrencyCode,
      Stock
}
