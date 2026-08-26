---
description: Diagnose and fix an ABAP CDS activation, data, or authorization problem.
---

Diagnose the CDS problem methodically:

1. **Classify:** activation/syntax error, wrong/missing data, or authorization (rows filtered
   out).
2. **Activation errors:**
   - Unknown field/alias, or `$projection` referencing a non-exposed field in an `on`
     condition.
   - Association cardinality/`on` mismatch; path expression over an unexposed association.
   - Aggregation without `group by`, or selecting a non-grouped, non-aggregated field.
3. **Wrong/missing data:**
   - Join type (`inner` drops unmatched rows — use `left outer` to keep them).
   - Client handling / filters removing rows; case-sensitive key mismatch.
   - Calculated field type/`cast` issues.
4. **Authorization (empty results):**
   - `@AccessControl.authorizationCheck: #CHECK` with a DCL whose `pfcg_auth` condition the
     user does not satisfy → rows filtered. Verify the user's authorizations and the DCL
     mapping; test with `#NOT_REQUIRED` temporarily to confirm it's a DCL issue.
5. **Reproduce with the CDS test double framework** to isolate calculation/join logic from
   live data.

Fix the root cause, re-activate, and confirm with the data preview and an ABAP Unit test.
