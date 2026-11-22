# Demo foundation

## Scope

The demo uses fictional browser data. `domain/demo` defines an initial offer, domain types, a repository interface with a local storage adapter, and minimal offer and order services. The services list, find, and save records through the shared repository and notify the provider after writes. The adapter reads and writes a versioned snapshot and resets it explicitly to the initial data. Initial buyer, operator, and CoBusiness workspace routes show preparation messages. The workspace exposes a confirmed reset action and storage recovery. It performs no network or Stellar requests.

## Data and configuration

The provider reads browser storage after client hydration and listens for changes in other tabs. Data is stored under `cobusiness.demo.v1`. Monetary amounts are represented as strings in minor units. Commercial and payment statuses are separate. The repository does not store passwords or private keys.

## Errors and limitations

Unavailable storage, invalid JSON, unsupported versions, and failed writes raise `DemoStorageError`; the provider exposes an error and retry. Snapshot validation checks the envelope and currently defined fields. This is a foundation, not a complete implementation of domain transitions, concurrent writes, role sessions, or dashboards. The current role links do not persist a role or protect routes. API and Stellar integrations remain pending.

## Verification

Type checking and targeted lint passed. Desktop and mobile screenshots were reviewed. Browser checks verified operator navigation state, reset success and failure feedback, and storage error recovery controls. The independent review scored its corrections to navigation, error controls, and reset feedback resolved at the scope reviewed.
