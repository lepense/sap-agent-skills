# Object-oriented ABAP

New logic belongs in classes and interfaces, not reports or function modules.

## Classes and interfaces

```abap
INTERFACE if_discount_policy.
  METHODS apply IMPORTING price TYPE /dmo/price RETURNING VALUE(result) TYPE /dmo/price.
ENDINTERFACE.

CLASS lcl_seasonal_discount DEFINITION.
  PUBLIC SECTION.
    INTERFACES if_discount_policy.
ENDCLASS.

CLASS lcl_seasonal_discount IMPLEMENTATION.
  METHOD if_discount_policy~apply.
    result = price * '0.9'.
  ENDMETHOD.
ENDCLASS.
```

## Principles

- **Small, single-purpose methods** with clear names; keep classes focused.
- **Program to interfaces** so behavior can be swapped and tested.
- **Dependency injection:** pass collaborators via `CONSTRUCTOR` parameters or factory
  methods rather than instantiating dependencies inline — this makes ABAP Unit testing with
  test doubles possible.
- **Encapsulate state**; prefer `PRIVATE`/`PROTECTED` and expose behavior, not data.
- **No global mutable state** (global data in reports/includes) for new code.

## Factories and DI

```abap
DATA(lo_service) = NEW lcl_pricing( io_policy = lcl_seasonal_discount=>create( ) ).
```

Inject the policy so a test can pass a double. Composition over inheritance; use inheritance
only for genuine "is-a" relationships.
