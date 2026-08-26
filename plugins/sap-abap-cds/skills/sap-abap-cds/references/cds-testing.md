# Testing CDS views

Test CDS logic (joins, calculations, associations, DCL) deterministically with the **CDS test
double framework** — no dependency on real table contents.

## CDS test double framework

`cl_cds_test_environment` creates an isolated test environment that replaces the view's
underlying tables (and optionally dependent CDS views) with test data.

```abap
CLASS ltc_book_view DEFINITION FINAL FOR TESTING
  DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    CLASS-DATA environment TYPE REF TO if_cds_test_environment.
    CLASS-METHODS class_setup.
    CLASS-METHODS class_teardown.
    METHODS computes_inventory_value FOR TESTING.
ENDCLASS.

CLASS ltc_book_view IMPLEMENTATION.
  METHOD class_setup.
    environment = cl_cds_test_environment=>create( i_for_entity = 'ZI_Book' ).
  ENDMETHOD.
  METHOD class_teardown.
    environment->destroy( ).
  ENDMETHOD.
  METHOD computes_inventory_value.
    environment->clear_doubles( ).
    environment->insert_test_data( VALUE zbook_tab( ( id = '1' price = 10 stock = 3 ) ) ).
    SELECT FROM ZI_Book FIELDS InventoryValue WHERE Id = '1' INTO @DATA(lv_val).
    cl_abap_unit_assert=>assert_equals( act = lv_val exp = 30 ).
  ENDMETHOD.
ENDCLASS.
```

## What to test

- **Calculated fields** and CASE logic.
- **Joins/associations** producing the expected rows.
- **Aggregations** in analytical views.
- **DCL** access control (with the appropriate test environment for authorization).

## Guidance

Insert focused test data, assert the projected result, and keep tests `HARMLESS`/`SHORT` so
they run fast in ATC/CI. Prefer the framework over selecting from live tables, which is
non-deterministic.
