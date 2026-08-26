# Associations and path expressions

Associations model reusable, navigable relationships and are the backbone of RAP and Fiori
navigation.

## Declaring

```abap
define view entity ZI_Book
  as select from zbook
  association [0..1] to ZI_Author as _Author on $projection.AuthorId = _Author.Id
  association [0..*] to ZI_Review as _Reviews on $projection.Id      = _Reviews.BookId
{
  key id        as Id,
      author_id as AuthorId,
      _Author,          -- expose the association
      _Reviews
}
```

- **Cardinality** `[min..max]` (e.g. `[0..1]`, `[1..*]`).
- **`$projection`** refers to the current view's exposed fields in the `on` condition.
- **Expose the alias** (`_Author`) in the field list so consumers can navigate it.

## Path expressions

Read associated fields inline:

```abap
{
  key id as Id,
      _Author.Name as AuthorName,        -- path expression (implicit join)
      _Author._Country.Name as CountryName
}
```

Path expressions generate the necessary joins. Use `[inner]`/`[ 1 : ... ]` filter cardinality
syntax to control join behavior when needed.

## Compositions (RAP)

In RAP root/child models, use `composition [card] of Child as _Child` on the root and
`association to parent Parent as _Parent` on the child to express parent-owned hierarchies for
deep create/update.

## Guidance

Prefer associations over hardcoded joins for anything a consumer may navigate or reuse; expose
only the associations that are part of the intended model.
