# ABAP Development Tools (ADT)

ADT is the Eclipse-based toolset for modern ABAP. Use it instead of the classic SE80 GUI
for all new development — CDS, RAP, and ABAP Cloud objects require it.

## Working in ADT

- **Project = ABAP system connection.** Connect to the ABAP Environment / S/4HANA system;
  objects live on the server, edited through ADT.
- **Editors** for each object type: CDS data definitions (`.ddls`), behavior definitions
  (`.bdef`), service definitions (`.srvd`), classes, interfaces, packages.
- **Run/Preview:** the *Fiori elements preview* / service-binding preview opens the OData
  service; classes run via *Run As → ABAP Application*.
- **ABAP Unit:** run tests with the test runner; coverage available.
- **ATC (ABAP Test Cockpit):** static checks, including clean-core and released-API checks.

## Useful features

- **API State** display for released-API/clean-core compliance.
- **Where-used**, quick fixes, and ABAP Doc.
- **abapGit** integration for Git-based source management and transport of open-source-style
  projects.

## Guidance

Author CDS/RAP/classes in ADT; run ATC before shipping to catch clean-core and quality
issues early. Reserve SE80 for legacy objects that ADT cannot edit.
