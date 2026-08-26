// srv/src/test/java/.../CatalogServiceIT.java
// CAP Java integration test with Spring Boot + MockMvc.
package com.example.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CatalogServiceIT {

  @Autowired
  MockMvc mvc;

  @Test
  void servesBooks() throws Exception {
    mvc.perform(get("/odata/v4/browse/Books"))
       .andExpect(status().isOk());
  }

  @Test
  void deniesAnonymousAdminAccess() throws Exception {
    mvc.perform(get("/odata/v4/admin/Books"))
       .andExpect(status().isUnauthorized());
  }

  @Test
  @WithMockUser(username = "alice", roles = { "admin" })
  void adminCanReadBooks() throws Exception {
    mvc.perform(get("/odata/v4/admin/Books"))
       .andExpect(status().isOk());
  }
}
