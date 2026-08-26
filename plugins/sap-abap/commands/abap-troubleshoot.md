---
description: Diagnose and fix an ABAP / RAP activation, runtime, or service error.
---

Diagnose the ABAP problem methodically:

1. **Classify the failure:** activation error (CDS/`.bdef`/class syntax), RAP runtime
   (behavior implementation), OData service (binding/preview), or a short dump (ST22).
2. **Activation errors:**
   - CDS: check field/alias names, `composition`/`association to parent` consistency,
     annotations.
   - `.bdef`: implementation class name mismatch, missing `mapping`, operation not implemented
     in the pool.
3. **RAP runtime:**
   - Determinations/validations not firing: wrong trigger (`on modify`/`on save`) or entity
     alias.
   - Changes not persisted: not using `MODIFY ENTITIES ... IN LOCAL MODE`, or missing
     `mapping`.
   - Messages missing: not appended to `reported`/`failed`.
4. **OData service:** binding not activated, entity not exposed in the `.srvd`, or annotations
   missing for the Fiori preview.
5. **Short dumps:** read ST22 for the exception class and location; fix the root cause (often a
   failed `READ`/table expression `CX_SY_ITAB_LINE_NOT_FOUND`).
6. **Verify** with the service binding preview and ABAP Unit tests after the fix.

Keep fixes clean-core (released APIs). If uncertain about an object's release state, check its
API State in ADT.
