# GitHub Backlog — WEB — Next.js / Frontend

> **Estado:** backlog propuesto para implementación; no acredita funcionalidades existentes ni aprobación de reglas comerciales.
> **Fuentes:** `Documento_Rector_Comercio_Colectivo_v0.4.docx.md`, `Guia_sondeo_importadores.docx.md`, `Proyecto final.md`, `Proyecto_Unificado_Comercio_Colectivo_Stellar_v1.md`, y la especificación Product/Roadmap compartida en la conversación.
> **Convención:** títulos, funcionalidades y campos de issues en inglés técnico; explicaciones de gobierno en español.

## Ajuste de alcance — 2026-11-20

**Fuente vigente:** [Guía de desarrollo de la demo v1.0](proyectos/comercio-colectivo/guias/Guia_desarrollo_demo_CoBusiness_v1.0.md) y cierre de etapa acordado con el propietario. Este ajuste no acredita implementación ni ratificación adicional del equipo.

- **Demo:** operador ficticio, oferta precargada, KYC/KYB simulados y datos ficticios. Bloques enteros configurables; 1.000 termos / bloques de 100 es ejemplo, no constante.
- **Éxito:** condiciones aceptadas → aporte Testnet → meta confirmada → ratificación comercial del operador dentro de 24 horas desde meta → autorización CoBusiness → desembolso a wallet operador. Meta sola no paga.
- **Devolución:** CoBusiness habilita y cada comprador reclama. Motivos previstos: meta incompleta al vencer recaudación; negativa inmediata del operador; falta de respuesta en 24 horas. El equipo elige UNA variante preparada para demostrar; no se exige implementar todas ni presentarlas como disponibles si no lo están.
- **Documentos:** condiciones antes del aporte, constancia individual con estado del pago, documento consolidado de ejemplo al pasar a ejecución. No se exige instrumentación jurídica definitiva.
- **Pollar:** orientación por defecto sujeta a prueba wallet/firma; KYC simulado y saldo Testnet preparado bastan. No exigir rampa BOB real ni puente.
- **Contrato propio mínimo:** propuesta preferida del propietario, PENDIENTE DE CONSENSO. WEB3 describe esa vía condicionalmente; no la ratifica. Trustless Work no es dependencia obligatoria. Motivo central: controlar costos y ajustar reglas; contrato propio no elimina costos de red/desarrollo.
- **Ingresos:** propuesta de suscripción base y comisión de éxito a cargo del operador, no comprador. Comisión CoBusiness cero en devolución; si se representa reparto, tasa ilustrativa y neto del operador. Sin cobros reales ni tarifa comercial fijada.
- **Fuera de demo:** creación completa de ofertas/onboarding, logística/chat, dinero real, disputas exhaustivas y producción. Fases 2–4 permanecen como roadmap histórico propuesto, NO ratificado ni requisito de presentación; sus P0 son relativos a cada fase.
- **Criterio de desarrollo:** stack/arquitectura (incluidos NestJS/PostgreSQL propuestos), activo/precio, modalidad de firma, representación de roles y preparación de escenarios. No reabrir inacción de plataforma u otras excepciones como bloqueos.

IDs, dependencias y estimaciones se conservan para trazabilidad; desarrollo revisará estimaciones al concretar el alcance. Ninguna casilla se marca completada. Originales y procedencia: `proyectos/comercio-colectivo/documentos/backlogs-equipo/2026-11-20/`.

## Reglas comunes para GitHub

- **Milestones (exactos):** `MVP`, `Fase 2`, `Fase 3`, `Fase 4` (GitHub milestones son por repositorio).
- **Etiqueta obligatoria de repositorio:** `web` y solo una de `web`, `server`, `web3` por issue técnica.
- **Work Type:** `feature`, `test`, `infrastructure`, `security`, `research`, `documentation` según tarea. **Priority:** campo `P0`–`P3` de GitHub Projects.
- **Features padre:** agrupar tareas por Feature ID; si abarcan repositorios, utilizar issues/enlaces cruzados y no asignar falsa propiedad técnica a la feature padre.
- **Definición de Ready:** dueño/contrato/versiones acordadas, errores y permisos explicitados; tareas consumidoras pueden iniciar con mocks verificados por contrato.
- **Definición de Done:** requisitos y criterios de aceptación verificables, pruebas y revisión PR, documentación actualizada y, cuando aplica, integración entre repositorios comprobada.
- **Dependencias:** `BLOCKING` (no se puede iniciar), `CONTRACT` (iniciar con interfaz aprobada), `INTEGRATION` (implementar con mocks, no cerrar integración), `RUNTIME` (componente necesario al ejecutar).
- **Sistema de registro:** Server almacena órdenes/identidades; Web3 tiene autoridad sobre movimiento de fondos; Web solo presenta/solicita/transmite firmas; no incluir secretos de comprador en Server.
- **Invariantes:** meta lograda ≠ liberación automática; votes/reservas ≠ fondos; `funded = released + refunded + remaining`; activos en unidades enteras exactas; Testnet ≠ USDC real.

## Registro de contratos de integración (índice compartido)

| Contract ID | Dueño de especificación | Versión / entrega | Consumidores |
|---|---|---|---|
| `C-API-01` | `MVP-SERVER-001` | OpenAPI v1 routes, errors, auth, request/response schemas | Web mock client; Server endpoints |
| `C-APPROVAL-01` | `MVP-SERVER-010` | Operator response within 24h, CoBusiness release/refund authorization and example execution document | Web approval panel; Server orchestration; Web3 release |
| `C-AUDIT-01` | `MVP-SERVER-012` | Admin read-only audit and sync error summary | Web admin; Server audit |
| `C-AUTH-01` | `MVP-SERVER-003` | Demo session/RBAC, /me and explicitly simulated KYC | Web routing; Server authorization |
| `C-CATALOG-01` | `MVP-SERVER-004` | One-product demo SKU, price/asset schema | Web product selection; Server product API |
| `C-DEPLOY-01` | `MVP-WEB3-007` | Testnet passphrase, RPC, token ID, contract ID, explorer and tagged ABI | Web config; Server env; Web3 release |
| `C-ERROR-01` | `MVP-SERVER-001` | Stable error codes, HTTP mapping, trace ID; no sensitive detail | Web error states; Server handlers |
| `C-ESCROW-01` | `MVP-WEB3-001` | Proposed ABI v1: whole-block funding, goal timestamp, CoBusiness release/refund enablement, individual claims and getters | Web wallet; Server adapter; Web3 contract |
| `C-LOT-01` | `MVP-SERVER-005` | Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines | Web lot pages; Server lot creation; Web3 terms hash |
| `C-ORDER-01` | `MVP-SERVER-006` | Whole-block order, accepted terms, exact amount and individual example receipt | Web checkout; Server orders |
| `C-PAY-01` | `MVP-SERVER-008` | Unsigned invocation preparation, payment intent lifecycle and event references | Web signing; Server payments; Web3 contribute |
| `C-REFUND-01` | `MVP-SERVER-011` | Selected refund cause, CoBusiness enablement and individual unsigned claim | Web refund UI; Server refunds; Web3 claim |
| `C-STATE-01` | `MVP-SERVER-001` | Separate commercial lot/order statuses from escrow states; confirmed-only totals | Web read models; Server indexer; Web3 events |
| `C-WALLET-01` | `MVP-SERVER-007` | Wallet nonce/challenge/proof binding and Testnet network | Web wallet adapter; Server verification |
| `C-ANALYTICS-02` | `F2-SERVER-007` | Pilot metrics and opt-in feedback source evidence | Web pilot dashboard; Server analytics |
| `C-CATALOG-02` | `F2-SERVER-003` | SKU variants, quotation snapshots and itemized prices | Web variant selection; Server catalog |
| `C-NOTIFY-02` | `F2-SERVER-006` | Notification payload/preference and unique delivery identity | Web notifications; Server outbox |
| `C-OPS-02` | `F2-SERVER-008` | Sync checkpoints, TTL warnings, degraded/recovery indicators | Web status UX; Server operations; Web3 TTL |
| `C-ORDER-02` | `F2-SERVER-003` | Multi-item order, per-line prices and accepted terms | Web checkout; Server orders |
| `C-ORG-02` | `F2-SERVER-001` | Org membership, invitations, role grant and organization access | Web settings; Server ACL |
| `C-PRIVATE-02` | `F2-SERVER-002` | Private lot access/invite expiry and revocation | Web invitation UX; Server ACL |
| `C-REPORT-02` | `F2-SERVER-005` | Buyer/operator scoped dashboards and CSV calculations | Web dashboards; Server aggregation |
| `C-RESERVE-02` | `F2-SERVER-004` | Holds, reservation expiry, availability vs paid order | Web reserve UX; Server reservation concurrency |
| `C-COMPLIANCE-03` | `F3-SERVER-001` | Production gate, jurisdiction/asset policy, provider decision evidence | Web production gating; Server deploy policy; Web3 audit |
| `C-DISPUTE-03` | `F3-SERVER-005` | Dispute claims, private evidence, resolution and permitted allocations | Web dispute workflow; Server arbitration; Web3 hold |
| `C-ESCROW-03` | `F3-WEB3-001` | Escrow ABI v2 and migration policy for milestones, disputes and partial refunds | Web signing; Server operations; Web3 contract |
| `C-FINANCE-03` | `F3-SERVER-003` | Asset allowlist, fee snapshot and ledger event classifications | Web fee disclosure; Server ledger; Web3 accounting |
| `C-MILESTONE-03` | `F3-SERVER-004` | Milestone state/evidence/authorized approvers and release preparation | Web reviewers; Server workflow; Web3 stage payout |
| `C-OPS-03` | `F3-SERVER-006` | Reconciliation statuses, fee records and incident signal schemas | Web receipts; Server finance ops |
| `C-VERIFY-03` | `F3-SERVER-002` | KYC/KYB state, private evidence access, verifier decisions | Web onboarding; Server case management |
| `C-ATTRIB-04` | `F4-SERVER-006` | Acquisition attribution, conversions and fee trigger classification | Web analytics; Server fees |
| `C-CONVERT-04` | `F4-SERVER-004` | Selected quotation→new lot and explicit buyer opt-in, no auto-pay | Web opt-in; Server conversion; Web3 unchanged escrow |
| `C-DEMAND-04` | `F4-SERVER-001` | Non-binding buyer request schema and moderation states | Web requests; Server demand |
| `C-INTEREST-04` | `F4-SERVER-002` | Interest/votes and aggregates strictly separate from financial commitments | Web voting; Server counters |
| `C-MARKET-04` | `F4-SERVER-005` | Marketplace search, visibility and provenance of reputation | Web listing; Server index |
| `C-QUOTE-04` | `F4-SERVER-003` | Operator quotes, cost breakdown, versioned selection rules | Web compare; Server proposals |

### Regla de compatibilidad

Los IDs son contratos de diseño propuestos, no endpoints o ABI ya desplegados. Los dueños deben publicar la especificación versionada, ejemplos y fixtures; los consumidores registran hash/tag de la versión y prueban contratos. El Server **no** puede inferir aportes desde un payment intent. Web3 **no** confía en datos de Server para mover fondos sin sus autorizaciones on-chain. Un contrato aprobado habilita trabajo paralelo, pero no significa integración cerrada.

## Matriz de responsabilidades entre repositorios

| Interacción | Produce | Consume | Cierre verificable |
|---|---|---|---|
| Auth / lot / order REST | Server (OpenAPI, fixtures) | Web | Prueba de contrato + E2E con API real |
| ABI, errores, eventos y asset | Web3 (Rust ABI y deployment artifacts) | Server y Web | SDK/adapters contra Testnet y event fixture |
| Payment intent / estado confirmado | Server (validación + indexador) | Web | Orden asociada con tx confirmada sin dobles conteos |
| Signatures / token transfers | Usuario en Web mediante wallet | Soroban | `require_auth` y tx confirmada; Server observa |
| Evidencia comercial y aprobación | Server (reglas y evidencia) + wallet del aprobador | Soroban | Role policy y evento release; evidencia física declarada/simulada |

## Integration Contract Annex — demo baseline v0.2 (proposed)

Anexo idéntico en los tres backlogs. DISEÑO PROPUESTO, no API/ABI desplegada. SERVER-001 / WEB3-001 concretan nombres, firmas y fixtures versionados. Contrato propio pendiente de consenso; no se impone stack nuevo.

### A. Representation, identity, consistency

- IDs comerciales opacos con mapping inmutable a red/contrato/activo/chainLotId. Importes JSON como strings de unidades mínimas enteras; verificar decimales, sin coma flotante.
- Oferta: `unitsPerBlock, totalBlocks, blockPriceMinor, fundingDeadline`. Pedido: `blockCount` entero positivo; unidades = bloques × unidades/bloque; importe = bloques × precio/bloque. Meta = totalBlocks × blockPriceMinor. Porcentaje derivado, no necesariamente 10 %.
- Cupo y múltiplos se validan también en contrato si se adopta vía propia; no basta backend ante concurrencia. Pendientes/intentos no incrementan financiado.
- Fechas UTC en API; timestamp de ledger en contrato. `goalReachedAt` corresponde al aporte confirmado que completa meta; `operatorResponseDeadline = goalReachedAt + 86400`. No reiniciar al leer notificación ni fingir vencimiento con reloj visual.
- `termsHash`: serialización canónica versionada de bloques, precios, activo, plazos, destinatarios y políticas. Condiciones conocidas/aceptadas antes del aporte y sin modificación unilateral posterior.
- Sesión, KYC simulado, prueba de wallet y autorización de tokens son distintos. CoBusiness autoriza desembolso/habilitación de devolución. Rol REST no sustituye firma on-chain. Equipo decide representación de ratificación comercial: si off-chain, no anunciar firma on-chain del operador ni verificación física.

### B. MVP API baseline (`C-API-01`)

Rutas ilustrativas a concretar en OpenAPI. Sin formulario/CRUD público obligatorio de ofertas; seed/configuración reproducible más lectura.

| Operación propuesta | Datos / resultado | Dueño |
|---|---|---|
| Acceso / me | roles, identidad ficticia y KYC simulated; sin documentos reales | MVP-SERVER-003 |
| Lectura operador/producto | revisión simulada y condiciones comerciales/entrega | MVP-SERVER-004 |
| GET lots / lots/:id | bloques, precio, activo, condiciones, progreso confirmado y plazos | MVP-SERVER-005 |
| POST lots/:id/orders; GET orders/:id | blockCount, acceptedTermsVersion, idempotencyKey; cantidad/importe y constancia individual | MVP-SERVER-006 |
| Wallet challenge/verify | nonce, red, expiración y prueba soportada por modalidad elegida; Pollar sujeto a prueba | MVP-SERVER-007 |
| Payment intent / submission | invocación sin firmar y txHash; submitted NO es funded | MVP-SERVER-008 |
| Estado escrow/payment | balances confirmados, timestamps y última sincronización | MVP-SERVER-009 |
| Respuesta del operador | continuidad/negativa, fecha, procedencia y simulación comercial | MVP-SERVER-010 |
| Preparar autorización CoBusiness | desembolso o habilitación de devolución, causa, términos e invocación sin firmar | MVP-SERVER-010 |
| Documento consolidado de ejemplo | habilitación automática tras desembolso confirmado, referencia tx y términos | MVP-SERVER-010 |
| Refund eligibility / prepare claim | elegible vs habilitado, aporte propio no devuelto e invocación sin firmar | MVP-SERVER-011 |
| Auditoría admin | lectura, sin edición de balances | MVP-SERVER-012 |

Errores estables sin PII/secretos: LOT_NOT_OPEN, INVALID_BLOCK_COUNT, INSUFFICIENT_BLOCKS, TERMS_VERSION_MISMATCH, WRONG_NETWORK, UNAUTHORIZED, REFUND_NOT_ENABLED. Publicar DTO/códigos HTTP. Reintentos idempotentes; documentos/pedidos privados accesibles solo a participantes autorizados.

### C. State contracts (`C-STATE-01`)

Comercial propuesto: collecting → goal_reached_awaiting_operator → operator_confirmed → release_authorized → execution. Execution NO significa entrega física. Equipo concreta transiciones atómicas/separadas.

Financiero: funding → funded_awaiting_approval → released. Alternativa elegible antes de desembolso: refund_eligible → refund_enabled → refunds_in_progress → refunded. Elegibilidad no es habilitación y habilitación no es transferencia. Orden: intent → submitted → funded → execution o refunded, sin marcar entrega física.

Motivos previstos: meta incompleta vencida; negativa del operador sin esperar 24 horas; falta de respuesta tras 24 horas desde meta. Solo variante elegida exige integración E2E ahora. CoBusiness habilita; comprador reclama individualmente sin doble pago ni recuperación de dinero ya desembolsado.

Contabilidad exacta: confirmedDeposits = operatorNetPaid + platformFeePaid + refunded + remainingBalance. Si no se representa comisión, platformFeePaid=0 y se indica; si se representa, congelar tasa ilustrativa/base/redondeo y descontar al operador solo en éxito. Bruto = neto + comisión. No fijar tarifa comercial ni costos externos.

### D. Soroban ABI and events (`C-ESCROW-01`, `C-EVENT-01`)

Si se adopta contrato propio, WEB3 publicará ABI real. Capacidades conceptuales, NO firmas Rust definitivas:

```text
init_lot(blocks, price, asset, funding deadline, operator,
         CoBusiness authority, terms hash, optional illustrative fee policy)
contribute(lot, payer, order reference, block count)
get_lot / get_contribution
approve_release / release (CoBusiness auth, eligible state, fixed recipients)
enable_refunds (CoBusiness auth, selected reason and eligibility)
claim_refund (payer auth, own unrefunded contribution)
```

Registrar meta/plazos con aporte que la completa; impedir fracciones/sobrecupo y doble desembolso. Fondos retenidos hasta autorización CoBusiness. Ratificación y evidencia comercial según política técnica explícita; no oráculo de mercancía. Usar require_auth/autorización soportada en actores pertinentes, no flags HTTP. Equipo decide múltiples pedidos por wallet o restricción documentada coherente en los tres componentes.

Eventos conceptuales: ContributionConfirmed, GoalReached, ReleaseApproved, FundsReleased, RefundsEnabled, RefundClaimed y comisión si se representa. Esquema versionado; txHash/secuencia/hora ledger pueden ser metadatos del indexador, no datos conocidos por contrato. Identidad única network/contractId/txHash/eventOrdinal o cursor canónico. Solo evidencia on-chain compatible confirma dinero; documentar TTL suficiente para demo/reclamos.

### D.1 Precisiones técnicas verificadas mediante Raven — 2026-11-20

- Preparar cada invocación con simulación RPC (`simulateTransaction` o helper compatible del SDK) antes de las firmas finales; incorporar recursos, footprint y autorizaciones requeridas. La simulación técnica no sustituye autorización ni confirma un pago. WEB/SERVER acuerdan quién prepara; no duplicar responsabilidades ni presuponer soporte Pollar.
- `sendTransaction` aceptada/pendiente no significa éxito. Consultar resultado confirmado (`getTransaction` o helper compatible); `NOT_FOUND` y agotamiento del polling no prueban fracaso. Conservar hash y límites temporales; no construir otro pago mientras el anterior aún pueda incluirse. Antes de reconstruir, verificar fallo definitivo o expiración confirmada por ledger y conciliar el pedido, sin duplicar aporte.
- Autoridad: comprador autoriza su aporte y reclamo; CoBusiness autoriza desembolso al operador o habilitación de devolución. El rol HTTP no sustituye autorización del contrato (`require_auth` o mecanismo compatible).

Contraste documental, no prueba de integración. Fuentes y límites: [revisión Raven](proyectos/comercio-colectivo/documentos/backlogs-equipo/2026-11-20/revision-raven.md). No modifica acuerdos comerciales ni exige otras variantes de devolución.

### E. Integration sequencing and demo closure

1. Equipo concreta vía escrow, wallet/firma y variante de devolución sin ampliar alcance. SERVER-001 / WEB3-001 publican interfaces; WEB avanza con mocks identificados.
2. Trabajo paralelo con interfaces versionadas; probar Pollar sin presuponer integración ni exigir rampa real. Documentar modalidad/alternativa elegida por desarrollo.
3. WEB3-007 entrega artefactos Testnet si se adopta esa vía; SERVER indexa y WEB firma con wallet real Testnet. Aportes previos solo son confirmados si existen on-chain.
4. Éxito: oferta precargada → bloques/condiciones → aporte → meta → ratificación simulada dentro de 24 horas → autorización CoBusiness → pago Testnet operador → documento de ejemplo.
5. Devolución: operación preparada elegida → habilitación CoBusiness → reclamo → tx confirmada. Si usa plazo vencido, preparar vencimiento real; no cambiar solo reloj visual.
6. No exigir demostrar todas las excepciones, esperar en vivo ni construir fases futuras. Mocks no cierran integración financiera; simulado es contenido comercial/KYC, no tx presentada como real.

### F. Configuration inventory (no secrets in client)

| Name | Scope | Meaning |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Web public | REST API URL, no auth tokens |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Web public | Explicit `TESTNET` / production network label |
| `NEXT_PUBLIC_STELLAR_CONTRACT_ID` | Web public | Verified deployed escrow contract for selected network |
| `NEXT_PUBLIC_STELLAR_ASSET_CONTRACT_ID` | Web public | Accepted demo/production token contract ID |
| `DATABASE_URL` | Server secret | PostgreSQL credentials and TLS |
| `STELLAR_RPC_URL` | Server/Web3 deploy configuration | Trusted network RPC endpoint |
| `STELLAR_NETWORK_PASSPHRASE` | Server/Web3 config | Network-specific signing/simulation context |
| `STELLAR_ESCROW_CONTRACT_ID` | Server | Deployed contract allowlist |
| `STELLAR_ASSET_CONTRACT_ID` | Server | Token allowlist |
| `AUTH_SESSION_SECRET` | Server secret | Session signing/encryption |
| `WEB3_DEPLOYER_SECRET` | Restricted deploy environment only | Never available to Web/Server runtime or stored in repo |

These are proposed names; repository owners must publish checked-in `.env.example` without secrets and validate environment/network consistency. Frontend wallet secrets remain under user custody; never upload them to Server.


## Índice de tareas

| ID | Feature | Priority | Estimate | Cross-repository dependencies |
|---|---|---|---:|---|
| `MVP-WEB-001` | F01 Architecture & contracts | P0 | 3 | `MVP-SERVER-001` |
| `MVP-WEB-002` | F02 Identity & roles | P0 | 3 | `MVP-SERVER-003` |
| `MVP-WEB-003` | F04 Collective Orders | P0 | 3 | `MVP-SERVER-005` |
| `MVP-WEB-004` | F04 Collective Orders | P0 | 3 | `MVP-SERVER-005`, `MVP-SERVER-009` |
| `MVP-WEB-005` | F07 Wallet & payments | P0 | 5 | `MVP-SERVER-007` |
| `MVP-WEB-006` | F07 Wallet & payments | P0 | 5 | `MVP-SERVER-006`, `MVP-SERVER-008`, `MVP-WEB3-004` |
| `MVP-WEB-007` | F08 Chain indexing & read models | P0 | 3 | `MVP-SERVER-009` |
| `MVP-WEB-008` | F09 Close/release/refund demo orchestration | P0 | 3 | `MVP-SERVER-011`, `MVP-WEB3-006` |
| `MVP-WEB-009` | F09 Close/release/refund demo orchestration | P0 | 3 | `MVP-SERVER-010`, `MVP-WEB3-005` |
| `MVP-WEB-010` | F10 Demo verification & observability | P0 | 5 | `MVP-SERVER-012`, `MVP-WEB3-007` |
| `F2-WEB-001` | F11 Organizations & private operators | P1 | 3 | `F2-SERVER-001` |
| `F2-WEB-002` | F12 Private lots & access | P0 | 3 | `F2-SERVER-002` |
| `F2-WEB-003` | F13 Catalog & order reservations | P0 | 5 | `F2-SERVER-003`, `F2-SERVER-004` |
| `F2-WEB-004` | F14 Buyer/operator dashboards | P1 | 3 | `F2-SERVER-005` |
| `F2-WEB-005` | F14 Buyer/operator dashboards | P1 | 3 | `F2-SERVER-005` |
| `F2-WEB-006` | F15 Notifications & research instrumentation | P2 | 3 | `F2-SERVER-006` |
| `F2-WEB-007` | F15 Notifications & research instrumentation | P1 | 3 | `F2-SERVER-007` |
| `F2-WEB-008` | F16 Escrow lifecycle reliability | P2 | 2 | `F2-SERVER-008` |
| `F3-WEB-001` | F17 Compliance & identity | P1 | 5 | `F3-SERVER-002` |
| `F3-WEB-002` | F19 Milestone payments | P0 | 5 | `F3-SERVER-004`, `F3-WEB3-002` |
| `F3-WEB-003` | F20 Disputes & resolutions | P1 | 5 | `F3-SERVER-005`, `F3-WEB3-003` |
| `F3-WEB-004` | F21 Financial reconciliation & operations | P1 | 3 | `F3-SERVER-006` |
| `F3-WEB-005` | F22 Production safeguards | P0 | 3 | `F3-SERVER-007`, `F3-SERVER-003` |
| `F4-WEB-001` | F23 Buyer demand requests | P0 | 3 | `F4-SERVER-001` |
| `F4-WEB-002` | F24 Demand pools & voting | P0 | 3 | `F4-SERVER-002` |
| `F4-WEB-003` | F25 Operator quotations | P0 | 5 | `F4-SERVER-003` |
| `F4-WEB-004` | F26 Convert demand to funded lot | P0 | 5 | `F4-SERVER-004` |
| `F4-WEB-005` | F27 Marketplace discovery & reputations | P1 | 5 | `F4-SERVER-005` |
| `F4-WEB-006` | F28 Marketplace fee attribution & analytics | P1 | 3 | `F4-SERVER-006` |

## Milestone: MVP — Prototipo hackathon — Stellar Testnet

Demo acotada: oferta precargada, bloques, meta, ratificación simulada, autorización CoBusiness y pago Testnet; otra operación con habilitación y reclamo individual. Sin dinero ni entregas reales.

### Feature: F01 Architecture & contracts

**Resultado esperado:** Common architecture, authoritative schema/ABI and deployment tools.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-001] Bootstrap Next.js application and UI conventions

**Metadata**

- **Milestone:** MVP
- **Feature:** F01 Architecture & contracts
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `infrastructure`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-001`

**Description**

Set up web app, type-safe API client, route conventions and project test tooling.

**Functional requirements & implementation checklist**

- [ ] FR-01: Configure Next.js TypeScript Tailwind lint formatting.
- [ ] FR-02: implement API client with typed errors and mock adapters from OpenAPI.
- [ ] FR-03: establish SSR/client boundary for wallet.
- [ ] FR-04: add environment validation and test commands.

**Technical requirements / integration contracts**

- `C-API-01` (owner `MVP-SERVER-001`, phase MVP): OpenAPI v1 routes, errors, auth, request/response schemas.
- `C-ERROR-01` (owner `MVP-SERVER-001`, phase MVP): Stable error codes, HTTP mapping, trace ID; no sensitive detail.

**Dependencies and parallelization**

- `MVP-SERVER-001` (`server`, CONTRACT / INTEGRATION): Define shared product, API, and financial state contracts. Needed deliverable: C-API-01, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Development and production builds pass.
- [ ] AC-02: mocks are contract-based.
- [ ] AC-03: secrets never bundled to client.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Build, lint, mocked client contract tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F01 Architecture & contracts; source product master sections 4–11.
- Related task IDs: MVP-SERVER-001.

### Feature: F02 Identity & roles

**Resultado esperado:** Demo identity and role-based access.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-002] Build demo login, simulated verification and role navigation

**Metadata**

- **Milestone:** MVP
- **Feature:** F02 Identity & roles
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-003`, `MVP-WEB-001`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Acceso con identidades ficticias y KYC simulado explícito.
- [ ] FR-02: Separar comprador/operador/CoBusiness; sin alta ni documentos reales.
- [ ] FR-03: Ocultar acciones según rol sin sustituir permisos server/on-chain.

**Technical requirements / integration contracts**

- `C-AUTH-01` (owner `MVP-SERVER-003`, phase MVP): Demo session/RBAC, /me and explicitly simulated KYC.
- `C-API-01` (owner `MVP-SERVER-001`, phase MVP): OpenAPI v1 routes, errors, auth, request/response schemas.

**Dependencies and parallelization**

- `MVP-SERVER-003` (`server`, CONTRACT / INTEGRATION): Implement demo identities, simulated KYC and roles. Needed deliverable: C-AUTH-01, C-API-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-001` (`web`, BLOCKING / CONTRACT): Bootstrap Next.js application and UI conventions. Needed deliverable: C-API-01, C-ERROR-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Operador accede oferta precargada/ratificación; no requiere creación.
- [ ] AC-02: Comprador no puede autorizar movimientos CoBusiness.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F02 Identity & roles; source product master sections 4–11.
- Related task IDs: MVP-SERVER-003, MVP-WEB-001.

### Feature: F04 Collective Orders

**Resultado esperado:** Display preloaded offer with whole-block pricing and conditions.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-003] Build operator view of preloaded offer (no creation editor)

**Metadata**

- **Milestone:** MVP
- **Feature:** F04 Collective Orders
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-005`, `MVP-WEB-002`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Mostrar oferta precargada, bloques, condiciones y snapshot.
- [ ] FR-02: Reutilizar ficha, sin formulario draft/publish para demo.
- [ ] FR-03: Enlazar respuesta del operador en MVP-WEB-009.

**Technical requirements / integration contracts**

- `C-LOT-01` (owner `MVP-SERVER-005`, phase MVP): Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines.
- `C-CATALOG-01` (owner `MVP-SERVER-004`, phase MVP): One-product demo SKU, price/asset schema.
- `C-API-01` (owner `MVP-SERVER-001`, phase MVP): OpenAPI v1 routes, errors, auth, request/response schemas.

**Dependencies and parallelization**

- `MVP-SERVER-005` (`server`, CONTRACT / INTEGRATION): Seed block-based offer and immutable policy snapshots. Needed deliverable: C-LOT-01, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-002` (`web`, BLOCKING / CONTRACT): Build demo login, simulated verification and role navigation. Needed deliverable: C-AUTH-01, C-API-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Vista coincide con oferta server y no permite modificar condiciones financiadas.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F04 Collective Orders; source product master sections 4–11.
- Related task IDs: MVP-SERVER-005, MVP-WEB-002.

#### [MVP-WEB-004] Display preloaded whole-block offer and conditions

**Metadata**

- **Milestone:** MVP
- **Feature:** F04 Collective Orders
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-005`, `MVP-SERVER-009`, `MVP-WEB-001`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Mostrar producto, operador ficticio, unidades/precio por bloque, total/disponibles y activo Testnet.
- [ ] FR-02: Mostrar condiciones de compra/entrega y plazo antes de aporte; porcentaje derivado.
- [ ] FR-03: Usar progreso confirmado y avisos de simulación; no exigir marketplace.

**Technical requirements / integration contracts**

- `C-LOT-01` (owner `MVP-SERVER-005`, phase MVP): Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.
- `C-API-01` (owner `MVP-SERVER-001`, phase MVP): OpenAPI v1 routes, errors, auth, request/response schemas.

**Dependencies and parallelization**

- `MVP-SERVER-005` (`server`, CONTRACT / INTEGRATION): Seed block-based offer and immutable policy snapshots. Needed deliverable: C-LOT-01, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-SERVER-009` (`server`, CONTRACT / INTEGRATION): Index finalized escrow events with idempotent reconciliation. Needed deliverable: C-EVENT-01, C-ESCROW-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-001` (`web`, BLOCKING / CONTRACT): Bootstrap Next.js application and UI conventions. Needed deliverable: C-API-01, C-ERROR-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Ejemplo 1000/100 configurable; precio y unidades antes de porcentaje.
- [ ] AC-02: Pendientes no figuran financiados; activo de prueba no es dinero real.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F04 Collective Orders; source product master sections 4–11.
- Related task IDs: MVP-SERVER-005, MVP-SERVER-009, MVP-WEB-001.

### Feature: F07 Wallet & payments

**Resultado esperado:** User-authorized wallet payment flow.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-005] Implement Testnet wallet connect and signature

**Metadata**

- **Milestone:** MVP
- **Feature:** F07 Wallet & payments
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-007`, `MVP-WEB-002`

**Description**

Probar wallet/firma Testnet compatible, considerando Pollar por defecto sin asumir integración. Documentar modalidad elegida; saldo preparado basta, sin rampa BOB real.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build network-aware wallet connector and authorize challenge signature.
- [ ] FR-02: show account/public address and testnet warnings.
- [ ] FR-03: handle missing wallet, rejected signatures and disconnect.
- [ ] FR-04: avoid storing secrets.

**Technical requirements / integration contracts**

- `C-WALLET-01` (owner `MVP-SERVER-007`, phase MVP): Wallet nonce/challenge/proof binding and Testnet network.
- `C-AUTH-01` (owner `MVP-SERVER-003`, phase MVP): Demo session/RBAC, /me and explicitly simulated KYC.
- `C-DEPLOY-01` (owner `MVP-WEB3-007`, phase MVP): Testnet passphrase, RPC, token ID, contract ID, explorer and tagged ABI.

**Dependencies and parallelization**

- `MVP-SERVER-007` (`server`, CONTRACT / INTEGRATION): Implement wallet challenge and verified account binding. Needed deliverable: C-WALLET-01, C-AUTH-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-002` (`web`, BLOCKING / CONTRACT): Build demo login, simulated verification and role navigation. Needed deliverable: C-AUTH-01, C-API-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Correct wallet bound via backend.
- [ ] AC-02: network mismatch blocks payment.
- [ ] AC-03: rejection leaves order uncommitted.
- [ ] AC-04: no secret key persistence.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Wallet provider mocked and account mismatch E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F07 Wallet & payments; source product master sections 4–11.
- Related task IDs: MVP-SERVER-007, MVP-WEB-002.

#### [MVP-WEB-006] Implement whole-block checkout, contribution and receipt

**Metadata**

- **Milestone:** MVP
- **Feature:** F07 Wallet & payments
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-WEB-005`, `MVP-SERVER-006`, `MVP-SERVER-008`, `MVP-WEB3-004`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Seleccionar bloques completos dentro de cupo; mostrar cantidad/importe exactos.
- [ ] FR-02: Aceptar términos antes de crear aporte; solicitar pedido/intent y firmar invocación compatible Testnet.
- [ ] FR-03: Distinguir pendiente/confirmado y ofrecer constancia individual con estado pago.
- [ ] FR-04: Reintento no duplica intent; contrato decide cupo final ante concurrencia.

**Technical requirements / integration contracts**

- `C-ORDER-01` (owner `MVP-SERVER-006`, phase MVP): Whole-block order, accepted terms, exact amount and individual example receipt.
- `C-PAY-01` (owner `MVP-SERVER-008`, phase MVP): Unsigned invocation preparation, payment intent lifecycle and event references.
- `C-ESCROW-01` (owner `MVP-WEB3-001`, phase MVP): Proposed ABI v1: whole-block funding, goal timestamp, CoBusiness release/refund enablement, individual claims and getters.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `MVP-WEB-005` (`web`, BLOCKING / CONTRACT): Implement Testnet wallet connect and signature. Needed deliverable: C-WALLET-01, C-AUTH-01. Follow agreed interface; implementation order can overlap after contract review.
- `MVP-SERVER-006` (`server`, CONTRACT / INTEGRATION): Implement whole-block order and individual receipt. Needed deliverable: C-ORDER-01, C-LOT-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-SERVER-008` (`server`, CONTRACT / INTEGRATION): Implement payment intent/preparation and on-chain tx references. Needed deliverable: C-PAY-01, C-WALLET-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB3-004` (`web3`, CONTRACT / INTEGRATION): Implement whole-block contributions, cap and goal timestamp. Needed deliverable: C-ESCROW-01, C-EVENT-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Fracciones/exceso rechazados; rechazo de firma no produce aporte pagado.
- [ ] AC-02: Constancia ejemplo con datos ficticios y tx si confirmada.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F07 Wallet & payments; source product master sections 4–11.
- Related task IDs: MVP-WEB-005, MVP-SERVER-006, MVP-SERVER-008, MVP-WEB3-004.

### Feature: F08 Chain indexing & read models

**Resultado esperado:** Confirmed on-chain synchronization.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-007] Show transaction status, escrow progress and explorer evidence

**Metadata**

- **Milestone:** MVP
- **Feature:** F08 Chain indexing & read models
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-009`, `MVP-WEB-004`

**Description**

Mostrar bloques/aportes confirmados, timestamps de meta/respuesta y desembolso/reembolso; bruto/neto/comisión si se representa. No equivale a entrega física.

**Functional requirements & implementation checklist**

- [ ] FR-01: Implement live polling/refetch of status.
- [ ] FR-02: render chain finality vs pending.
- [ ] FR-03: link correct network explorer with hash.
- [ ] FR-04: show contract address/token and last sync timestamp.
- [ ] FR-05: explain discrepancies and retry UX; NOT_FOUND o fin del polling no implican fallo. Seguir hash/expiración según D.1; no reenviar un nuevo pago mientras el anterior pueda incluirse.

**Technical requirements / integration contracts**

- `C-PAY-01` (owner `MVP-SERVER-008`, phase MVP): Unsigned invocation preparation, payment intent lifecycle and event references.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.
- `C-DEPLOY-01` (owner `MVP-WEB3-007`, phase MVP): Testnet passphrase, RPC, token ID, contract ID, explorer and tagged ABI.

**Dependencies and parallelization**

- `MVP-SERVER-009` (`server`, CONTRACT / INTEGRATION): Index finalized escrow events with idempotent reconciliation. Needed deliverable: C-EVENT-01, C-ESCROW-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-004` (`web`, BLOCKING / CONTRACT): Display preloaded whole-block offer and conditions. Needed deliverable: C-LOT-01, C-STATE-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Never display unconfirmed contribution as confirmed.
- [ ] AC-02: explorer link matches network/tx.
- [ ] AC-03: underfunded/fully funded states accurate.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Status transition tests and RPC delay simulation.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F08 Chain indexing & read models; source product master sections 4–11.
- Related task IDs: MVP-SERVER-009, MVP-WEB-004.

### Feature: F09 Close/release/refund demo orchestration

**Resultado esperado:** Two end-to-end demonstration paths.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-008] Show CoBusiness-enabled individual refund and confirmation

**Metadata**

- **Milestone:** MVP
- **Feature:** F09 Close/release/refund demo orchestration
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-011`, `MVP-WEB3-006`, `MVP-WEB-005`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Mostrar causa y elegible vs habilitado para variante preparada.
- [ ] FR-02: Permitir reclamo con wallet comprador e importe propio; mostrar confirmación/explorer.
- [ ] FR-03: No mostrar habilitación como pago ni cobrar comisión CoBusiness.

**Technical requirements / integration contracts**

- `C-REFUND-01` (owner `MVP-SERVER-011`, phase MVP): Selected refund cause, CoBusiness enablement and individual unsigned claim.
- `C-ESCROW-01` (owner `MVP-WEB3-001`, phase MVP): Proposed ABI v1: whole-block funding, goal timestamp, CoBusiness release/refund enablement, individual claims and getters.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `MVP-SERVER-011` (`server`, CONTRACT / INTEGRATION): Implement enabled refunds and individual claim preparation. Needed deliverable: C-REFUND-01, C-ESCROW-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB3-006` (`web3`, CONTRACT / INTEGRATION): Implement CoBusiness refund enablement and individual claims. Needed deliverable: C-ESCROW-01, C-EVENT-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-005` (`web`, BLOCKING / CONTRACT): Implement Testnet wallet connect and signature. Needed deliverable: C-WALLET-01, C-AUTH-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Solo confirmación on-chain marca refunded; sin doble reclamo ni devolución de dinero liberado.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F09 Close/release/refund demo orchestration; source product master sections 4–11.
- Related task IDs: MVP-SERVER-011, MVP-WEB3-006, MVP-WEB-005.

#### [MVP-WEB-009] Build operator confirmation and CoBusiness authorization panels

**Metadata**

- **Milestone:** MVP
- **Feature:** F09 Close/release/refund demo orchestration
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-010`, `MVP-WEB3-005`, `MVP-WEB-005`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Mostrar meta y plazo 24h desde goalReachedAt; registrar continuidad/negativa simulada.
- [ ] FR-02: Separar rol operador/CoBusiness; firmar desembolso o habilitación de devolución elegida.
- [ ] FR-03: Mostrar pago Testnet al operador y bruto/neto/comisión ilustrativa si aplica.
- [ ] FR-04: Ofrecer automáticamente documento consolidado ejemplo tras desembolso confirmado.

**Technical requirements / integration contracts**

- `C-APPROVAL-01` (owner `MVP-SERVER-010`, phase MVP): Operator response within 24h, CoBusiness release/refund authorization and example execution document.
- `C-ESCROW-01` (owner `MVP-WEB3-001`, phase MVP): Proposed ABI v1: whole-block funding, goal timestamp, CoBusiness release/refund enablement, individual claims and getters.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `MVP-SERVER-010` (`server`, CONTRACT / INTEGRATION): Record operator response and prepare CoBusiness release or refund authorization. Needed deliverable: C-APPROVAL-01, C-ESCROW-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB3-005` (`web3`, CONTRACT / INTEGRATION): Implement CoBusiness-authorized payout after operator confirmation. Needed deliverable: C-ESCROW-01, C-EVENT-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-005` (`web`, BLOCKING / CONTRACT): Implement Testnet wallet connect and signature. Needed deliverable: C-WALLET-01, C-AUTH-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Meta/ratificación solas no pagan; wallet no autorizada falla on-chain.
- [ ] AC-02: Simulación corresponde a contenido comercial, no a tx Testnet.
- [ ] AC-03: Negativa permite habilitar reembolso sin esperar 24h si esa variante se implementa.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F09 Close/release/refund demo orchestration; source product master sections 4–11.
- Related task IDs: MVP-SERVER-010, MVP-WEB3-005, MVP-WEB-005.

### Feature: F10 Demo verification & observability

**Resultado esperado:** Test evidence, admin traceability and reproducible demo.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [MVP-WEB-010] Prepare scoped demo walkthrough and read-only operational view

**Metadata**

- **Milestone:** MVP
- **Feature:** F10 Demo verification & observability
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `test`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `MVP-SERVER-012`, `MVP-WEB-008`, `MVP-WEB-009`, `MVP-WEB3-007`

**Description**

Ajustada a guía demo v1.0; propuesta de implementación, no tarea completada. Alcance detallado a continuación.

**Functional requirements & implementation checklist**

- [ ] FR-01: Preparar identidades ficticias, oferta, aportes previos verificables y saldo wallet Testnet.
- [ ] FR-02: Documentar éxito y UNA devolución elegida con habilitación CoBusiness y reclamo.
- [ ] FR-03: Preparar operación realmente vencida si corresponde, no solo reloj visual.
- [ ] FR-04: Incluir documentos ejemplo y mensaje suscripción/comisión éxito al operador sin cobros reales.
- [ ] FR-05: Auditoría simple de lectura, no centro operativo productivo.

**Technical requirements / integration contracts**

- `C-AUDIT-01` (owner `MVP-SERVER-012`, phase MVP): Admin read-only audit and sync error summary.
- `C-DEPLOY-01` (owner `MVP-WEB3-007`, phase MVP): Testnet passphrase, RPC, token ID, contract ID, explorer and tagged ABI.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `MVP-SERVER-012` (`server`, CONTRACT / INTEGRATION): Implement read-only admin audit and demo telemetry. Needed deliverable: C-AUDIT-01, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.
- `MVP-WEB-008` (`web`, BLOCKING / CONTRACT): Show CoBusiness-enabled individual refund and confirmation. Needed deliverable: C-REFUND-01, C-ESCROW-01. Follow agreed interface; implementation order can overlap after contract review.
- `MVP-WEB-009` (`web`, BLOCKING / CONTRACT): Build operator confirmation and CoBusiness authorization panels. Needed deliverable: C-APPROVAL-01, C-ESCROW-01. Follow agreed interface; implementation order can overlap after contract review.
- `MVP-WEB3-007` (`web3`, CONTRACT / INTEGRATION): Publish Testnet deployment artifacts and executable fixtures. Needed deliverable: C-DEPLOY-01, C-ESCROW-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Ambas rutas tienen tx/links; distinguir preparado/simulado/confirmado.
- [ ] AC-02: No exige alta ofertas, todas las excepciones ni fases futuras.
- [ ] AC-INT: Integración financiera real Testnet antes de cierre; mocks identificados solo habilitan trabajo paralelo.

**Testing requirements**

Verificar criterios anteriores y controles básicos del flujo implementado; evidencia Testnet cuando corresponde. No exigir excepciones fuera de alcance.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F10 Demo verification & observability; source product master sections 4–11.
- Related task IDs: MVP-SERVER-012, MVP-WEB-008, MVP-WEB-009, MVP-WEB3-007.

## Milestone: Fase 2 — Piloto privado B2B y validación comercial

> **FUERA DE DEMO / ROADMAP PROPUESTO:** conservado para trazabilidad, no ratificado ni requisito de presentación.

Importadores con clientes propios; reservas, lotes privados, reportes, notificaciones y validación de ahorro/tiempo; sin recepción de fondos reales hasta requisitos habilitantes.

### Feature: F11 Organizations & private operators

**Resultado esperado:** Operator teams and organization ownership.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-001] Build organization and operator settings

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F11 Organizations & private operators
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-001`

**Description**

Enable operators to manage profiles and invite team members.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build settings, member invitation and permissions screens.
- [ ] FR-02: display verification status as unverified.
- [ ] FR-03: use typed org APIs.
- [ ] FR-04: enforce error states.

**Technical requirements / integration contracts**

- `C-ORG-02` (owner `F2-SERVER-001`, phase Fase 2): Org membership, invitations, role grant and organization access.
- `C-AUTH-01` (owner `MVP-SERVER-003`, phase MVP): Demo session/RBAC, /me and explicitly simulated KYC.

**Dependencies and parallelization**

- `F2-SERVER-001` (`server`, CONTRACT / INTEGRATION): Implement organizations, membership and scoped permissions. Needed deliverable: C-ORG-02, C-AUTH-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Invitation, membership revoke and role changes reflect server.
- [ ] AC-02: unauthorized actions blocked.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

RBAC components and invitation E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F11 Organizations & private operators; source product master sections 4–11.
- Related task IDs: F2-SERVER-001.

### Feature: F12 Private lots & access

**Resultado esperado:** Invitation-only B2B offers.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-002] Build private lot invite and access UX

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F12 Private lots & access
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-002`

**Description**

Allow existing clients to join private lots through invitation.

**Functional requirements & implementation checklist**

- [ ] FR-01: Provide invite-link entry/accept flow.
- [ ] FR-02: show login interstitial and invite errors.
- [ ] FR-03: hide private lot from public lists.
- [ ] FR-04: operator invite management screen.

**Technical requirements / integration contracts**

- `C-PRIVATE-02` (owner `F2-SERVER-002`, phase Fase 2): Private lot access/invite expiry and revocation.
- `C-LOT-01` (owner `MVP-SERVER-005`, phase MVP): Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines.

**Dependencies and parallelization**

- `F2-SERVER-002` (`server`, CONTRACT / INTEGRATION): Implement invitation-only lot visibility and link lifecycle. Needed deliverable: C-PRIVATE-02, C-LOT-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Authorized buyer can open and participate.
- [ ] AC-02: expired/revoked links show safe error.
- [ ] AC-03: no private data leak.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Valid/expired/revoked and unauthorized browser tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F12 Private lots & access; source product master sections 4–11.
- Related task IDs: F2-SERVER-002.

### Feature: F13 Catalog & order reservations

**Resultado esperado:** Multi-item selection and non-binding reservations.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-003] Build variant selection and reservation checkout

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F13 Catalog & order reservations
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-003`, `F2-SERVER-004`

**Description**

Allow buyers to select variants, reserve quantities and later fund confirmed orders.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build variant selectors and price breakdown.
- [ ] FR-02: show reservation expiration and state.
- [ ] FR-03: support cancellation/retry.
- [ ] FR-04: distinguish reserved vs confirmed amounts.

**Technical requirements / integration contracts**

- `C-CATALOG-02` (owner `F2-SERVER-003`, phase Fase 2): SKU variants, quotation snapshots and itemized prices.
- `C-RESERVE-02` (owner `F2-SERVER-004`, phase Fase 2): Holds, reservation expiry, availability vs paid order.
- `C-ORDER-02` (owner `F2-SERVER-003`, phase Fase 2): Multi-item order, per-line prices and accepted terms.

**Dependencies and parallelization**

- `F2-SERVER-003` (`server`, CONTRACT / INTEGRATION): Implement product variants and versioned price quotations. Needed deliverable: C-CATALOG-02, C-ORDER-02. Start with approved mocks/specifications; integrate and verify before closing.
- `F2-SERVER-004` (`server`, CONTRACT / INTEGRATION): Implement reservations, capacity locking and expiration. Needed deliverable: C-RESERVE-02, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Chosen options persist.
- [ ] AC-02: expired hold cannot fund without refresh.
- [ ] AC-03: UI never adds reserved quantity to funded progress.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Reservation expiry and multi-variant order E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F13 Catalog & order reservations; source product master sections 4–11.
- Related task IDs: F2-SERVER-003, F2-SERVER-004.

### Feature: F14 Buyer/operator dashboards

**Resultado esperado:** Operational reporting for both sides.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-004] Build buyer dashboard for active and historical orders

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F14 Buyer/operator dashboards
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-005`, `F2-WEB-003`

**Description**

Display commitments, pending actions, status and receipts.

**Functional requirements & implementation checklist**

- [ ] FR-01: Create buyer order lists and filters.
- [ ] FR-02: show reservation expiry, confirmed deposit, refund eligibility.
- [ ] FR-03: links to receipt/explorer and lot.
- [ ] FR-04: empty/error/loading states.

**Technical requirements / integration contracts**

- `C-REPORT-02` (owner `F2-SERVER-005`, phase Fase 2): Buyer/operator scoped dashboards and CSV calculations.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `F2-SERVER-005` (`server`, CONTRACT / INTEGRATION): Implement order reports and organization-scoped aggregation. Needed deliverable: C-REPORT-02, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.
- `F2-WEB-003` (`web`, BLOCKING / CONTRACT): Build variant selection and reservation checkout. Needed deliverable: C-CATALOG-02, C-RESERVE-02. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: No visibility to another buyer.
- [ ] AC-02: financial figures match API.
- [ ] AC-03: pending activity clearly distinguished.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Dashboard component and cross-user security E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F14 Buyer/operator dashboards; source product master sections 4–11.
- Related task IDs: F2-SERVER-005, F2-WEB-003.

#### [F2-WEB-005] Build operator management dashboard and exports

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F14 Buyer/operator dashboards
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-005`, `F2-WEB-002`

**Description**

Provide operator view of lots, participants, MOQ, statuses and CSV exports.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build operator overview with quantity and funding segregated.
- [ ] FR-02: per-lot participant summary.
- [ ] FR-03: export reports with date/token units.
- [ ] FR-04: loading/empty states.

**Technical requirements / integration contracts**

- `C-REPORT-02` (owner `F2-SERVER-005`, phase Fase 2): Buyer/operator scoped dashboards and CSV calculations.
- `C-LOT-01` (owner `MVP-SERVER-005`, phase MVP): Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines.

**Dependencies and parallelization**

- `F2-SERVER-005` (`server`, CONTRACT / INTEGRATION): Implement order reports and organization-scoped aggregation. Needed deliverable: C-REPORT-02, C-STATE-01. Start with approved mocks/specifications; integrate and verify before closing.
- `F2-WEB-002` (`web`, BLOCKING / CONTRACT): Build private lot invite and access UX. Needed deliverable: C-PRIVATE-02, C-LOT-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: Operator scope enforced.
- [ ] AC-02: exports match visible summary.
- [ ] AC-03: no cross-tenant data.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Operator scoped E2E; CSV fixture reconciliation.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F14 Buyer/operator dashboards; source product master sections 4–11.
- Related task IDs: F2-SERVER-005, F2-WEB-002.

### Feature: F15 Notifications & research instrumentation

**Resultado esperado:** Notifications, commercial measurement and feedback.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-006] Build notification center and preference controls

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F15 Notifications & research instrumentation
- **Project Type:** `web`
- **Priority:** `P2`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-006`

**Description**

Show participation/goal/expiration alerts in-app.

**Functional requirements & implementation checklist**

- [ ] FR-01: Implement notification list, read state, and settings.
- [ ] FR-02: handle stale/deleted link.
- [ ] FR-03: deep link to lot/order.

**Technical requirements / integration contracts**

- `C-NOTIFY-02` (owner `F2-SERVER-006`, phase Fase 2): Notification payload/preference and unique delivery identity.

**Dependencies and parallelization**

- `F2-SERVER-006` (`server`, CONTRACT / INTEGRATION): Implement notifications with idempotent transactional outbox. Needed deliverable: C-NOTIFY-02, C-EVENT-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Only own messages visible.
- [ ] AC-02: duplicate retries do not duplicate UI.
- [ ] AC-03: unread counts correct.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Notification state and deep link E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F15 Notifications & research instrumentation; source product master sections 4–11.
- Related task IDs: F2-SERVER-006.

#### [F2-WEB-007] Build pilot analytics and feedback collection

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F15 Notifications & research instrumentation
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-007`

**Description**

Support operator/admin measurement of pilot value.

**Functional requirements & implementation checklist**

- [ ] FR-01: Display time-to-goal and participation funnel.
- [ ] FR-02: mark simulated data.
- [ ] FR-03: collect opt-in operator feedback, export metrics.
- [ ] FR-04: avoid promises of savings.

**Technical requirements / integration contracts**

- `C-ANALYTICS-02` (owner `F2-SERVER-007`, phase Fase 2): Pilot metrics and opt-in feedback source evidence.

**Dependencies and parallelization**

- `F2-SERVER-007` (`server`, CONTRACT / INTEGRATION): Implement commercial pilot metrics and non-financial research records. Needed deliverable: C-ANALYTICS-02, C-REPORT-02. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Metrics use sourced API values.
- [ ] AC-02: feedback opt-in.
- [ ] AC-03: no fictitious customer claims.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Analytics fixture and consent UI.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F15 Notifications & research instrumentation; source product master sections 4–11.
- Related task IDs: F2-SERVER-007.

### Feature: F16 Escrow lifecycle reliability

**Resultado esperado:** Reconciliation and storage lifecycle resilience.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F2-WEB-008] Surface blockchain delays and recovery guidance

**Metadata**

- **Milestone:** Fase 2
- **Feature:** F16 Escrow lifecycle reliability
- **Project Type:** `web`
- **Priority:** `P2`
- **Work Type:** `feature`
- **Estimate:** `2` story points
- **Assignee:** Unassigned
- **Dependencies:** `F2-SERVER-008`

**Description**

Show reliable chain sync status in buyer/operator UIs.

**Functional requirements & implementation checklist**

- [ ] FR-01: Render chain last-confirmation and degraded service warning.
- [ ] FR-02: distinguish wallet-submitted from chain-final.
- [ ] FR-03: link correct support/runbook help.

**Technical requirements / integration contracts**

- `C-OPS-02` (owner `F2-SERVER-008`, phase Fase 2): Sync checkpoints, TTL warnings, degraded/recovery indicators.
- `C-STATE-01` (owner `MVP-SERVER-001`, phase MVP): Separate commercial lot/order statuses from escrow states; confirmed-only totals.

**Dependencies and parallelization**

- `F2-SERVER-008` (`server`, CONTRACT / INTEGRATION): Implement chain event backfill, TTL monitoring and incident response. Needed deliverable: C-EVENT-01, C-DEPLOY-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: No false confirmed status when indexer delayed.
- [ ] AC-02: meaningful recovery instructions.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

RPC stale index and degraded-service UI tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F16 Escrow lifecycle reliability; source product master sections 4–11.
- Related task IDs: F2-SERVER-008.

## Milestone: Fase 3 — Protecciones financieras y preparación operativa

> **FUERA DE DEMO / ROADMAP PROPUESTO:** conservado para trazabilidad, no ratificado ni requisito de presentación.

KYC/KYB, legal gate, activos y comisiones, hitos, disputas, conciliación y auditoría. Mainnet únicamente tras autorización legal/operativa y revisión de seguridad.

### Feature: F17 Compliance & identity

**Resultado esperado:** Legal gates and private identity verification.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F3-WEB-001] Build buyer and operator verification onboarding

**Metadata**

- **Milestone:** Fase 3
- **Feature:** F17 Compliance & identity
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F3-SERVER-002`

**Description**

Collect only required KYC/KYB information with consent and status clarity.

**Functional requirements & implementation checklist**

- [ ] FR-01: Add verification steps, secure document upload handoff, expiry/retry screens.
- [ ] FR-02: show verified vs declared information and role-specific requirements.
- [ ] FR-03: prevent leaking documents in SSR.

**Technical requirements / integration contracts**

- `C-VERIFY-03` (owner `F3-SERVER-002`, phase Fase 3): KYC/KYB state, private evidence access, verifier decisions.
- `C-COMPLIANCE-03` (owner `F3-SERVER-001`, phase Fase 3): Production gate, jurisdiction/asset policy, provider decision evidence.

**Dependencies and parallelization**

- `F3-SERVER-002` (`server`, CONTRACT / INTEGRATION): Implement KYC/KYB cases and protected document lifecycle. Needed deliverable: C-VERIFY-03, C-COMPLIANCE-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Unauthorized documents inaccessible.
- [ ] AC-02: user sees review status.
- [ ] AC-03: consent captured before upload.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Verified/unverified/expired flows and private upload tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F17 Compliance & identity; source product master sections 4–11.
- Related task IDs: F3-SERVER-002.

### Feature: F19 Milestone payments

**Resultado esperado:** Evidence-backed approvals and staged disbursement.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F3-WEB-002] Build commercial milestone evidence and approval flows

**Metadata**

- **Milestone:** Fase 3
- **Feature:** F19 Milestone payments
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F3-SERVER-004`, `F3-WEB3-002`

**Description**

Show milestone conditions, evidence and approvals to authorized participants.

**Functional requirements & implementation checklist**

- [ ] FR-01: Create milestone timeline, evidence upload and source status.
- [ ] FR-02: operator submission and verifier review.
- [ ] FR-03: wallet-based approver signature.
- [ ] FR-04: show payout confirmation and remaining balance.

**Technical requirements / integration contracts**

- `C-MILESTONE-03` (owner `F3-SERVER-004`, phase Fase 3): Milestone state/evidence/authorized approvers and release preparation.
- `C-ESCROW-03` (owner `F3-WEB3-001`, phase Fase 3): Escrow ABI v2 and migration policy for milestones, disputes and partial refunds.

**Dependencies and parallelization**

- `F3-SERVER-004` (`server`, CONTRACT / INTEGRATION): Implement milestone/evidence and approver authority APIs. Needed deliverable: C-MILESTONE-03, C-ESCROW-03. Start with approved mocks/specifications; integrate and verify before closing.
- `F3-WEB3-002` (`web3`, CONTRACT / INTEGRATION): Implement milestone escrow, partial releases and timeout. Needed deliverable: C-ESCROW-03, C-MILESTONE-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Non-approver cannot approve.
- [ ] AC-02: unsigned evidence never shown as verified.
- [ ] AC-03: chain release reflected after confirmation.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Milestone reviewer and wallet rejection E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F19 Milestone payments; source product master sections 4–11.
- Related task IDs: F3-SERVER-004, F3-WEB3-002.

### Feature: F20 Disputes & resolutions

**Resultado esperado:** Dispute procedures and residual-fund resolution.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F3-WEB-003] Build claims, disputes and resolution visibility

**Metadata**

- **Milestone:** Fase 3
- **Feature:** F20 Disputes & resolutions
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F3-SERVER-005`, `F3-WEB3-003`

**Description**

Enable buyer/operator to open and track contractually permitted disputes.

**Functional requirements & implementation checklist**

- [ ] FR-01: Implement claim entry, evidence attachments, timeline, private reviewer area and resolution state.
- [ ] FR-02: explain limits of already released funds.
- [ ] FR-03: provide refund/release links when allowed.

**Technical requirements / integration contracts**

- `C-DISPUTE-03` (owner `F3-SERVER-005`, phase Fase 3): Dispute claims, private evidence, resolution and permitted allocations.
- `C-ESCROW-03` (owner `F3-WEB3-001`, phase Fase 3): Escrow ABI v2 and migration policy for milestones, disputes and partial refunds.

**Dependencies and parallelization**

- `F3-SERVER-005` (`server`, CONTRACT / INTEGRATION): Implement dispute cases, evidence and resolution preparation. Needed deliverable: C-DISPUTE-03, C-EVENT-03. Start with approved mocks/specifications; integrate and verify before closing.
- `F3-WEB3-003` (`web3`, CONTRACT / INTEGRATION): Implement dispute freeze and authorized resolution allocations. Needed deliverable: C-ESCROW-03, C-DISPUTE-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Only parties/reviewers see private evidence.
- [ ] AC-02: paid-out funds not described as recoverable.
- [ ] AC-03: case state matches API and chain.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Claim window, private attachments, unauthorized actions.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F20 Disputes & resolutions; source product master sections 4–11.
- Related task IDs: F3-SERVER-005, F3-WEB3-003.

### Feature: F21 Financial reconciliation & operations

**Resultado esperado:** Accurate accounting and fee disclosure.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F3-WEB-004] Build financial ledger, fee transparency and download receipts

**Metadata**

- **Milestone:** Fase 3
- **Feature:** F21 Financial reconciliation & operations
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F3-SERVER-006`

**Description**

Provide buyer/operator visibility into funding, fees, payouts and escrow balance.

**Functional requirements & implementation checklist**

- [ ] FR-01: Show itemized charges and consent.
- [ ] FR-02: expose confirmed contributions and partial release histories.
- [ ] FR-03: receipts with asset, decimals, tx link.
- [ ] FR-04: admin reconciliation warnings without settlement controls.

**Technical requirements / integration contracts**

- `C-FINANCE-03` (owner `F3-SERVER-003`, phase Fase 3): Asset allowlist, fee snapshot and ledger event classifications.
- `C-OPS-03` (owner `F3-SERVER-006`, phase Fase 3): Reconciliation statuses, fee records and incident signal schemas.

**Dependencies and parallelization**

- `F3-SERVER-006` (`server`, CONTRACT / INTEGRATION): Implement payment accounting, settlement reconciliation and fee ledger. Needed deliverable: C-FINANCE-03, C-EVENT-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Fees disclosed before signing.
- [ ] AC-02: receipts match chain.
- [ ] AC-03: reports never count GMV as platform revenue.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Itemized fee/partial release and reconciliation warning tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F21 Financial reconciliation & operations; source product master sections 4–11.
- Related task IDs: F3-SERVER-006.

### Feature: F22 Production safeguards

**Resultado esperado:** Operational controls and mainnet gating.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F3-WEB-005] Add compliance/security UX for production gated payments

**Metadata**

- **Milestone:** Fase 3
- **Feature:** F22 Production safeguards
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F3-SERVER-007`, `F3-SERVER-003`

**Description**

Expose mainnet warnings, identity prerequisites, transaction fees and safeguard status.

**Functional requirements & implementation checklist**

- [ ] FR-01: Separate testnet/mainnet UI visually.
- [ ] FR-02: require explicit informed confirmation.
- [ ] FR-03: disable real payments when backend gate fails.
- [ ] FR-04: document support and dispute paths.

**Technical requirements / integration contracts**

- `C-COMPLIANCE-03` (owner `F3-SERVER-001`, phase Fase 3): Production gate, jurisdiction/asset policy, provider decision evidence.
- `C-FINANCE-03` (owner `F3-SERVER-003`, phase Fase 3): Asset allowlist, fee snapshot and ledger event classifications.

**Dependencies and parallelization**

- `F3-SERVER-007` (`server`, CONTRACT / INTEGRATION): Implement audit trail, alerting and key/permission operations. Needed deliverable: C-OPS-03, C-COMPLIANCE-03. Start with approved mocks/specifications; integrate and verify before closing.
- `F3-SERVER-003` (`server`, CONTRACT / INTEGRATION): Implement production asset and fee policy registry. Needed deliverable: C-FINANCE-03, C-COMPLIANCE-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Unsupported assets or unverified account blocked.
- [ ] AC-02: clear fee and network confirmations.
- [ ] AC-03: backend remains authoritative.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Mainnet gate, fee disclosure and wrong-network E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F22 Production safeguards; source product master sections 4–11.
- Related task IDs: F3-SERVER-007, F3-SERVER-003.

## Milestone: Fase 4 — Bolsa de demanda y marketplace

> **FUERA DE DEMO / ROADMAP PROPUESTO:** conservado para trazabilidad, no ratificado ni requisito de presentación.

Solicitudes de compradores, interés no vinculante, cotizaciones, elección y conversión a una nueva oferta que exige aceptación y pago independientes.

### Feature: F23 Buyer demand requests

**Resultado esperado:** Non-binding buyer-generated requests.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-001] Build buyer request creation and browsing screens

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F23 Buyer demand requests
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-001`

**Description**

Let buyers request products, quantities and destination without paying.

**Functional requirements & implementation checklist**

- [ ] FR-01: Create form, category filters, request detail, edit own request and moderation statuses.
- [ ] FR-02: show intent-only disclaimer.

**Technical requirements / integration contracts**

- `C-DEMAND-04` (owner `F4-SERVER-001`, phase Fase 4): Non-binding buyer request schema and moderation states.

**Dependencies and parallelization**

- `F4-SERVER-001` (`server`, CONTRACT / INTEGRATION): Implement buyer demand request lifecycle and moderation. Needed deliverable: C-DEMAND-04, C-AUTH-01. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: No payment button on request.
- [ ] AC-02: unauthorized edit denied.
- [ ] AC-03: location privacy controlled.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Request creation/edit and error E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F23 Buyer demand requests; source product master sections 4–11.
- Related task IDs: F4-SERVER-001.

### Feature: F24 Demand pools & voting

**Resultado esperado:** Non-binding demand aggregation.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-002] Build voting and demand aggregation UX

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F24 Demand pools & voting
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-002`

**Description**

Allow shoppers to support requests and view qualified aggregate interest.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build interest/withdraw controls and indicative quantities.
- [ ] FR-02: show non-binding notice near counters.
- [ ] FR-03: design anti-spam responses, loading/error states.

**Technical requirements / integration contracts**

- `C-INTEREST-04` (owner `F4-SERVER-002`, phase Fase 4): Interest/votes and aggregates strictly separate from financial commitments.

**Dependencies and parallelization**

- `F4-SERVER-002` (`server`, CONTRACT / INTEGRATION): Implement deduplicated demand pools and expression-of-interest rules. Needed deliverable: C-INTEREST-04, C-DEMAND-04. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Vote counts match server.
- [ ] AC-02: clicking vote never generates payment intent.
- [ ] AC-03: duplicate vote UX clear.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Repeated votes, withdrawal and non-funding E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F24 Demand pools & voting; source product master sections 4–11.
- Related task IDs: F4-SERVER-002.

### Feature: F25 Operator quotations

**Resultado esperado:** Multiple competing offers and comparability.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-003] Build operator quote submission and buyer comparison

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F25 Operator quotations
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-003`

**Description**

Present competing quotes by total estimated delivered price and terms.

**Functional requirements & implementation checklist**

- [ ] FR-01: Create quote form and versions.
- [ ] FR-02: render side-by-side cost breakdown with caveats.
- [ ] FR-03: display MOQ/deadline/verification flags.
- [ ] FR-04: allow criteria-based selection workflow.

**Technical requirements / integration contracts**

- `C-QUOTE-04` (owner `F4-SERVER-003`, phase Fase 4): Operator quotes, cost breakdown, versioned selection rules.
- `C-VERIFY-03` (owner `F3-SERVER-002`, phase Fase 3): KYC/KYB state, private evidence access, verifier decisions.

**Dependencies and parallelization**

- `F4-SERVER-003` (`server`, CONTRACT / INTEGRATION): Implement operator proposals and comparable quotation snapshots. Needed deliverable: C-QUOTE-04, C-CATALOG-02. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Quote comparison handles currencies without fake FX.
- [ ] AC-02: verified vs declared statuses visible.
- [ ] AC-03: expired proposal unselectable.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Side-by-side cost, expired quote and review E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F25 Operator quotations; source product master sections 4–11.
- Related task IDs: F4-SERVER-003.

### Feature: F26 Convert demand to funded lot

**Resultado esperado:** Fresh formal agreement and escrow from accepted quote.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-004] Build quotation selection and opt-in to formal lot

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F26 Convert demand to funded lot
- **Project Type:** `web`
- **Priority:** `P0`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-004`, `F4-WEB-003`, `MVP-WEB-006`

**Description**

Lead interested buyers from informal requests into explicit commercial agreement.

**Functional requirements & implementation checklist**

- [ ] FR-01: Show selection rationale and final terms.
- [ ] FR-02: link converted lot.
- [ ] FR-03: require explicit quantity selection and acceptance.
- [ ] FR-04: reuse existing checkout only after new formal order.

**Technical requirements / integration contracts**

- `C-CONVERT-04` (owner `F4-SERVER-004`, phase Fase 4): Selected quotation→new lot and explicit buyer opt-in, no auto-pay.
- `C-ORDER-02` (owner `F2-SERVER-003`, phase Fase 2): Multi-item order, per-line prices and accepted terms.
- `C-LOT-01` (owner `MVP-SERVER-005`, phase MVP): Preloaded whole-block lot DTO, frozen terms, token, funding and 24h response deadlines.

**Dependencies and parallelization**

- `F4-SERVER-004` (`server`, CONTRACT / INTEGRATION): Implement accepted quotation to new Collective Order conversion. Needed deliverable: C-CONVERT-04, C-LOT-01. Start with approved mocks/specifications; integrate and verify before closing.
- `F4-WEB-003` (`web`, BLOCKING / CONTRACT): Build operator quote submission and buyer comparison. Needed deliverable: C-QUOTE-04, C-VERIFY-03. Follow agreed interface; implementation order can overlap after contract review.
- `MVP-WEB-006` (`web`, BLOCKING / CONTRACT): Implement whole-block checkout, contribution and receipt. Needed deliverable: C-ORDER-01, C-PAY-01. Follow agreed interface; implementation order can overlap after contract review.

**Acceptance criteria**

- [ ] AC-01: No auto payment from vote.
- [ ] AC-02: changed terms require new consent.
- [ ] AC-03: buyers independently choose to participate.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Vote-to-lot consent and failure E2E.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F26 Convert demand to funded lot; source product master sections 4–11.
- Related task IDs: F4-SERVER-004, F4-WEB-003, MVP-WEB-006.

### Feature: F27 Marketplace discovery & reputations

**Resultado esperado:** Searchable public offers and proven track record.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-005] Build marketplace search and operator profiles

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F27 Marketplace discovery & reputations
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `5` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-005`

**Description**

Enable buyers to filter offers and evaluate documented operator history.

**Functional requirements & implementation checklist**

- [ ] FR-01: Build searchable catalog, price/MOQ filters, operator public profile and claims badges.
- [ ] FR-02: show verified/declared/source.
- [ ] FR-03: handle no-result and pagination.

**Technical requirements / integration contracts**

- `C-MARKET-04` (owner `F4-SERVER-005`, phase Fase 4): Marketplace search, visibility and provenance of reputation.
- `C-VERIFY-03` (owner `F3-SERVER-002`, phase Fase 3): KYC/KYB state, private evidence access, verifier decisions.

**Dependencies and parallelization**

- `F4-SERVER-005` (`server`, CONTRACT / INTEGRATION): Implement searchable operator/lot marketplace and verified performance. Needed deliverable: C-MARKET-04, C-VERIFY-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: Private lots never appear.
- [ ] AC-02: ratings sourced.
- [ ] AC-03: responsive filters and navigation.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Search/filter accessibility and permission tests.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F27 Marketplace discovery & reputations; source product master sections 4–11.
- Related task IDs: F4-SERVER-005.

### Feature: F28 Marketplace fee attribution & analytics

**Resultado esperado:** Source-aware conversion and fee reporting.

**Feature acceptance:** Cada tarea hija se prueba; el flujo de usuario y el estado financiero/comercial deben permanecer consistentes después de integrar las tareas dependientes. No se considerará terminada por demos solo con mocks.

#### [F4-WEB-006] Build marketplace operator conversion and fee dashboards

**Metadata**

- **Milestone:** Fase 4
- **Feature:** F28 Marketplace fee attribution & analytics
- **Project Type:** `web`
- **Priority:** `P1`
- **Work Type:** `feature`
- **Estimate:** `3` story points
- **Assignee:** Unassigned
- **Dependencies:** `F4-SERVER-006`

**Description**

Explain which commercial outcomes and fees originate from marketplace.

**Functional requirements & implementation checklist**

- [ ] FR-01: Show request→quote→order funnel and attributed operations.
- [ ] FR-02: separate subscription/transaction/marketplace fees.
- [ ] FR-03: add filters and export.

**Technical requirements / integration contracts**

- `C-ATTRIB-04` (owner `F4-SERVER-006`, phase Fase 4): Acquisition attribution, conversions and fee trigger classification.
- `C-FINANCE-03` (owner `F3-SERVER-003`, phase Fase 3): Asset allowlist, fee snapshot and ledger event classifications.

**Dependencies and parallelization**

- `F4-SERVER-006` (`server`, CONTRACT / INTEGRATION): Implement customer-source attribution and conversion accounting. Needed deliverable: C-ATTRIB-04, C-FINANCE-03. Start with approved mocks/specifications; integrate and verify before closing.

**Acceptance criteria**

- [ ] AC-01: No fees shown on expressions of interest.
- [ ] AC-02: counts align with server.
- [ ] AC-03: permissions protect operator data.
- [ ] AC-INT: producer/consumer contract tests pass with the real counterpart; mock-only passing does not complete cross-repository integration.

**Testing requirements**

Fee presentation, conversion statuses and scoped data.

**Definition of Done**

- [ ] Acceptance criteria and negative cases verified in automated tests.
- [ ] Lint/typecheck/build and repository CI pass.
- [ ] Security/authorization, no-sensitive-logs and exact amount constraints reviewed where applicable.
- [ ] Published schema/ABI/fixtures stay version-consistent with other repositories.
- [ ] Pull Request reviewed/merged; docs and environment examples updated.
- [ ] Final integration tested, or issue remains explicitly blocked at integration status.

**References**

- Source domain: F28 Marketplace fee attribution & analytics; source product master sections 4–11.
- Related task IDs: F4-SERVER-006.

## Reglas de cierre del milestone

- **MVP:** Éxito y UNA devolución preparada con transacciones Testnet observables, roles CoBusiness y documentos de ejemplo; no exigir todas las variantes ni afirmar compra/entrega física real.
- **Fase 2:** El operador puede administrar lotes privados y medir reservas vs fondos; métricas del piloto distinguen demos y operaciones observadas.
- **Fase 3:** No se permiten pagos mainnet reales sin revisión legal, auditoría técnica y gate de producción; el saldo nunca se mueve por mera decisión off-chain.
- **Fase 4:** La demanda no vinculante solo se convierte a lote mediante nueva oferta y aceptación explícita; las propuestas compiten con criterios documentados.

## Auditoría de dependencias

- Total tasks in this file: **29**.
- Cada referencia a task ID y contrato es resoluble contra los otros dos archivos.
- Las dependencias se conservan del backlog de origen. SERVER-001 y WEB3-001 acuerdan interfaces en paralelo; su coordinación no exige esperar implementación mutua.
- Los contratos futuros de Fase 3 no se consideran habilitados por haber terminado Testnet MVP.
- Para la demo: CoBusiness autoriza desembolso/habilitación de devolución y comprador reclama. Pendientes delegados: contrato propio por consenso, firma/activo/precio/arquitectura y tasa ilustrativa. Para una etapa futura: costeo comercial, KYC/KYB reales, rampas y jurisdicción; no bloquean presentación.
