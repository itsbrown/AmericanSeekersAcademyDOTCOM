-- Safe, idempotent migration to add columns for Facebook and Google Business Profile posting tracking
-- Run this directly in your Neon SQL editor / psql against the American Seekers Academy database.

ALTER TABLE announcements 
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS facebook_posted_at timestamptz,
  ADD COLUMN IF NOT EXISTS google_posted_at timestamptz;

-- Optional: add comments for documentation
COMMENT ON COLUMN announcements.facebook_posted_at IS 'Set when an admin explicitly clicks "Post to Facebook" for this announcement.';
COMMENT ON COLUMN announcements.google_posted_at IS 'Set when an admin explicitly triggers a post to Google Business Profile.';
