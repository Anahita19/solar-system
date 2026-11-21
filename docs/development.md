# Development, Configuration, and Deployment

## Requirements

- Node.js compatible with the Cloud/runtime environment and the `pnpm` version declared by `package.json`.
- MySQL-compatible database for database-backed development.
- Platform OAuth/session configuration for the full application.
- Access to the platform Maps proxy and owner-notification service for those integrations.

## Environment variables

Provide values through a secure development or deployment secret/configuration manager. Never commit a real `.env` file.

| Name | Sensitivity | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Secret | Drizzle/MySQL connection string |
| `MANUS_PROJECT_ID` | Infrastructure | OAuth project identifier |
| `MANUS_JWT_SECRET` | Secret | Session/auth signing |
| `MANUS_OAUTH_API_URL` | Infrastructure | Server-side OAuth service |
| `MANUS_OAUTH_PORTAL_URL` | Public | Login portal URL |
| `MANUS_API_URL` | Infrastructure | Base URL for Maps and notification endpoints |
| `MANUS_API_KEY` | Secret | Server-side key for Maps proxy and notifications |
| `MANUS_API_BROWSER_KEY` | Public | Platform browser configuration; the current map flow uses the server-side endpoint |
| `SOLACE_OWNER_EMAIL` | Secret | Email allowed to access `/admin` in a reviewed production configuration |
| `PORT` | Non-secret | Server port; defaults to `3000` |
| `NODE_ENV` | Non-secret | Node runtime mode |

Managed-platform values are provided by the platform runtime. When running elsewhere, configure compatible OAuth and Maps providers. Never expose `MANUS_API_KEY` through frontend build variables or tracked files.

## Local development

```bash
pnpm install
# Provide DATABASE_URL and any required runtime credentials through a secure environment.
pnpm db:migrate
pnpm dev
```

The development server listens on `PORT`, defaulting to `3000`. The current codebase intentionally keeps `IS_PUBLIC_DEMO = true` in `shared/site-mode.ts`; lead submissions, owner notifications, and owner lead listing remain blocked. A database is still required for database-backed development, authentication, or production-intended flows. Address imagery requires the server-side Maps integration. `pnpm dev:static` can be used to view static frontend routes but does not provide Express APIs, database access, authentication, or the map proxy.

## Database commands

- `pnpm db:migrate` applies checked-in migrations under `drizzle/`.
- `pnpm db:push` generates and applies a migration for an intentional schema change; do not use it for routine startup.
- The schema is defined in `drizzle/schema.ts`; Drizzle configuration is in `drizzle.config.ts`.
- Back up shared environment data before changing the schema.

## Quality checks

```bash
pnpm check       # TypeScript checks
pnpm test        # Vitest suite
pnpm build       # Frontend and production server build
```

Keep `client/public/manus-routes.json` synchronized when routes change.

## Deployment and live-demo publication

The full application requires a Node/Express runtime, MySQL, secrets, OAuth, and the platform API proxy. GitHub Pages only serves static files and cannot run `/api/trpc`, `/api/property-map`, owner authentication, or persistence.

The project is connected to the GitHub repository `Anahita19/solar-system`, and automatic publishing is off. For this GitHub-canonical project, the live site must be published from the Manus Dashboard after signing in. A saved commit, successful GitHub push, or working Preview is not proof of publication. Confirm the deployment is reachable and public before sharing a permanent URL; until then, do not call a Preview URL the live demo. Update the README and this guide with the verified URL after deployment succeeds.

Before any commercial launch, explicitly review the demo guard, verified company content, image rights, legal and accessibility requirements, estimate assumptions, database, OAuth, and notification behavior. Do not disable `IS_PUBLIC_DEMO` until those reviews and production configuration are complete.
