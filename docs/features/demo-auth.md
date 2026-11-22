# Demo access and role navigation

The landing page links to simulated sign-in. Login and registration validate an email and a password of at least eight characters locally, and allow selection of buyer, operator, or CoBusiness. Neither form creates an account or sends credentials anywhere. Passwords are not stored.

The browser stores the email and selected role separately from demo business data. After hydration, the workspace redirects missing sessions to login and mismatched roles to the selected dashboard. The workspace role selector switches perspectives; sign-out removes only the session. Storage errors are displayed; users can retry or explicitly discard the demo session without deleting business data. These client-side controls do not provide security or authorization.

No API, Stellar integration, KYC, or real authentication is included. Server authentication and authorization must replace this mock before use beyond the demo. No configuration is required.

Type checking and targeted ESLint passed. Browser checks covered navigation, form validation, registration, role changes, reload, sign-out, recovery from a damaged session, and preservation of a prepared business-data snapshot. Desktop and mobile screens were visually reviewed with Impeccable, and the landing responsive gate passed after recapture. The simulated session remains local to the browser and is not an authorization boundary.
