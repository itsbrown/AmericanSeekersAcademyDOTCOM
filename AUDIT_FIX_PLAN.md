# AUDIT_FIX_PLAN.md — American Seekers Academy Marketing Site

**Date:** 2026-05-28  
**Repo:** itsbrown/AmericanSeekersAcademyDOTCOM (cloned locally)  
**Audit Context:** Full code review of Replit-built marketing site vs. the enrollment platform in `homeschool_co-op`.

---

## Executive Summary

The public marketing site **mostly functions** for parent-facing flows, but has two critical problems that must be fixed before it can be considered reliable:

1. **Documentation is dangerously outdated** (especially email/CRM)
2. **Email delivery is fragile** with poor observability and inconsistent error handling

This plan prioritizes fixes that deliver the highest safety and maintainability gains with the least risk.

---

## Priority 1: Documentation Accuracy (CRITICAL — Do First)

### Problem
`replit.md` contains an entire fabricated section describing a **HubSpot transactional email system** (with template IDs, Private App scopes, `HUBSPOT_TRANSACTIONAL_EMAIL_ID`, etc.) that **does not exist** in the code.

**Actual implementation (as of May 2026):**
- All transactional emails use **SendGrid** (`@sendgrid/mail`)
- HubSpot is used **only** for CRM contact upsert (`addHubSpotContact`)
- The admin "Email Health" test flows test **SendGrid** delivery
- `email_test_runs` table stores SendGrid results in columns still named `hubspot_*`

This mismatch will cause:
- Wrong secrets being configured
- Failed email delivery in production
- Future developers (or AI agents) building on completely false assumptions

### Recommended Fix
1. Delete/rewrite the entire "HubSpot Integration (Email & CRM)" section in `replit.md`
2. Add a clear, accurate **"Email & CRM Integration"** section describing the real architecture
3. Add a new top-level **"Required Environment Variables"** section early in the document
4. Create `.env.example` file (currently missing)
5. Update the "Key NPM Packages" list (remove mention of unused `express-session`)

### Files to Change
- `replit.md` (major rewrite of ~50 lines)
- Create new: `.env.example`

### Acceptance Criteria
- A developer with no prior knowledge can correctly configure email/CRM after reading the docs
- `replit.md` no longer mentions HubSpot transactional templates or `HUBSPOT_TRANSACTIONAL_EMAIL_ID`

---

## Priority 2: Email Robustness & Observability (HIGH)

### Problem
- Multiple fire-and-forget email calls with only `console.error`
- Inconsistent behavior: some failures throw (breaking user flow), others silently skip
- `sendProgramInfoEmail` failure currently can 500 the user's program info request
- `email_test_runs` table uses misleading column names (`hubspotStatusId`, `hubspotSendId`) for SendGrid data
- No structured logging of provider, message ID, or error details
- No retry for transient SendGrid failures
- Admin test endpoints still write to the old `hubspot_*` fields

### Recommended Fixes (in order)

#### 2.1 Make Email Failures Non-Fatal for Users (Quick Win)
- Wrap the awaited `sendProgramInfoEmail` call so a SendGrid failure does **not** fail the user's submission.
- Always save the DB record first, then attempt email.

#### 2.2 Improve Structured Logging & Error Handling
- Create a small helper `sendEmailSafe()` that:
  - Always resolves (never throws to caller)
  - Returns rich result object: `{ success, provider, sendId, statusId?, error? }`
  - Logs with consistent format including flow name

#### 2.3 Fix Misleading Audit Fields (Minimal Schema Change)
Options (choose one):
- **Preferred (no migration):** Keep existing columns. Add new optional columns `provider` and `providerMessageId`. Update all insert sites.
- **Clean (requires migration):** Rename `hubspotStatusId` → `providerStatusId`, etc. + backfill.

For speed, start with **adding `provider` + `providerMessageId`** columns + updating code + docs.

#### 2.4 Add Lightweight Retry for Transient Failures
- Simple 1-retry with 500ms delay for 5xx / network errors from SendGrid.

#### 2.5 Update Admin Email Test Endpoints
- Store accurate `provider: "sendgrid"`, real send IDs, and better error messages.
- Update the success messages in the UI responses.

### Files to Change
- `server/routes.ts` (main work)
- `shared/schema.ts` (add 1-2 columns to `emailTestRuns`)
- `server/storage.ts` (update `createEmailTestRun` signature if needed)
- `replit.md` (document the new reality)

### Acceptance Criteria
- A program info request never 500s because of email failure
- All email attempts produce a row in `email_test_runs` with clear `provider` and error info
- Admin can see exactly what SendGrid returned even on partial failures

---

## Priority 3: Security & Technical Debt Hygiene (MEDIUM)

### 3.1 Remove Unused Authentication Dependencies
`passport`, `passport-local`, `express-session`, `connect-pg-simple`, and `memorystore` are declared but **never imported or used** in `server/`.

**Action:** Remove from `package.json` and run `npm install`.

### 3.2 Fix Dangerous Error Handler Pattern
In `server/index.ts`:
```ts
res.status(status).json({ message });
throw err;   // <-- This can crash the process after response sent
```
**Action:** Remove the `throw`.

### 3.3 Reduce Spam Risk on Public Analytics Endpoint
`POST /api/analytics/pageview` is completely open.

**Options:**
- Add simple in-memory rate limiting per IP (5-10 req/min)
- Or require a lightweight CSRF-style token from the client
- Or just document it as "best-effort, not security-critical"

### 3.4 Other Quick Comments
- Add JSDoc warnings on all `createdAt` `text` columns noting they are ISO strings (not real timestamps)
- Consider adding `X-Robots-Tag` or stronger protection on `/admin` routes (currently only client-side `noindex`)

---

## Implementation Order & Effort Estimate

| Priority | Item | Effort | Risk | Recommended Order |
|----------|------|--------|------|-------------------|
| 1 | Rewrite `replit.md` email/CRM section + add Required Env Vars | 1-2 hrs | Low | 1st |
| 1 | Create `.env.example` | 30 min | Low | 2nd |
| 2.1 | Make program email non-fatal | 30 min | Very Low | 3rd |
| 2.2 + 2.4 | Add `sendEmailSafe` helper + basic retry | 2-3 hrs | Low | 4th |
| 2.3 | Add `provider` / `providerMessageId` columns + update code | 1.5 hrs | Medium (needs migration) | 5th |
| 3.1 | Remove unused passport/session packages | 15 min | Low | Anytime |
| 3.2 | Fix error handler throw | 5 min | Very Low | Anytime |
| 3.3 | Light protection on analytics endpoint | 1 hr | Low | Later |

---

## Post-Fix Verification Steps

1. Set up a test Replit or local env with valid `SENDGRID_API_KEY` + `ADMIN_PASSWORD` + `DATABASE_URL`
2. Submit all public forms (contact, location, program info x3 programs, newsletter, waitlist)
3. Use the Admin → Email Health tab to run all three test flows
4. Verify:
   - Emails arrive in the expected inboxes
   - `email_test_runs` rows have clear `provider: "sendgrid"` data
   - No 500s on the public forms even if SendGrid is temporarily down
5. Check that `replit.md` now accurately describes the email system

---

## Notes for Future Maintainers

- The "Email Health" feature in the admin dashboard is actually quite valuable — keep it, just make the data honest.
- SendGrid requires the `contact@americanseekersacademy.com` (or `noreply@...`) address to be a verified sender in the SendGrid account.
- HubSpot CRM upsert is best-effort only (failures are logged but do not block user flows).

---

## Status

- [x] Priority 1 Documentation fixes applied
- [x] Priority 2 Email robustness fixes applied
- [x] Priority 3 Hygiene items applied
- [x] Admin route hardening completed (blog APIs protected + consistent login gate on both admin pages)
- [ ] Verification completed on staging (manual verification performed locally)

**Last Updated:** 2026-05-28 by Grok audit agent

---

## Applied Patches (as of this session)

The following concrete changes have already been made:

### Documentation (Priority 1)
- [x] Replaced entire obsolete "HubSpot Integration (Email & CRM)" + "HubSpot Portal Setup Requirements" sections in `replit.md` with accurate "Email & CRM Integration (Actual Implementation)" content describing SendGrid + optional HubSpot CRM.
- [x] Added clear "Required Environment Variables" table.
- [x] Updated "Key NPM Packages" section to remove false claims about express-session/passport and note they are unused.
- [x] Created new `.env.example` file with explanations and SendGrid requirements.

### Email Robustness (Priority 2)
- [x] Made program info request email sending **non-blocking** (`sendProgramInfoEmail` is now fire-and-forget with structured error logging). User submissions will no longer 500 due to SendGrid issues.
- [x] Improved structured error logging for contact inquiry and location suggestion email failures.
- [x] Cleaned up misleading error handling and comments in the program info route (removed HubSpot references in error paths).
- [x] Added explanatory comment in `shared/schema.ts` on the `emailTestRuns` table about the legacy `hubspot_*` column names.

### Hygiene / Safety (Priority 3)
- [x] Fixed dangerous pattern in `server/index.ts` error handler (`throw err` after sending response removed; now logs instead).

### Artifacts Created
- `AUDIT_FIX_PLAN.md` (this file) — living plan and record of the audit.
- `.env.example` — previously completely missing.

### Remaining High-Value Work (Recommended Next)
1. ~~Add `provider` and `providerMessageId` columns to `email_test_runs` + update all insert sites in `routes.ts` (and the admin UI if it renders those fields).~~ **COMPLETED (Option 1)**
2. ~~Extract a small reusable `sendEmailSafe()` helper in `server/routes.ts` for consistent behavior + optional retry.~~ **COMPLETED (Option 2)**
   - New helper added with 1-retry logic for transient errors, never throws, consistent structured results, and centralized `[email]` logging.
   - All four high-level email functions now go through the safe helper.
   - Admin test endpoints and public form handlers simplified.
3. ~~Remove unused `passport*` and `express-session*` packages from `package.json`.~~ **COMPLETED (Option 3)**
   - Removed from both `dependencies` and `devDependencies`:
     - `passport`, `passport-local`, `express-session`, `connect-pg-simple`, `memorystore`
     - `@types/passport`, `@types/passport-local`, `@types/express-session`, `@types/connect-pg-simple`
4. ~~(Optional) Light rate limiting or logging on the public `/api/analytics/pageview` endpoint.~~ **COMPLETED (Option 4)**
   - Added in-memory per-IP rate limiter (default 40 views / 5 min window).
   - Still returns success to clients when limited (non-disruptive).
   - Added cleanup interval + throttled warning logs.
   - Made limits configurable via `ANALYTICS_RATE_LIMIT` and `ANALYTICS_RATE_WINDOW_MINUTES`.
   - Updated `.env.example` and `replit.md` with documentation.

**Post-cleanup step (required):** After pulling these changes, run `npm install` in the project. This will update `package-lock.json` and remove the packages from `node_modules`. You can also run:

```bash
npm uninstall passport passport-local express-session connect-pg-simple memorystore @types/passport @types/passport-local @types/express-session @types/connect-pg-simple
```

**Note:** After pulling these changes, run `npm run db:push` (or equivalent Drizzle migration) in the environment that owns the database so the new columns are created. Existing rows will continue to work (new columns are nullable).

---

## Next Remaining / Future Work (Started 2026-05-28)

### 5. Schema Cleanup & Technical Debt (Ongoing)

**Completed in this pass:**
- Removed the entire vestigial `users` table + `insertUserSchema` + `InsertUser`/`User` types from `shared/schema.ts`.
- Removed corresponding `getUser`, `getUserByUsername`, and `createUser` methods from `IStorage` interface and `DatabaseStorage` implementation.
- Added a clear **DATE HANDLING NOTE** at the top of `shared/schema.ts` explaining the current `text()` ISO string approach for all timestamps, with a recommendation for future migration to proper `timestamp` columns.
- Added inline comments on several `createdAt` fields as examples.

**Why this matters:**
- The `users` table and its methods were dead code (no routes called them).
- Cleaning it reduces confusion for future developers.
- The date column documentation makes the current (suboptimal but working) pattern explicit.

**Remaining in this area (lower priority):**
- ~~Migrate timestamp columns from `text` (ISO strings) to proper `timestamp(..., { withTimezone: true })`.~~ **Largely Complete**
- Improve protection around `/admin` and `/blog/admin` routes (SPA pages were publicly routable). **Completed 2026-05-28** (see "Admin Route Hardening" section above).

### Admin Route Hardening (Completed 2026-05-28)
- Protected `GET /api/blog/all`, `POST /api/blog`, `PUT /api/blog/:id`, and `DELETE /api/blog/:id` with the existing `requireAdmin` middleware.
- Gave `/blog/admin` the same login + session verification flow as `/admin` (via new shared `useAdminAuth` hook).
- Extracted reusable auth helpers + hook (`client/src/hooks/use-admin-auth.ts`) to eliminate duplication.
- Both admin pages now show a consistent styled login gate with no flash of protected UI.
- Added server `X-Robots-Tag: noindex, nofollow` header for all paths under `/admin` and `/blog/admin`.
- Updated `AUDIT_FIX_PLAN.md` (this section) and verified no schema or forbidden-file changes were needed.
  - All date columns (`createdAt`, `publishedAt`, `sentAt`, `expiresAt`, `inboxConfirmedAt`, etc.) converted in schema.
  - Storage layer fully updated (all create methods, session logic, comparisons, cleanups).
  - Routes updated (test run creation, CSV exports made defensive).
  - DATE HANDLING NOTE updated.
  - CSV export formatting updated to be safe with both Date objects and legacy strings.
  - **Required action:** After pulling, run `npm run db:push`. This is a breaking schema change (text → timestamp columns). Plan for a backfill of historical data if needed.

- ~~Add server-side rate limiting or stronger protection to the admin login endpoint (`/api/admin/login`).~~ **COMPLETED**
- Improve protection around `/admin` and `/blog/admin` routes (currently the SPA pages are publicly routable; only data APIs are protected by `requireAdmin` middleware).

Run `git diff` or review the changed files to see exact patches.

