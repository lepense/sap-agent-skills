#!/usr/bin/env bash
# Import an external OData API and run it mocked locally.
set -euo pipefail

# 1) Import the EDMX downloaded from the SAP Business Accelerator Hub.
#    Produces srv/external/<API>.csn and registers it in package.json > cds.requires.
cds import ~/Downloads/API_BUSINESS_PARTNER.edmx
# For a human-readable model instead of .csn:
# cds import ~/Downloads/API_BUSINESS_PARTNER.edmx --as cds

# 2a) In-process mock (fastest): CAP auto-mocks imported APIs on cds watch.
cds watch

# 2b) OR separate-process mock (more realistic topology):
#     Terminal 1:
# cds mock srv/external/API_BUSINESS_PARTNER
#     Terminal 2:
# cds watch
