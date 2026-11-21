# Contributing to Solace

## Suggested workflow

1. Create a separate branch for your change.
2. Before changing server behavior, review the tRPC contract, database schema, and related documentation together.
3. If the schema changes, commit the generated migration and update [Lead Management](docs/lead-management.md).
4. Run `pnpm check`, `pnpm test`, and `pnpm build`.
5. Update the English documentation and committed screenshots when the UI changes. Preserve the Persian-first language behavior unless the product owner approves a change.

## Security rules

- Never commit secrets, cookies, access tokens, `DATABASE_URL`, form submissions, or logs containing personally identifiable information.
- Enforce admin access on the server; never rely on React UI checks alone.
- Do not disable public-demo protections or send test forms to a shared/production database. The public demo rejects lead submissions, notifications, and lead-list access.
- Verify company claims, case-study data, photography rights, licences, and legal content before commercial publication.
- Add new application routes to `client/public/manus-routes.json`.

## Changes to estimate assumptions

The current formula is illustrative, not a commercial offer. Before changing it, review electricity-rate, production, CAPEX, tax-incentive, and simple-payback assumptions with finance and engineering; retain a clear disclaimer.
