# Modern ABAP language

Write expression-oriented, cloud-safe ABAP. Prefer these constructs over legacy equivalents.

## Inline declarations and constructor expressions

```abap
DATA(lt_books) = VALUE tt_books(
  ( title = 'A' price = 10 )
  ( title = 'B' price = 20 ) ).

DATA(ls_out) = CORRESPONDING ty_out( ls_in ).

DATA(lv_text) = |Total: { lv_sum NUMBER = RAW } EUR|.
```

## Table expressions and FOR

```abap
" read a row (raises CX_SY_ITAB_LINE_NOT_FOUND if missing)
DATA(ls_book) = lt_books[ id = lv_id ].

" build a table from another
DATA(lt_titles) = VALUE string_table(
  FOR ls IN lt_books ( CONV string( ls-title ) ) ).
```

## Set-based database access

```abap
SELECT from /dmo/i_book
  fields id, title, price
  where price > @lv_min
  into table @DATA(lt_result).
```

- Select only the fields you need; never `SELECT *`.
- Never `SELECT` inside a `LOOP` — use `FOR ALL ENTRIES` or a join / CDS view instead.
- Use `@` host variables in Open SQL.

## Prefer

- `VALUE` / `CORRESPONDING` / `REDUCE` / `FILTER` over manual loops where they read clearly.
- String templates `|...|` over concatenation.
- `ASSERT` and class-based exceptions over `MESSAGE`-driven control flow.

Keep expressions readable — reach for a loop when a constructor expression would obscure
intent.
