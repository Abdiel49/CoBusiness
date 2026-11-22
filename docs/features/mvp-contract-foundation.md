# MVP contract foundation

## Purpose

Provide a Web transport boundary that supports both the eventual API and local mock-backed UI flows without embedding unverified endpoints or payload schemas.

## Behavior

- `ApiTransport` accepts an HTTP method, relative path, optional body, and abort signal, with a caller-provided response type.
- `createFetchTransport` sends requests to a configured API base URL with cookie credentials and exposes HTTP status, raw response body, API error code, and trace ID through `ApiRequestError`.
- `createMockTransport` allows UI work to proceed with request handlers while the API contract is unavailable.
- `getApiBaseUrl` reads the public `NEXT_PUBLIC_API_BASE_URL` setting and validates it when present.
- `getStellarClientConfig` accepts an optional, complete Testnet-only public configuration and rejects partial or non-Testnet settings.
- `lib/wallet/client.ts` defines the browser-only wallet adapter boundary without importing a provider or touching browser globals during server rendering.
- Formatting, type-checking, and Vitest commands are available for the Web workspace.

## Contracts and dependencies

The live OpenAPI endpoint returned HTTP 200 with OpenAPI 3.0.0 (API version 1.0.0). Request DTOs and the documented create-order example are represented in `lib/api/contracts.ts`. Many response schemas remain empty, `CredentialsDto` has no properties, and OpenAPI security references `__Host-cobusiness_session` while the declared scheme key is `cookie`; Server corrections are required before full type generation or auth integration. Stellar transaction state must be sourced from the agreed contract/read model, never inferred from a mock response. Wallet provider behavior and Soroban transaction serialization remain unimplemented until provider and ABI are approved.

## Verification

- `git diff --check` passed.
- Live OpenAPI was fetched successfully outside the sandbox; the sandbox itself cannot reach localhost:3001.
- API integration tests remain pending until Server response schemas and the cookie security-scheme name are corrected.

## Pending integration and limitations

- Server: complete response/error schemas, define `CredentialsDto`, and align the cookie security scheme key with endpoint references.
- Agree and publish the financial state contract in `MVP-SERVER-001` and the Soroban ABI/events in `MVP-WEB3-001`.
- Connect the Web transport and replace local mock handlers after those versioned contracts are approved.
