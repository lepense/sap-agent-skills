# RAP behavior: determinations, validations, actions

Business logic in a RAP BO is declared in the behavior definition and implemented in the
behavior pool. Three main building blocks:

## Determinations

Derive/adjust data automatically on a trigger (`on modify` / `on save`). Use for defaults and
computed fields.

```abap
determination setDefaults on modify { create; }
```

Implementation reads the affected keys, computes values, and modifies the entity via
`MODIFY ENTITIES`.

## Validations

Check consistency and reject invalid states on a trigger, reporting messages.

```abap
validation validatePrice on save { field price; create; }
```

Implementation appends to `reported` and marks keys in `failed` when invalid:

```abap
METHOD validatePrice.
  READ ENTITIES OF zi_book IN LOCAL MODE
    ENTITY Book FIELDS ( price ) WITH CORRESPONDING #( keys )
    RESULT DATA(books).
  LOOP AT books INTO DATA(book).
    IF book-price <= 0.
      APPEND VALUE #( %tky = book-%tky ) TO failed-book.
      APPEND VALUE #( %tky = book-%tky
        %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error
                                      text = 'Price must be positive' ) ) TO reported-book.
    ENDIF.
  ENDLOOP.
ENDMETHOD.
```

## Actions

Custom operations beyond CRUD, callable from the UI or API.

```abap
action discount result [1] $self;
```

Implementation uses `MODIFY ENTITIES` to change state and returns the updated instance via
`result`.

## EML

Behavior implementations manipulate BOs through **ABAP EML** (Entity Manipulation Language):
`READ ENTITIES`, `MODIFY ENTITIES`, `COMMIT ENTITIES`. Always operate `IN LOCAL MODE` inside
the BO's own handlers to bypass its authorization/feature checks appropriately.
