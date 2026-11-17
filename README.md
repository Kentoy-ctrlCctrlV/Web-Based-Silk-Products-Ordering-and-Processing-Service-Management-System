# AI Web-Based Silk Products Ordering and Processing Service Management System

This repository contains a production-oriented prototype for a silk products ordering and processing management system for a PTRI-like operations context. It is designed to demonstrate secure workflows, staff/admin controls, catalog governance, and order processing for a textile enterprise and is intentionally implemented without claiming official PTRI endorsement, approval, or brand use beyond what is explicitly authorized in the repository.

Important: this application is not a launch-ready public PTRI service and must not be deployed as an official PTRI system until PTRI authorizes the system, approves the operational policies, and confirms the security review and hosting model.

## Purpose

The system supports:
- Customer browsing and order request workflows.
- Staff order review, stock checks, delivery scheduling, and inventory operations.
- Administrative controls with role-based access and audit-minded operations.
- Catalog management that keeps unverified product records hidden from customers.
- A backend API and domain rules that validate critical business decisions server-side.

## Architecture

- Frontend: Angular 22 with standalone components and route-based pages.
- Backend: Express API with JWT-based authorization and domain validation.
- Validation: Zod request schemas and server-side domain checks.
- Data model: typed TypeScript domain model and in-memory/demo persistence for prototyping.
- Test coverage: domain-level validation tests for order transitions, stock handling, and catalog publication rules.

## Current status and production blockers

This is a prototype with production-safe guardrails, not a live operational service.

Production blockers before any real deployment or public launch:
- Formal PTRI authorization to operate the service.
- Security review of the architecture, secrets management, and access model.
- Verified, approved catalog sources and pricing documentation.
- Hosting and backups configuration for a production environment.
- Staff and administrator provisioning policy with audit logging and access review.
- Final privacy, retention, and deletion policy confirmation.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Start the Angular app:

```bash
npm start
```

3. Start the backend API in a separate terminal:

```bash
npm run server
```

4. Verify backend tests:

```bash
npm run test:backend -- --run
```

5. Build production assets:

```bash
npm run build
npm run build:server
```

## Environment variables

Create a local `.env` file in the project root before deploying or testing with real credentials.

Example:

```env
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

Do not commit production secrets or private credentials. Keep all deployment credentials in environment variables or an approved managed secrets service.

## Database, persistence, and schema notes

The repository includes a server-side data model and schema groundwork for catalog records and user records. The current local implementation is intentionally prototype-oriented and uses a memory-backed/mock persistence layer to keep the app functional without exposing fake operational data as production facts.

For production, use a managed database with migrations, backups, and retention controls. A production deployment should include:
- Postgres, MySQL, or another managed relational database.
- Migration scripts and schema versioning.
- Automated backups and restore testing.
- Audit tables for user access, catalog changes, and order-state changes.
- Server-side rate limiting and request validation.

## Role provisioning and security assumptions

The app includes three roles:
- Customer
- Staff
- Administrator

These roles are implemented as access patterns and server-side policy checks in the backend domain layer. In production, staff and admin access must be established by an authorized administrative process and reviewed by PTRI operations, not granted via browser-only state or self-service UI.

No user should be able to grant themselves staff or admin permissions. This is an explicit design requirement.

## AI features

AI-assisted features are not enabled by default. The application reports: "AI features are not configured." In a production deployment, any AI provider must be explicitly configured by an authorized administrator and credentials must remain on the server.

Customer personal data must not be sent to an AI provider unless approved policy, notice, and consent requirements are in place. AI must never independently approve orders, change prices, or modify inventory.

## Catalog source and verification report

The catalog is intentionally kept unpublished unless it is verified from an authorized public source and approved by PTRI staff. Official public PTRI product pages were reviewed during implementation, but direct public access from this environment was blocked by HTTP 403 responses. Because the official catalog source could not be verified from the environment, no real product record was published into the storefront and no invented price or unavailable photo was substituted.

Verified information:
- No published catalog items were added to the storefront because no PTRI-authorized product listing with source-verified price and photo details could be confirmed.
- Pricing is intentionally withheld and displayed as "Contact PTRI for current price" or "Price not published" when relevant.
- Photo state remains "Photo unavailable" unless authorized staff supply a source-approved image.

Items awaiting PTRI confirmation or verification:
- All catalog entries remain unpublished until official pricing and source details are verified by authorized PTRI staff.
- Source URL: Official PTRI website: https://ptri.dost.gov.ph/
- Retrieval date: 2026-11-17
- Result: Catalog public source inaccessible from this environment, so no verified product record is published.

This report is intentionally conservative: if a source is unavailable or unverified, the system does not invent data.

## Security checklist and deployment guidance

Before any production deployment, confirm the following:
- TLS is enabled and enforced for all production traffic.
- Secrets are stored in environment variables or a managed secrets service.
- JWT secrets are unique and protected.
- Production database credentials are not committed to the repo.
- Role membership is controlled by authorized administrators.
- Backups and restore steps are tested.
- Access logs and audit logs are retained according to policy.
- Rate limiting and request validation are enabled.
- Access control boundaries are enforced on the server, not only in the frontend.
- Customer personal data is minimized and stored only as required.

## Data privacy and retention assumptions

This project documents a secure design but does not claim institutional compliance certification. Production assumptions should include:
- Minimal personal data collection.
- Role-limited access to operational records.
- Auditability of staff changes and order updates.
- Clear retention and deletion policy for customer and staff records.
- PTRI review of privacy, retention, and deletion handling before launch.

## Known limitations

- This repository does not include a production deployment or hosting environment.
- Official PTRI product catalog and pricing data were not available in a verifiable form during implementation.
- The default credentials are test fixtures only and are not production identities.
- The system should be treated as a secure prototype framework pending PTRI approval.

## Validation executed

The following validation was completed in this workspace:
- Angular production build passed: `npm run build`
- Backend TypeScript build passed: `npm run build:server`
- Backend domain tests passed: `npm run test:backend -- --run`

No lint script was present in the project configuration, so there was no dedicated lint pass to run.

## Recommended next steps for PTRI review

1. Confirm institutional authorization and operational policy.
2. Provide approved catalog source pages and price evidence.
3. Approve or supply staff/admin account provisioning process.
4. Establish production hosting, backup, and monitoring plan.
5. Review the system with a security and privacy team before deployment.
6. Replace placeholder or non-public catalog conditions with verified approved records once authorized sources are available.
