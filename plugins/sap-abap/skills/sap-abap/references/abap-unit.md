# ABAP Unit testing

ABAP Unit is the built-in unit test framework. Test classes live locally in the tested
object (or a dedicated test include) and run in ADT's test runner and in ATC/CI.

## Local test class

```abap
CLASS ltcl_pricing DEFINITION FINAL FOR TESTING
  DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    METHODS applies_seasonal_discount FOR TESTING.
ENDCLASS.

CLASS ltcl_pricing IMPLEMENTATION.
  METHOD applies_seasonal_discount.
    DATA(lo_cut) = NEW lcl_pricing( io_policy = lcl_seasonal_discount=>create( ) ).
    cl_abap_unit_assert=>assert_equals(
      act = lo_cut->price_for( 100 )
      exp = 90 ).
  ENDMETHOD.
ENDCLASS.
```

- `FOR TESTING` marks test methods; `cl_abap_unit_assert` provides assertions.
- `DURATION` and `RISK LEVEL` classify the test.

## Test doubles

- **ABAP OO test doubles:** `cl_abap_testdouble` to stub interfaces injected via DI.
- **CDS test double framework:** `cl_cds_test_environment` to provide mock data for CDS
  views under test.
- **RAP test double framework:** `cl_botd_txbufdbl_bo_test_env` / EML test doubles to test
  behavior implementations without touching the database.

## Guidance

Design classes with dependency injection so collaborators can be doubled. Cover every RAP
determination, validation, and action with tests. Keep tests `HARMLESS`/`SHORT` where
possible so they run fast in CI (ATC).
