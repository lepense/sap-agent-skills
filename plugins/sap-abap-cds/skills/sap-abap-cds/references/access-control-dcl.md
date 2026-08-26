# Access control (DCL)

Row-level authorization for CDS is declared in a separate **Data Control Language (DCL)**
access control object (`.dcls`) — never inside the view. The view opts in with
`@AccessControl.authorizationCheck: #CHECK`.

## Defining a role

```abap
@EndUserText.label: 'Access control for ZI_Book'
@MappingRole: true
define role ZI_Book_Access {
  grant select on ZI_Book
    where ( AuthorId ) = aspect pfcg_auth( ZAUTH_BOOK, AUTHORID, ACTVT = '03' );
}
```

- **`grant select on <View>`** — the protected CDS entity.
- **`where`** — the authorization condition mapping view fields to PFCG authorization fields
  via `aspect pfcg_auth(...)`.
- **`ACTVT`** — activity (e.g. `'03'` display).

## Inheritance

Reuse another entity's rules with `inherit`:

```abap
grant select on ZC_Book
  where inheriting conditions from entity ZI_Book;
```

## Combining conditions

Combine literal, PFCG, and inherited conditions with `and`/`or`, and use `where` on
associations for path-based checks.

## Authorization check values

- `#CHECK` — enforce the DCL when it exists.
- `#NOT_REQUIRED` — no check (use deliberately, e.g. pure value-help views).
- `#NOT_ALLOWED` — reject if a check would be needed.

## Guidance

Declare authorization once, close to the interface view, and let consumption views inherit it.
Keep the view definition free of authorization logic.
