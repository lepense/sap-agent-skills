# Deployment and binding

To emit/receive events in production, bind a messaging service instance to the app and
configure the `production` profile to use it.

## SAP Event Mesh (Cloud Foundry / MTA)

```yaml
modules:
  - name: myapp-srv
    requires:
      - name: myapp-messaging
resources:
  - name: myapp-messaging
    type: org.cloudfoundry.managed-service
    parameters:
      service: enterprise-messaging
      service-plan: default
      path: ./event-mesh.json     # emname/namespace, queues, subscriptions
```

`event-mesh.json` declares the namespace and any queues/subscriptions. The `production`
messaging `kind` is `enterprise-messaging`/`enterprise-messaging-shared`.

## SAP Cloud Application Event Hub

Event Hub delivers via a **webhook** secured with **IAS**:

```yaml
resources:
  - name: myapp-event-broker
    type: org.cloudfoundry.managed-service
    parameters:
      service: event-broker
      service-plan: event-connectivity
      config:
        systemNamespace: my.app
        webhookUrl: ~{myapp-srv-api/url}/messaging/v1.0/eb   # Java webhook path
```

Bind an **IAS** (`identity`) instance for authentication (X.509). For Java, add the
`cds-feature-event-hub` dependency and the messaging config in `application.yaml`.

## Kyma

Bind the messaging service via the SAP BTP service operator / a service binding referenced in
the Helm chart; the same `kind`/`format` config applies.

## Local vs production

Keep `[development]` on `file-based-messaging` (no broker); the `production` profile uses the
bound broker. Never require a real broker for the inner loop.

## Guidance

Bind the right service (`enterprise-messaging` vs `event-broker`), wire IAS/webhook for Event
Hub, and switch brokers by profile — code stays unchanged.
