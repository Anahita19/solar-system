# Lead Management and Estimates

## Current demo behavior

The current release is a public, read-only demonstration with `IS_PUBLIC_DEMO = true`. It does not request visitor contact details or save leads. Server-side lead submissions, owner notifications, and the owner lead-list endpoint are blocked; `/admin` displays a demo notice. The remaining sections document the production-intended data model and must not be read as a claim that the public demo currently collects information.

## Production-intended form and validation

The future “Request a site assessment” flow at `/estimate` is designed to request:

- Property: address, building type, and average monthly electricity bill.
- Estimate: system size in kW, annual savings, and simple payback in years.
- Contact: name, company, role, work email, phone, and explicit consent to be contacted.
- Attribution: `utm_source`, `utm_medium`, and `utm_campaign` from the URL or values carried from the homepage.

`server/routers.ts` uses Zod validation: address length 5–500 characters, monthly bill from 100 to 10,000,000, valid email, and consent exactly `true`. Consent is mandatory for the production-intended mutation. The public-demo guard rejects the mutation before it stores a lead.

## Illustrative estimate formula

These values are simplified and non-binding. They are not a substitute for tariff analysis, engineering, shading, load, roof, or interconnection review.

```text
annualSavings = monthlyBill × 12 × 0.68
systemKw       = annualSavings ÷ (0.12 × 1,500)
paybackYears   = systemKw × 1,050 ÷ annualSavings
```

The example assumes that 68% of the annual bill can be offset, an illustrative electricity rate of `$0.12/kWh`, annual production of `1,500 kWh` per installed kW, and installed cost of `$1,050/kW`. Replace and validate these assumptions with the company's financial and engineering teams before any commercial use.

## `leads` table (production-intended)

| Columns | Contents |
| --- | --- |
| `id`, `createdAt` | Record identifier and creation time |
| `address`, `buildingType` | Property details |
| `monthlyBill` | Average monthly bill, decimal value |
| `systemKw`, `annualSavings`, `paybackYears` | Preliminary estimate outputs, decimal values |
| `name`, `company`, `role`, `email`, `phone` | Contact information |
| `consent` | Consent to contact (stored as `1` in the database) |
| `utmSource`, `utmMedium`, `utmCampaign` | Optional attribution values |

The schema and migrations are the source of truth: `drizzle/schema.ts` and `drizzle/*.sql`. Public-demo requests do not populate this table.

## Storage and owner notification (production-intended)

A future enabled flow would save a lead to MySQL, then notify the owner through the platform notification endpoint using server-side `MANUS_API_URL` and `MANUS_API_KEY`. The project does not send to a configurable customer-email destination. Notification failure is logged and does not erase an already saved lead. Notifications are disabled while public-demo mode is active.

Never test this flow against a shared or production database without an explicit, separately configured test environment and notification destination.

## `/admin` and CSV access

`SOLACE_OWNER_EMAIL` is a server-side secret and must not appear in browser code, logs, or CSV output. In a reviewed production configuration, the owner signs in through OAuth using that email. The server compares it case-insensitively, and the data route separately enforces `ownerProcedure`; UI checks alone are not an access-control boundary.

The production-intended admin table and CSV contain personally identifiable contact information and UTM data. Access to the owner account, secret, database, and exports must be restricted. In the public demo, the owner lead-list endpoint is blocked and the UI does not expose records.

Before adding more owners or team roles, design authorization and audit policies. The current intended owner check permits one configured email.
