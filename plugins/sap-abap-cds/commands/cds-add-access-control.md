---
description: Add DCL row-level access control to an ABAP CDS view.
---

Add authorization to a CDS view via DCL (not in the view):

1. **Enable the check:** ensure the view has `@AccessControl.authorizationCheck: #CHECK`
   (`#NOT_REQUIRED` only for deliberate value-help/unprotected views).
2. **Create the DCL** (`.dcls`): `define role Z<View>_Access { grant select on Z<View> where
   ( <Field> ) = aspect pfcg_auth( <AuthObject>, <AuthField>, ACTVT = '<activity>' ); }`.
   Map view fields to the PFCG authorization object/fields. Use
   `templates/ZI_Book_Access.dcls`.
3. **Inherit for consumption views:** in the consumption view's DCL, use `where inheriting
   conditions from entity Z<InterfaceView>` so rules are defined once.
4. **Combine conditions** with `and`/`or` and add literal conditions where needed.
5. **Verify:** activate and test access with different authorizations (and a DCL-aware ABAP
   Unit test where possible).

Keep authorization logic in DCL, close to the interface view; let consumption views inherit.
Never embed authorization in the view body.
