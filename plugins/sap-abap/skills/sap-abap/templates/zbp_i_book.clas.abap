CLASS zbp_i_book DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF ZI_Book.
ENDCLASS.

CLASS zbp_i_book IMPLEMENTATION.
ENDCLASS.

"! Behavior pool (local handler class) for ZI_Book.
CLASS lhc_book DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS setDefaults FOR DETERMINE ON MODIFY
      IMPORTING keys FOR Book~setDefaults.
    METHODS validatePrice FOR VALIDATE ON SAVE
      IMPORTING keys FOR Book~validatePrice.
    METHODS applyDiscount FOR MODIFY
      IMPORTING keys FOR ACTION Book~applyDiscount RESULT result.
ENDCLASS.

CLASS lhc_book IMPLEMENTATION.

  METHOD setDefaults.
    MODIFY ENTITIES OF ZI_Book IN LOCAL MODE
      ENTITY Book UPDATE FIELDS ( Stock )
      WITH VALUE #( FOR key IN keys ( %tky = key-%tky Stock = 0 ) )
      REPORTED DATA(update_reported).
    reported = CORRESPONDING #( DEEP update_reported ).
  ENDMETHOD.

  METHOD validatePrice.
    READ ENTITIES OF ZI_Book IN LOCAL MODE
      ENTITY Book FIELDS ( Price ) WITH CORRESPONDING #( keys )
      RESULT DATA(books).
    LOOP AT books INTO DATA(book).
      IF book-Price <= 0.
        APPEND VALUE #( %tky = book-%tky ) TO failed-book.
        APPEND VALUE #( %tky = book-%tky
          %msg = new_message_with_text(
                   severity = if_abap_behv_message=>severity-error
                   text     = 'Price must be positive' ) ) TO reported-book.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD applyDiscount.
    READ ENTITIES OF ZI_Book IN LOCAL MODE
      ENTITY Book FIELDS ( Price ) WITH CORRESPONDING #( keys )
      RESULT DATA(books).
    MODIFY ENTITIES OF ZI_Book IN LOCAL MODE
      ENTITY Book UPDATE FIELDS ( Price )
      WITH VALUE #( FOR b IN books
        ( %tky = b-%tky
          Price = b-Price * ( 1 - keys[ KEY id %tky = b-%tky ]-%param-Percent / 100 ) ) ).
    READ ENTITIES OF ZI_Book IN LOCAL MODE
      ENTITY Book ALL FIELDS WITH CORRESPONDING #( books )
      RESULT DATA(updated).
    result = VALUE #( FOR u IN updated ( %tky = u-%tky %param = u ) ).
  ENDMETHOD.

ENDCLASS.
