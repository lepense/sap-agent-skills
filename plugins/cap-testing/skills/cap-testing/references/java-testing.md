# CAP Java testing

CAP Java uses **JUnit 5** with Spring Boot Test. Test handlers as units and OData endpoints as
integration tests.

## Unit-testing a handler

Inject or mock collaborators (e.g. `PersistenceService`) and invoke the handler logic:

```java
@ExtendWith(MockitoExtension.class)
class CatalogServiceHandlerTest {

  @Mock PersistenceService db;
  @InjectMocks CatalogServiceHandler handler;

  @Test
  void rejectsNegativePrice() {
    // arrange a create context with price = -1, then:
    assertThrows(ServiceException.class, () -> handler.validate(context));
  }
}
```

## Integration test with Spring Boot

```java
@SpringBootTest
@AutoConfigureMockMvc
class CatalogServiceIT {

  @Autowired MockMvc mvc;

  @Test
  void servesBooks() throws Exception {
    mvc.perform(get("/odata/v4/browse/Books"))
       .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "admin")
  void adminCanReadBooks() throws Exception {
    mvc.perform(get("/odata/v4/admin/Books"))
       .andExpect(status().isOk());
  }
}
```

## Setup

- Add the CAP/Spring Boot test starters to `srv/pom.xml` (`spring-boot-starter-test`, the CAP
  test dependencies).
- Use an in-memory H2/SQLite datasource for tests, mirroring the Node in-memory approach.
- Use `@WithMockUser` / security test support to exercise `@requires`/`@restrict`.

Cover handler logic with Mockito unit tests and protocol/auth with `MockMvc` integration
tests, mirroring the Node HTTP-vs-programmatic split.
