---
description: Create a RAP business object end to end — CDS model, behavior, service, and binding.
---

Guide the user through building a managed RAP business object in ADT. Steps:

1. **Data model:** create a root CDS view entity (`ZI_<Name>`) over the persistent table,
   with keys, fields, `@Semantics` for admin fields, and any `composition` to child entities.
   Use `templates/ZI_Book.ddls.asddls` as a shape.
2. **Behavior definition** (`.bdef`): `managed implementation in class zbp_i_<name>`; declare
   `create/update/delete`, `field ( readonly/mandatory )`, and the needed `determination`,
   `validation`, and `action`. Include the `mapping for` the DB table.
3. **Behavior implementation:** create the behavior pool class and implement each
   determination/validation/action with EML (`READ`/`MODIFY ENTITIES ... IN LOCAL MODE`),
   reporting problems via `failed`/`reported`. See `templates/zbp_i_book.clas.abap`.
4. **Service definition** (`.srvd`): `define service ZUI_<Name> { expose ZI_<Name> as <Alias>; }`.
5. **Service binding:** create an OData V4 – UI (Fiori) or Web API binding and **activate** it;
   preview the service.
6. **Tests:** add ABAP Unit tests for the behavior using the RAP test-double framework.

Keep it clean-core: released APIs only, managed BO unless you must wrap legacy persistence.
Prefer determinations/validations over UI-side logic.
