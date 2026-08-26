# Testing

SAPUI5 ships two complementary test frameworks.

## QUnit — unit tests

Test formatters, model helpers, and isolated controller logic:

```js
sap.ui.define(["my/app/model/formatter"], function (formatter) {
  "use strict";
  QUnit.module("formatter");
  QUnit.test("formatPrice adds currency", function (assert) {
    assert.strictEqual(formatter.formatPrice.call({}, 10, "EUR"), "10.00 EUR");
  });
});
```

Keep business-free UI helpers pure so they are easy to unit test.

## OPA5 — integration/journey tests

`sap.ui.test.Opa5` drives the running app through user journeys using page objects,
matchers, and actions:

```js
opaTest("should open the detail page", function (Given, When, Then) {
  Given.iStartMyUIComponent({ componentConfig: { name: "my.app" } });
  When.onTheListPage.iPressOnTheFirstItem();
  Then.onTheDetailPage.iShouldSeeTheObjectHeader();
  Then.iTeardownMyUIComponent();
});
```

## Test setup

- Place tests under `webapp/test/` with a `Test.qunit.html`/`testsuite.qunit.js` runner.
- Run headless with `karma-ui5` in CI.
- Lint with ESLint (and UI5-specific rules) as a pre-check.

Aim for unit tests on all formatters/helpers and OPA5 journeys covering each route and the
main CRUD flows.
