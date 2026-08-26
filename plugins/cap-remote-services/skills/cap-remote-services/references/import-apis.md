# Importing APIs

Bring an external OData API into your CAP project as a CDS model.

## Get the EDMX

Download the API's OData metadata (`.edmx`) — e.g. from the **SAP Business Accelerator Hub**
(the "API Specification" download for an API like Business Partner), or any OData provider's
`$metadata`.

## cds import

```sh
cds import ~/Downloads/API_BUSINESS_PARTNER.edmx
# -> srv/external/API_BUSINESS_PARTNER.csn  (+ a copy of the .edmx)

# human-readable .cds instead of .csn:
cds import ~/Downloads/API_BUSINESS_PARTNER.edmx --as cds
```

Results land under `srv/external/`, and `cds import` adds the service to `package.json` under
`cds.requires`.

## What you get

- A generated model (`.csn` or `.cds`) describing the remote entities, e.g.
  `A_BusinessPartner`, associations, and types.
- A registered required service you can `cds.connect.to(...)`.

## Compiling your own service to EDMX

To share your own CAP service as EDMX (for others to import):

```sh
cds compile srv/cat-service.cds --to edmx
```

(For a lossless CAP-to-CAP alternative, prefer `cds export` reuse packages — see
[reuse-packages.md](reuse-packages.md).)

## Guidance

Keep imported artifacts under `srv/external/` and re-run `cds import` when the provider
updates the API. Don't hand-edit generated `.csn`; annotate/extend it from your own `.cds`
files instead.
