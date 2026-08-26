# CQL / CQN — querying

CAP queries are written in CQL and represented at runtime as CQN objects. The same query API
works across databases (SQLite, HANA, PostgreSQL) — never write database-specific SQL.

## Node.js (`cds.ql`)

```js
// SELECT
const list = await SELECT.from('Books').columns('ID','title').where({ stock: { '>': 0 } })
const one  = await SELECT.one.from('Books').where({ ID })

// INSERT / UPSERT
await INSERT.into('Authors').entries({ name: 'Kafka' })
await UPSERT.into('Books').entries(rows)

// UPDATE / DELETE
await UPDATE('Books').set({ stock: { '-=': 1 } }).where({ ID })
await DELETE.from('Books').where({ stock: 0 })
```

Expand associations with a projection function:

```js
const books = await SELECT.from('Books', b => { b`.*`, b.author(a => { a.name }) })
```

## Java (CQN builders)

```java
CqnSelect q = Select.from(Books_.class)
    .columns(b -> b.ID(), b -> b.title())
    .where(b -> b.stock().gt(0));
List<Books> books = persistenceService.run(q).listOf(Books.class);

Insert ins = Insert.into(Authors_.class).entry(Map.of("name", "Kafka"));
persistenceService.run(ins);
```

## Why CQN

Because queries are data (CQN), CAP can enforce authorization, add generic features
(pagination, `$expand`, ETags), and target any supported database without code changes.
Build queries with the API; do not concatenate SQL strings.
