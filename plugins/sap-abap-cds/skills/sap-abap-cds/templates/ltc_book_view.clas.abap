"! ABAP Unit test for the ZI_Book CDS view using the CDS test double framework.
CLASS ltc_book_view DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

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
    environment->insert_test_data(
      VALUE zbook_tab( ( id = '1' price = 10 stock = 3 currency_code = 'EUR' ) ) ).

    SELECT SINGLE FROM ZI_Book FIELDS InventoryValue
      WHERE Id = '1' INTO @DATA(lv_value).

    cl_abap_unit_assert=>assert_equals(
      act = lv_value
      exp = 30
      msg = 'InventoryValue should be price * stock' ).
  ENDMETHOD.

ENDCLASS.
