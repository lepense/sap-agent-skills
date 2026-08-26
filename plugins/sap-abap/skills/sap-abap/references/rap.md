# RAP: business object structure

A RAP business object (BO) is a stack of declarative artifacts plus one implementation class.

## The stack

1. **CDS data model** — a root view entity and optional child entities linked by
   `composition` / `association to parent`:

```abap
define root view entity ZI_Book
  as select from zbook
  composition [0..*] of ZI_BookReview as _Reviews
{
  key id,
  title,
  price,
  _Reviews
}
```

2. **Behavior definition** (`.bdef`) — declares implementation type and operations:

```abap
managed implementation in class zbp_i_book unique;
define behavior for ZI_Book alias Book
persistent table zbook
lock master
{
  create; update; delete;
  field ( readonly ) id;
  determination setDefaults on modify { create; }
  validation validatePrice on save { field price; }
  action discount result [1] $self;
}
```

3. **Behavior implementation** — the behavior pool class (`zbp_i_book`) implementing
   determinations, validations, and actions.

4. **Service definition** (`.srvd`) — exposes entities:

```abap
define service ZUI_Book {
  expose ZI_Book as Book;
  expose ZI_BookReview as Review;
}
```

5. **Service binding** — binds `ZUI_Book` to a protocol: **OData V4 – UI** (for Fiori
   elements) or **OData V4 – Web API** (for integration). Publish to activate the endpoint.

## Managed vs unmanaged

- **Managed** — the RAP framework provides the transactional persistence (CRUD on the
  `persistent table`). Default choice for greenfield BOs.
- **Unmanaged** — you implement persistence yourself (create/update/delete + save sequence),
  used to wrap existing legacy logic.

Prefer **managed**; drop to unmanaged only when wrapping non-RAP persistence.
