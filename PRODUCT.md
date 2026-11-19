# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The product serves the following user groups:

- **Buyers:** Small business owners, retailers, resellers, entrepreneurs, and individuals interested in purchasing products at wholesale prices through collective orders.
- **Commercial Operators:** Importers, wholesalers, and distributors who publish product offerings, establish minimum order quantities, consolidate purchases, and manage procurement and delivery.
- **Platform Administrators:** Users responsible for supervising operations, managing users, reviewing commercial operators, configuring platform policies, and monitoring transactions.
- **Verifiers:** Authorized participants responsible for reviewing evidence and confirming commercial milestones before conditional fund releases.
- **External Partners (Future):** Suppliers, logistics providers, customs brokers, and other commercial service providers.

For the MVP, Buyers, Commercial Operators, and Platform Administrators are the primary users. Verifier actions may be simulated through authorized demo accounts.

## Product Purpose

Build a collective commerce platform that enables small businesses and individual buyers to access wholesale purchasing opportunities by combining orders and coordinating payments through Stellar.

The product addresses several interconnected problems:

- Buyers cannot always meet suppliers' Minimum Order Quantities (MOQ) individually.
- Importers and distributors may struggle to secure enough confirmed demand before acquiring inventory.
- Buyers lack transparent mechanisms to protect advance payments.
- Collective purchasing is often coordinated manually through messaging applications, spreadsheets, and bank transfers.
- Participants have limited visibility into order progress, payment conditions, cancellations, and refunds.
- Importers need better tools to consolidate orders and understand committed demand.

The platform connects buyers and commercial operators through structured purchasing opportunities called **Collective Orders**.

Each Collective Order defines products, quantities, minimum purchasing requirements, deadlines, pricing, delivery conditions, and payment rules.

Buyers participate by reserving quantities and, where required, contributing funds.

Stellar smart contracts provide programmable mechanisms for holding funds, verifying financial conditions, authorizing releases, and processing refunds.

The product's intended outcomes are:

1. Enable buyers to access purchasing conditions that would otherwise require larger individual orders.
2. Help commercial operators consolidate demand before committing to procurement.
3. Provide transparent, verifiable payment and refund mechanisms.
4. Reduce administrative work associated with coordinating collective purchases.
5. Improve visibility into commercial operations from order creation to fulfillment.
6. Establish a scalable foundation for marketplace functionality, buyer-driven demand, and international commerce.

Success must be validated through actual purchasing costs, confirmed orders, operational efficiency, and user adoption. Blockchain transactions alone do not establish commercial success.

## Positioning

A B2B-first collective commerce platform combining group purchasing, order management, and conditional payments powered by Stellar.

Unlike traditional wholesale marketplaces, the product focuses on aggregating purchasing demand before procurement takes place.

Unlike informal group purchasing arrangements, it introduces structured commercial agreements, transparent order progress, verifiable transactions, and programmable refund conditions.

Unlike crowdfunding or investment platforms, participants purchase identifiable merchandise. They do not acquire investment rights or receive promised financial returns.

The product's main differentiators are:

- **Collective Purchasing:** Multiple buyers contribute toward a shared minimum order requirement.
- **Conditional Payments:** Funds can be held and released according to predefined smart contract rules.
- **Buyer Protection:** Failed collective orders can trigger eligible refunds.
- **Demand Aggregation:** Commercial operators receive visibility into reserved quantities, committed purchases, and purchasing interest.
- **Transparent Commercial Conditions:** Product specifications, pricing, deadlines, delivery commitments, and cancellation policies are presented before participation.
- **Verifiable Financial Activity:** Blockchain transactions provide auditable evidence of contributions, releases, and refunds.
- **Importer-Centric Workflows:** Existing commercial operators can manage purchasing opportunities for their established customers without immediately depending on an open marketplace.

The platform should prioritize business value and usability rather than requiring users to understand blockchain concepts.

## Operating Context

The initial market is Bolivia, with potential expansion into other Latin American countries.

The initial commercial model is B2B-first, allowing established importers and distributors to offer collective purchasing opportunities to their existing customers.

The product operates through three connected layers:

### Commercial Layer

Responsible for:

- Product listings and specifications.
- Collective Orders and purchasing conditions.
- Buyer reservations and confirmed orders.
- Minimum Order Quantity tracking.
- Commercial operator management.
- Procurement milestones.
- Delivery tracking.
- Cancellation and dispute workflows.

### Financial Layer

Responsible for:

- Stellar wallet integration.
- Stablecoin payments, initially represented by test assets in the MVP.
- Smart contract escrow.
- Contribution tracking.
- Funding deadlines.
- Conditional fund releases.
- Refund eligibility and execution.
- On-chain transaction verification.

### Platform Layer

Responsible for:

- Authentication and authorization.
- User and organization management.
- Operational dashboards.
- Business rules and validation.
- Notifications.
- Transaction indexing and synchronization.
- Administrative monitoring.
- Audit logs.

### Suggested Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS.
- **Backend:** NestJS, TypeScript, REST API.
- **Database:** PostgreSQL.
- **Cache and asynchronous processing:** Redis and background jobs when needed.
- **Blockchain:** Stellar.
- **Smart Contracts:** Soroban using Rust.
- **Payments:** Stellar-compatible assets, with USDC considered for future production use subject to technical, commercial, and regulatory feasibility.
- **Authentication:** Secure account authentication with role-based authorization.
- **Infrastructure:** Cloud deployment with separate development, testing, and production environments.

The platform manages commercial information off-chain, while smart contracts manage the financial rules that require blockchain verification.

Physical procurement, importation, customs procedures, and delivery remain responsibilities of the Commercial Operator unless a different contractual arrangement is established.

## Capabilities and Constraints

The target product is a responsive web application for desktop and mobile browsers. Its planned architecture includes a Next.js, React, and TypeScript frontend, a backend API, and Stellar infrastructure for collective payments, escrow, and verifiable transactions. This describes the intended product architecture; it does not imply that these modules are already implemented in this repository.

### Core Functional Modules

#### 1. Authentication and User Management

- Register and authenticate users.
- Support Buyer, Commercial Operator, and Administrator roles.
- Manage personal and organization profiles.
- Assign permissions based on user roles.
- Associate buyers with their orders and transactions.
- Associate operators with their published offers.
- Maintain secure sessions and protected application routes.

#### 2. Commercial Operator Management

- Create and manage operator profiles.
- Store commercial contact information.
- Manage published products and offers.
- Display the operator responsible for each Collective Order.
- Track the operator's commercial activities.
- Support future KYB verification, commercial history, and reputation mechanisms.

#### 3. Products and Collective Orders

- Create purchasing opportunities containing one or more products.
- Define product descriptions, specifications, images, prices, and quantities.
- Configure Minimum Order Quantity (MOQ).
- Configure funding goals when applicable.
- Define opening and closing dates.
- Define delivery conditions and estimated timelines.
- Define cancellation and refund policies.
- Publish, update, close, or cancel offers according to their current state.
- Display the progress toward fulfilling the collective purchasing requirement.

#### 4. Buyer Participation

- Browse available Collective Orders.
- Review commercial conditions before participation.
- Choose products and quantities.
- Calculate the corresponding payment amount.
- Confirm participation.
- View personal reservations and contributions.
- Track the status of collective purchases.
- Access transaction details and refund information.

#### 5. Stellar Payments and Escrow

- Connect a Stellar-compatible wallet.
- Create or associate an escrow with a Collective Order.
- Submit contributions through authorized blockchain transactions.
- Track the amount deposited into escrow.
- Verify whether the purchasing goal has been reached.
- Enforce funding deadlines.
- Prevent unauthorized fund movements.
- Support authorized fund releases.
- Enable eligible refunds when the Collective Order fails or is canceled according to its predefined rules.
- Display transaction hashes and blockchain verification links.
- Synchronize on-chain events with application records.

Meeting the funding goal must not automatically imply authorization to release all funds. Release conditions must be explicitly configured and enforced.

#### 6. Order Status and Monitoring

The system should distinguish commercial order status from financial escrow status.

Commercial states may include:

- Draft
- Published
- Collecting Orders
- Minimum Reached
- Procurement Pending
- Procurement in Progress
- In Transit
- Ready for Delivery
- Completed
- Canceled
- Disputed

Escrow states may include:

- Pending Funding
- Funding
- Fully Funded
- Awaiting Authorization
- Partially Released
- Released
- Refund Available
- Refunded
- Disputed

The exact state transitions and permissions must be defined and validated before implementation.

#### 7. Administration and Auditability

- Manage users and operator accounts.
- Review Collective Orders.
- Monitor payment and escrow status.
- Inspect blockchain transaction references.
- View system events and audit logs.
- Manage platform configuration.
- Identify failed or inconsistent blockchain synchronization events.
- Prevent unauthorized modification of financial records.

### Future Functional Modules

The following capabilities belong to the complete product vision but are not required for the hackathon MVP:

- Buyer-driven product requests.
- Demand pools and voting.
- Non-binding purchasing intentions.
- Multiple operator quotations for the same demand.
- Operator comparison and marketplace discovery.
- KYC/KYB and verified commercial profiles.
- Commercial reputation and verified transaction histories.
- Multi-milestone escrow releases.
- Formal dispute management.
- Procurement and logistics tracking.
- Document and evidence management.
- Notifications and messaging.
- Subscription and commission billing.
- Multi-country operations.
- Import and export services.
- Integrations with authorized financial and logistics partners.

## Roadmap

The roadmap defines four initial development phases, starting with the hackathon MVP.

Each phase should deliver a usable result and address a specific problem before expanding the product.

### Phase 1 — MVP: Collective Purchasing with Stellar Escrow

**Priority:** Critical

**Goal:** Demonstrate a functional collective purchase in which multiple buyers contribute funds toward a shared purchasing objective, with verifiable success and failure paths.

**Problem addressed:** Buyers need a mechanism to combine purchasing commitments without relying solely on trust between participants.

#### Functional Scope

**1. Basic Authentication and Roles**

- Implement basic authentication.
- Support Buyer and Commercial Operator accounts.
- Provide minimal Administrator access.
- Restrict offer creation to authorized operators.

**2. Collective Order Creation**

- Allow a Commercial Operator to create a Collective Order.
- Define a product, unit price, MOQ, funding deadline, and basic conditions.
- Publish the Collective Order.
- Display the offer publicly to demo users.

**3. Collective Order Discovery**

- Display available Collective Orders.
- Show product details and purchasing conditions.
- Show funding progress, remaining quantity, and deadline.
- Indicate whether participation is available.

**4. Buyer Participation**

- Allow buyers to select quantities.
- Calculate the amount required.
- Confirm purchase participation.
- Associate each contribution with the corresponding buyer and Collective Order.

**5. Stellar Wallet Integration**

- Connect a supported Stellar wallet.
- Display the connected wallet address.
- Submit and authorize Testnet transactions.
- Display transaction status and blockchain references.

**6. Smart Contract Escrow**

Implement a minimal Soroban escrow capable of:

- Creating an escrow associated with a Collective Order.
- Receiving authorized contributions.
- Tracking deposited funds.
- Verifying whether the configured goal is reached.
- Enforcing the funding deadline.
- Preventing unauthorized withdrawals.
- Supporting an authorized release after a successful funding outcome and simulated commercial approval.
- Allowing eligible contributors to reclaim funds when the goal is not achieved before the deadline.

**7. Status Visualization**

- Show funding progress.
- Display total contributions.
- Display the Collective Order's financial status.
- Show successful and failed transactions.
- Display release or refund eligibility.

**8. Demonstration Scenarios**

Successful scenario:

1. An operator publishes a Collective Order.
2. Several buyers contribute test assets.
3. The collective goal is reached.
4. The interface displays the funded status.
5. An authorized simulated milestone approval occurs.
6. The escrow releases funds according to its rules.
7. The blockchain transaction is displayed.

Failed scenario:

1. An operator publishes another Collective Order.
2. Buyers contribute test assets.
3. The funding deadline expires without reaching the goal.
4. The escrow becomes eligible for refunds.
5. Buyers execute their refunds.
6. The application displays the verified refund transactions.

#### Technical Tasks

Frontend:

- Configure the Next.js project.
- Implement authentication screens.
- Create Buyer and Operator layouts.
- Build Collective Order creation and detail screens.
- Implement contribution and wallet connection interfaces.
- Display financial states and blockchain transaction references.

Backend:

- Initialize NestJS.
- Configure PostgreSQL.
- Implement users, operators, products, Collective Orders, and contributions modules.
- Implement role-based authorization.
- Provide APIs for Collective Order management.
- Synchronize and verify Stellar transaction results.
- Prevent duplicate processing of blockchain events.

Smart Contracts:

- Configure Soroban Rust development.
- Implement escrow creation and funding.
- Implement authorization and contribution accounting.
- Implement goal and deadline validation.
- Implement authorized release and refund operations.
- Write unit tests for successful and failed funding.
- Deploy the contract to Stellar Testnet.

#### MVP Constraints

- Use Stellar Testnet only.
- Do not use real customer funds.
- Use a fictional Commercial Operator.
- Use demo merchandise and simulated procurement events.
- Do not implement real importation or shipping.
- Do not implement real KYC/KYB.
- Do not require a complete marketplace.
- Do not implement complex disputes or reputation systems.
- Focus on one complete, demonstrable purchasing flow.
- All financial transitions must be validated by the smart contract rather than trusting the frontend.

#### MVP Definition of Done

The MVP is complete when:

- An operator can publish a Collective Order.
- Multiple buyers can participate.
- Contributions can be verified on Stellar Testnet.
- The contract correctly detects whether the goal is reached.
- A successful operation can release funds only after the required authorization.
- An unsuccessful operation allows eligible refunds.
- Buyers can see their participation and transaction status.
- Both success and failure scenarios are reproducible.
- Core contract tests pass.

### Phase 2 — Commercial Validation and Private B2B Pilot

**Priority:** High

**Goal:** Validate the commercial usefulness of Collective Orders with existing importers and their customers.

**Problem addressed:** The MVP demonstrates programmable payments but does not prove that the solution improves real purchasing workflows.

#### Functional Scope

**1. Realistic Operator Profiles**

- Create detailed Commercial Operator profiles.
- Support organization information.
- Associate users with organizations.
- Allow operators to manage their own Collective Orders.

**2. Private Collective Orders**

- Allow operators to publish invitation-only offers.
- Generate participation links.
- Restrict access to selected buyers when necessary.
- Support an operator's existing customer network.

**3. Improved Catalog and Order Management**

- Support multiple products or variants per offer.
- Manage buyer reservations.
- Display quantity commitments.
- Support configurable MOQ and deadlines.
- Allow the operator to monitor participation.
- Record buyer acceptance of purchasing conditions.

**4. Buyer Dashboard**

- Display active purchases.
- Show reserved and confirmed quantities.
- Track upcoming deadlines.
- Display financial and commercial states independently.
- Show cancellation and refund conditions.

**5. Operator Dashboard**

- Monitor active and completed Collective Orders.
- Review participants and confirmed quantities.
- Track progress toward MOQ.
- Export order summaries.
- Inspect transaction history.

**6. Notifications**

- Notify buyers about upcoming deadlines.
- Notify operators when minimum quantities are reached.
- Notify participants about cancellation or status changes.

**7. Commercial Validation Tools**

- Capture time required to consolidate orders.
- Track conversions from invitation to confirmed participation.
- Compare collective prices against conventional purchasing alternatives.
- Collect operator and buyer feedback.

#### Technical Tasks

- Expand organization and permission models.
- Implement private-offer access control.
- Add product variants and order line items.
- Implement reservation and order management.
- Introduce notification infrastructure.
- Add reporting and basic analytics.
- Improve blockchain synchronization reliability.
- Implement automated integration tests.

#### Phase 2 Constraints

- Prefer pilot operations without real fund custody until regulatory and contractual requirements are resolved.
- Do not assume that a paid deposit is necessary for every reservation.
- Keep the pilot limited to a small number of operators.
- Commercial outcomes must be measured rather than assumed.

#### Definition of Done

- At least one operator can independently manage a private Collective Order.
- Buyers can join and track their orders.
- The system distinguishes interest, reservations, and funded commitments.
- The operator can consolidate orders without external spreadsheets.
- The team can measure administrative time and buyer participation.

### Phase 3 — Production Payments, Verification, and Commercial Protection

**Priority:** High, conditional on validation and regulatory readiness

**Goal:** Prepare the platform for commercial payment operations with suitable financial safeguards, business verification, and controlled fund releases.

**Problem addressed:** Real-world collective purchasing introduces financial risk, operator verification requirements, disputes, and commercial obligations beyond the MVP.

#### Functional Scope

**1. Buyer Identity Verification**

- Implement KYC workflows where appropriate.
- Verify buyer identity and required business information.
- Protect sensitive documents and personal information.
- Track verification status without publishing private identity data on-chain.

**2. Commercial Operator Verification**

- Implement KYB procedures.
- Verify business registration and representatives.
- Maintain operator verification status.
- Distinguish verified information from operator-declared information.
- Support periodic review of business credentials.

**3. Production-Ready Escrow**

- Support production-compatible payment assets through permitted providers.
- Introduce configurable release conditions.
- Support milestone-based fund releases.
- Require appropriate authorization before payouts.
- Support cancellation and refund procedures.
- Maintain accounting consistency between blockchain and backend systems.

**4. Commercial Milestones**

- Define procurement and fulfillment milestones.
- Assign authorized verifiers.
- Attach evidence to milestone requests.
- Approve or reject milestone completion.
- Connect approved milestones to authorized fund-release workflows.

**5. Dispute Management**

- Allow buyers and operators to report incidents.
- Track disputed payments and commercial obligations.
- Prevent inappropriate fund releases while relevant disputes are active.
- Record evidence, decisions, and resolution history.
- Apply predefined contractual and smart contract rules.

**6. Financial Transparency**

- Display contribution and payment history.
- Show released and retained balances.
- Provide downloadable transaction summaries.
- Track platform fees.
- Support reconciliation and operational auditing.

#### Technical Tasks

- Complete legal and regulatory assessment for each operational market.
- Integrate suitable identity verification services.
- Implement verification and dispute modules.
- Extend smart contracts for milestone release mechanisms.
- Introduce role separation for fund authorization.
- Perform security reviews and smart contract audits.
- Implement financial reconciliation and monitoring.
- Strengthen key management and operational security.
- Establish recovery, incident response, and service continuity procedures.

#### Phase 3 Constraints

- Real funds must not be accepted before the required legal, security, contractual, and provider arrangements exist.
- Smart contracts do not independently verify delivery or merchandise quality.
- External evidence requires trusted verification procedures.
- Personal data must be protected off-chain.
- Operators remain responsible for their commercial obligations.

#### Definition of Done

- Buyers and operators can complete applicable verification procedures.
- The platform supports properly authorized payment operations.
- Conditional releases follow documented commercial rules.
- Refunds and disputes have defined, tested procedures.
- Security and regulatory prerequisites have been addressed.
- Financial records can be reconciled against blockchain transactions.

### Phase 4 — Demand Marketplace and Buyer-Initiated Purchasing

**Priority:** Medium

**Goal:** Expand beyond operator-created offers by allowing buyers to generate demand and commercial operators to compete to fulfill it.

**Problem addressed:** Buyers may need products that are not currently offered, while operators lack structured visibility into potential collective purchasing demand.

#### Functional Scope

**1. Buyer Product Requests**

- Allow buyers to propose products for collective purchasing.
- Specify product descriptions, desired quantities, delivery locations, and preferred dates.
- Attach references or product specifications.
- Publish requests to eligible participants.

**2. Demand Pools**

- Group related product requests.
- Allow buyers to express purchasing interest.
- Aggregate estimated quantities.
- Display demand by product, category, and location.
- Prevent duplicated or manipulated participation.

**3. Voting and Preferences**

- Allow buyers to support requests.
- Collect preferences for proposed commercial offers.
- Clearly distinguish votes from confirmed purchasing obligations.
- Display transparent selection criteria.

**4. Operator Quotations**

- Allow verified operators to review demand pools.
- Submit quotations with prices, MOQ, deadlines, and delivery conditions.
- Allow multiple operators to respond to the same demand.
- Compare offers based on transparent commercial criteria.

**5. Demand-to-Order Conversion**

- Select an operator quotation.
- Convert an accepted quotation into a formal Collective Order.
- Require buyers to confirm their actual quantities.
- Initiate payment commitments separately from non-binding interest.
- Apply the existing escrow workflow.

**6. Marketplace Discovery**

- Browse operators and commercial offers.
- Filter products and purchasing opportunities.
- Compare operators and conditions.
- Display verified operational histories.
- Recommend related demand pools and offers.

**7. Reputation and Commercial History**

- Display completed operation histories.
- Track fulfillment and cancellation performance.
- Present verified commercial indicators.
- Support structured buyer feedback.
- Prevent unverified allegations from being presented as established facts.

#### Technical Tasks

- Implement demand requests and demand pools.
- Develop voting, deduplication, and moderation rules.
- Build operator quotation workflows.
- Implement offer comparison.
- Develop conversion from demand pools to Collective Orders.
- Add marketplace search and filtering.
- Introduce commercial reputation and analytics.
- Optimize database queries and indexing.
- Extend notification and event processing infrastructure.

#### Phase 4 Constraints

- Votes are not financial commitments.
- Expressions of interest must not be counted as funded orders.
- Operator selection criteria must be transparent.
- Buyer data and demand analytics must follow privacy requirements.
- Verified commercial information must be distinguished from user-generated claims.

#### Definition of Done

- Buyers can create and support product requests.
- Operators can respond with competing commercial quotations.
- Buyers can compare quotations.
- An accepted quotation can become a Collective Order.
- Confirmed purchases use the existing financial workflow.
- The platform tracks conversion from expressed demand to completed orders.

## Beyond Phase 4

Future expansion may include:

- Logistics and shipping tracking.
- Integration with customs brokers and freight providers.
- Commercial documentation and proof of delivery.
- Multi-country and multi-currency purchasing.
- Regional import and export marketplace capabilities.
- Automated supplier integrations.
- Advanced purchasing analytics.
- Subscription-based commercial management tools.
- Commercial operator APIs and white-label solutions.
- Evaluation of a platform-affiliated importing business.
- Optional commercial financing through properly authorized partners.

These capabilities represent longer-term opportunities and are not committed deliverables for the first four phases.

## Evidence on Hand

The project is based on three existing documents:

1. **Documento Rector Comercio Colectivo v0.4:** Defines the B2B-first commercial direction, user roles, purchasing workflows, escrow demonstration, verification proposals, demand-pool concepts, and future expansion possibilities.
2. **Guía de Sondeo con Importadores:** Defines research questions and validation objectives for established importers, including ordering practices, capital requirements, advance payments, and willingness to adopt the platform.
3. **Proyecto Final:** Summarizes the initial problem, collective purchasing concept, Stellar escrow objectives, and hackathon demonstration scope.

Current evidence supports the relevance of small businesses, wholesale purchasing barriers, commercial financing limitations, and the existence of collective importation business models.

However, the following outcomes remain unverified for this specific product:

- Actual savings generated for participating buyers.
- Demand from identified commercial operators.
- Willingness to pay platform fees.
- Acceptance of USDC and wallet-based payments.
- Reduction in administrative costs.
- Conversion from purchasing interest to funded commitments.
- Reliability of real-world milestone verification.

The product must not present hypothetical business outcomes, simulated transactions, or unverified market assumptions as demonstrated results.

The current `co-business-web` repository contains the unmodified Next.js starter page. The product capabilities and roadmap in this document describe intended scope and must not be represented as implemented until the code provides evidence.

## Product Principles

- **Business Value First:** Prioritize measurable commercial benefits over blockchain novelty.
- **Buyers Purchase Goods, Not Investments:** Never present collective purchases as financial investment products or promise returns.
- **Transparency by Design:** Show quantities, pricing, fees, deadlines, contractual conditions, and transaction status clearly.
- **Financial Safety:** Enforce critical payment rules through secure, auditable contracts and suitable operational controls.
- **No Automatic Trust in External Events:** Funding completion does not prove procurement, shipment, or delivery.
- **Separate Commercial and Financial States:** Represent business progress independently from on-chain payment progress.
- **Progressive Complexity:** Begin with a small complete workflow and introduce advanced capabilities in later phases.
- **Minimal Blockchain Friction:** Users should not need advanced Web3 knowledge to understand collective purchasing.
- **Explicit Authorization:** Fund releases, refunds, and administrative interventions must follow defined permissions.
- **Privacy and Compliance:** Keep personal and sensitive commercial information protected, with only appropriate data recorded on-chain.
- **Evidence-Based Development:** Validate product decisions using real operators, buyers, quotations, and operational metrics.
- **Reusable Architecture:** Design Collective Orders, payments, and organizations to support future marketplace capabilities.
- **Clear Responsibility:** Commercial Operators remain responsible for procurement and delivery unless contractual arrangements explicitly establish otherwise.
- **MVP Discipline:** Deliver the complete successful and unsuccessful escrow scenarios before expanding into additional features.
- **No Invented Results:** Do not claim customer adoption, savings, verified operators, or real-world transaction success without supporting evidence.
