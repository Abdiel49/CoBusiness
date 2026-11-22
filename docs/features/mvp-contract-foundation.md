# MVP contract foundation

## Purpose

Provide a Web transport boundary that supports both the eventual API and local mock-backed UI flows without embedding unverified endpoints or payload schemas.

## Behavior

- `ApiTransport` accepts an HTTP method, relative path, optional body, and abort signal, with a caller-provided response type.
- `createFetchTransport` sends requests to a configured API base URL and exposes HTTP status and raw response body through `ApiRequestError`.
- `createMockTransport` allows UI work to proceed with request handlers while the API contract is unavailable.
- `getApiBaseUrl` reads the public `NEXT_PUBLIC_API_BASE_URL` setting and validates it when present.

## Contracts and dependencies

Endpoint paths and feature-specific request/response types are intentionally not defined until the Server OpenAPI document is available and approved. This transport does not establish authentication, endpoint schemas, or financial truth. Stellar transaction state must be sourced from the agreed contract/read model, never inferred from a mock response.

## Verification

- `git diff --check` passed.
- The OpenAPI endpoint could not be inspected: `curl: (7) Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server`.
- No endpoint-specific contract or API integration tests were run because the API specification is unavailable.

## Pending integration and limitations

- Start the Server and inspect `http://localhost:3001/api/docsjson` before adding endpoint methods or domain schemas.
- Agree and publish the API/error/state contracts in `MVP-SERVER-001` and the Soroban ABI/events in `MVP-WEB3-001`.
- Connect the Web transport and replace local mock handlers after those versioned contracts are approved.
