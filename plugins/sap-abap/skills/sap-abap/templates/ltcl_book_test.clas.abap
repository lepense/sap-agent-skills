"! Example ABAP Unit test for a plain class using dependency injection.
"! For RAP behavior, use the RAP test-double framework
"! (cl_botd_txbufdbl_bo_test_env) instead of hitting the database.
CLASS ltcl_pricing DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    METHODS applies_discount FOR TESTING.
    METHODS rejects_negative_base FOR TESTING.
ENDCLASS.

CLASS ltcl_pricing IMPLEMENTATION.

  METHOD applies_discount.
    DATA(lo_cut) = NEW lcl_pricing( io_policy = lcl_seasonal_discount=>create( ) ).
    cl_abap_unit_assert=>assert_equals(
      act = lo_cut->price_for( 100 )
      exp = 90
      msg = 'Seasonal discount should be 10%' ).
  ENDMETHOD.

  METHOD rejects_negative_base.
    DATA(lo_cut) = NEW lcl_pricing( io_policy = lcl_seasonal_discount=>create( ) ).
    TRY.
        lo_cut->price_for( -1 ).
        cl_abap_unit_assert=>fail( 'Expected cx_pricing_error' ).
      CATCH cx_pricing_error.
        " expected
    ENDTRY.
  ENDMETHOD.

ENDCLASS.
