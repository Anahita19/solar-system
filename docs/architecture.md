# Application Architecture

## Overview

Solace is a full-stack web application, not a static-only website. Vite and React serve the browser UI; Express hosts the application APIs and platform endpoints. tRPC provides typed calls between the frontend and server, and Drizzle connects to MySQL.

```text
Browser
  ├── React routes: /, /estimate, /admin
  ├── tRPC: /api/trpc/*
  └── GET /api/property-map?address=...
          │
Express server
  ├── OAuth/session middleware and request context
  ├── demo-mode guards for lead mutations and lead-list access
  ├── platform Maps proxy (server-side credential)
  └── owner-notification integration (blocked in demo mode)
          │
MySQL
  ├── users
  └── leads (production-intended; not populated by public-demo submissions)
```

The checked-in release sets `IS_PUBLIC_DEMO = true` in `shared/site-mode.ts`. Read-only behavior is enforced in the UI and again on the server; hiding a form alone is not the security boundary.

## UI routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage, solutions and industries, company figures, illustrative case studies, financing, news, and estimate entry point |
| `/estimate` | Property view and sample savings estimate; contact capture is disabled in public-demo mode |
| `/admin` | Owner-only lead table and CSV in a future production mode; closed in the public demo |

`client/public/manus-routes.json` declares the known routes to the platform.

## Current public-demo request flow

1. The UI presents a fixed Austin, Texas sample property and illustrative estimate values. The `?lang=en` query selects English; absent a query or saved choice, first-time visitors see Persian.
2. The browser uses the relative URL `/api/property-map`. The Express proxy permits only the fixed sample address, uses the platform Maps service with a server-side key, and caches the sample response.
3. No visitor contact form is shown. `lead.submit`, owner notification, and owner lead-list access are rejected server-side while demo mode is enabled.
4. `/admin` shows a demo notice rather than customer records. The demo does not create leads or owner notifications.

## Production-intended flows (currently disabled)

The application code includes the intended workflow for a future, reviewed production release:

1. The homepage stores the selected building type, monthly bill, property address, and UTM values for the estimate flow.
2. The estimate page would calculate preliminary system size, annual savings, and simple payback; these calculations are illustrative and require financial and engineering validation before commercial use.
3. A site-assessment form would validate consent and contact fields through Zod and store property, estimate, contact, and UTM data in the `leads` table.
4. The server would send an owner notification after saving a lead. A notification failure would not delete a successfully saved record.
5. An authenticated owner would access a server-guarded lead list at `/admin` and export CSV.

None of those write or record-list operations is active in the current public-demo build.

## API surface

- `auth.me`: current session or `null`.
- `auth.isOwner`: owner status for the authenticated account; the allowed email is read server-side.
- `auth.logout`: clear the session cookie.
- `lead.submit`: production-intended lead mutation; blocked while public-demo mode is enabled.
- `lead.adminList`: production-intended owner lead listing; protected by `ownerProcedure` and blocked in demo mode.
- `GET /api/property-map?address=...`: image response from the Maps proxy; only the fixed demo address is accepted in the current release.
- `GET /api/health`: unauthenticated health check for hosting.

## Data model

The Drizzle schema is in `drizzle/schema.ts`; versioned migrations are under `drizzle/`. OAuth users are stored in `users`; the `leads` schema describes the future lead workflow. Public-demo requests do not populate this table. See [Lead management](lead-management.md) for fields, estimate assumptions, and access-control details.

## Assets and language

Photography used by the UI lives in `client/public/images/`; documentation screenshots are in `docs/assets/`. These paths are committed so a repository clone can render the site without private project storage.

`client/src/contexts/LanguageContext.tsx` manages Persian (`fa`) and English (`en`). First-time visitors default to Persian; a `?lang=en` or `?lang=fa` query explicitly overrides that default and any stored selection. Otherwise, the language switch is saved in `localStorage`. The active language updates the document's `lang` and `dir` attributes and the UI direction.
