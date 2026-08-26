---
description: Create an ABAP CDS view entity following VDM layering (interface + consumption).
---

Create an ABAP CDS model for the user, layered per the VDM:

1. **Interface view (`ZI_<Name>`):** `define view entity` selecting from the table(s). Add
   keys with CamelCase aliases, calculated fields, and `association [card] to ... as _Alias
   on ...` for relationships. Add `@Semantics.*` for amounts/quantities/currencies and
   `@AccessControl.authorizationCheck: #CHECK`. No UI annotations here. Use
   `templates/ZI_Book.ddls.asddls`.
2. **Consumption view (`ZC_<Name>`):** `as projection on ZI_<Name>` exposing the fields a
   consumer needs; add `@Consumption.valueHelpDefinition` and other consumer-specific
   annotations. Use `templates/ZC_Book.ddls.asddls`.
3. **UI annotations:** put `@UI.*` in a **metadata extension** (`.ddlx`) targeting the
   consumption view — keep the view definition clean. Use `templates/ZC_Book.ddlx.asddlxs`.
4. **Access control:** create a DCL (`.dcls`) `define role` granting `select` with a
   `pfcg_auth` condition. Use `templates/ZI_Book_Access.dcls`.
5. **Test:** add an ABAP Unit test using `cl_cds_test_environment` for calculations/joins.

Prefer `DEFINE VIEW ENTITY`, associations over joins, and metadata extensions for UI. Verify
activation and preview in ADT.
