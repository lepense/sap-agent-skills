# Error handling

Use class-based exceptions for procedural/OO code and RAP's `reported`/`failed` for behavior
implementations.

## Class-based exceptions

```abap
CLASS cx_pricing_error DEFINITION INHERITING FROM cx_static_check.
ENDCLASS.

METHOD price_for.
  IF iv_base < 0.
    RAISE EXCEPTION TYPE cx_pricing_error.
  ENDIF.
ENDMETHOD.
```

- Inherit from `CX_STATIC_CHECK` (must be declared/handled), `CX_DYNAMIC_CHECK`, or
  `CX_NO_CHECK` as appropriate.
- Catch with `TRY ... CATCH cx_pricing_error INTO DATA(lx). ... ENDTRY.`
- Never use `MESSAGE` for control flow; reserve messages for user-facing text.

## RAP messages

In behavior implementations, report problems through the framework structures, not
`MESSAGE`:

```abap
APPEND VALUE #( %tky = key-%tky ) TO failed-book.
APPEND VALUE #( %tky = key-%tky
  %msg = new_message_with_text(
           severity = if_abap_behv_message=>severity-error
           text     = 'Invalid book' ) ) TO reported-book.
```

- `failed` marks which instances could not be processed.
- `reported` carries messages back to the consumer (Fiori/OData).

## Messages and text

Keep user-facing text in **message classes** (translatable), referenced by id — never
hardcode strings. Log technical detail via the application log (BAL) where appropriate.
