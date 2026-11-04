-- Additive spam flags for the public lead forms.
-- Apply this in the Neon SQL editor (or psql) BEFORE deploying the app change.
-- Do not run `npm run db:push` or any other schema push against production.
--
-- Safe to re-run: every column uses IF NOT EXISTS and defaults to not spam,
-- so existing rows stay visible in /admin.

ALTER TABLE contact_inquiries
  ADD COLUMN IF NOT EXISTS is_spam boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS spam_reason text;

ALTER TABLE registration_waitlist
  ADD COLUMN IF NOT EXISTS is_spam boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS spam_reason text;

ALTER TABLE location_suggestions
  ADD COLUMN IF NOT EXISTS is_spam boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS spam_reason text;

COMMENT ON COLUMN contact_inquiries.is_spam IS 'Hidden in admin and CSV exports unless Show spam is on. Never deleted.';
COMMENT ON COLUMN contact_inquiries.spam_reason IS 'Why the row was flagged, or "Marked by an admin".';
COMMENT ON COLUMN registration_waitlist.is_spam IS 'Hidden in admin and CSV exports unless Show spam is on. Never deleted.';
COMMENT ON COLUMN registration_waitlist.spam_reason IS 'Why the row was flagged, or "Marked by an admin".';
COMMENT ON COLUMN location_suggestions.is_spam IS 'Hidden in admin and CSV exports unless Show spam is on. Never deleted.';
COMMENT ON COLUMN location_suggestions.spam_reason IS 'Why the row was flagged, or "Marked by an admin".';
