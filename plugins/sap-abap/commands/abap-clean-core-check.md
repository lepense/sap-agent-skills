---
description: Review ABAP code for clean-core / ABAP Cloud compliance.
---

Review the user's ABAP for clean-core compliance and report pass/fail per item:

1. **Released APIs only:** every consumed SAP object (CDS view, class, interface, table,
   function) has a *Released* API state. Flag any use of unreleased/internal objects and
   suggest a released alternative.
2. **No modifications:** no changes to SAP repository objects; extensions go through
   sanctioned points (BAdI, CDS/RAP extensibility).
3. **Language scope:** code compiles under *ABAP for Cloud Development* — no forbidden
   statements or direct kernel/DB access.
4. **Modern patterns:** RAP + OO instead of classic reports/module pools; set-based SQL (no
   `SELECT *`, no `SELECT` in `LOOP`).
5. **Namespace & decoupling:** custom code in the customer namespace, decoupled from SAP
   internals.
6. **ATC:** recommend running the ABAP Test Cockpit with the clean-core / released-API check
   variant and fixing findings.

Prefer running ATC in ADT for authoritative results. Summarize violations with the specific
object and the released replacement to use.
