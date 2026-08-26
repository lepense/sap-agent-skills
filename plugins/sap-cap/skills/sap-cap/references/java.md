# CAP Java reference

Runtime: CAP Java SDK on Spring Boot. Development loop: `mvn cds:watch` (not `cds watch`).

## Event handler classes

Handlers are Spring components implementing the `EventHandler` marker interface, bound to a
service with `@ServiceName`:

```java
import org.springframework.stereotype.Component;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.After;

@Component
@ServiceName("CatalogService")
public class CatalogServiceHandler implements EventHandler {

  @Before(event = "CREATE", entity = "CatalogService.Books")
  public void validate(/* CdsCreateEventContext ctx */) { /* validate / default */ }

  @On(event = "submitOrder")
  public void submit(/* EventContext ctx */) { /* implement custom action */ }

  @After(event = "READ", entity = "CatalogService.Books")
  public void enrich(/* List<Books> books */) { /* enrich results */ }
}
```

## Handler phases

- `@Before` — validation and defaulting.
- `@On` — implements the event; may call `context.proceed()` to delegate to remaining On
  handlers, then post-process. `proceed()` is valid **only** in On handlers (calling it in
  Before/After throws).
- `@After` — post-processing of results.

```java
@On(event = "myEvent")
void wrap(EventContext context) {
  context.put("param", "Adjusted"); // pre
  context.proceed();                // delegate
  context.put("result", 42);        // post
}
```

## Querying with CQN

Use the fluent CQN builders and `PersistenceService` (injected) — never raw SQL:

```java
CqnSelect q = Select.from(Books_.class).where(b -> b.stock().gt(0));
List<Books> result = persistenceService.run(q).listOf(Books.class);
```

## Reusing CDS models via Maven

Consume shared CDS models as Maven artifacts and add the `cds-maven-plugin` `resolve` goal so
they are extracted into `target/cds` for the CDS compiler.
