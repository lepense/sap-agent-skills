# CAP Java upgrade

CAP Java centralizes versions and has a few migration specifics beyond the Node runtime.

## The services BOM

Keep all `com.sap.cds` modules in sync via the **`cds-services-bom`**, controlled by a single
property:

```xml
<properties>
  <cds.services.version>5.0.0</cds.services.version>
</properties>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.sap.cds</groupId>
      <artifactId>cds-services-bom</artifactId>
      <version>${cds.services.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

Upgrading = bump `cds.services.version` (and the `cds-maven-plugin` version), then
`mvn clean install`.

## Prefer npm ci over install-cdsdk

Migrate from the deprecated `cds-maven-plugin` `install-cdsdk` goal to installing `@sap/cds-dk`
via `npm ci`:

1. Remove the `install-cdsdk` execution and the `cds.install-cdsdk.version` property from
   `srv/pom.xml`.
2. Add a `cds-maven-plugin` execution running the `npm` goal with `ci`.
3. Add `@sap/cds-dk` to `package.json` `devDependencies`; run `npm install` to create the
   lockfile.
4. `mvn clean install` to verify.

## JDK and Spring

Check the target CAP Java release's **JDK** minimum and the **Spring Boot** version it aligns
with; update the Maven toolchain/base image and any Spring-specific config accordingly.

## Guidance

Drive Java versions from the BOM property, move cds-dk installation to `npm ci`, and align JDK
/ Spring Boot with the release. Then run `mvn test` (JUnit) as the regression gate.
