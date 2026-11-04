-- One-time spam flag for rows already stored before form protection shipped.
-- DO NOT RUN the UPDATE section until the preview counts look right.
-- This file is not executed by the app, by tests, or by deployment.
--
-- Order:
--   1. Apply migrations/0002_add_spam_flags.sql (adds is_spam / spam_reason).
--   2. Run the PREVIEW select below. It does not write.
--   3. Confirm the safety check returns zero rows.
--   4. Run the UPDATE section once.
--
-- A row is counted when ANY reason matches. Real entries must not match:
--   Kylee H. (Sep 24, program Yankee Doodle)
--   Brianne / Brockport, NY
--   jaimie metz / orleans county / "brockport, holley, kent, kendall"
--   Alyson Valenti / Victor, NY / a real sentence about the program
--
-- Count logic (a row adds 1 to its source when the reason list is non-empty):
--   random-name
--     Name contains a digit, OR it is a single token (no spaces) that is
--     16+ letters, OR 5+ letters with no vowel (y counts), OR 8+ letters
--     with 4 uppercase and 4 lowercase. Names with a space are not matched
--     by the single-token rules. Lynn, Glynn, Krzysztof, and Nguyễn Văn An
--     do not match.
--   all-digit-message
--     message, comments, location_interest, or program_interest is only digits
--     (6 or more) once spaces and phone punctuation are removed.
--     Sentences and "brockport, holley, kent, kendall" do not match.
--   blocked-domain
--     Email domain is rootsec.nl (edit the list below to add more).
--   dotted-email
--     The mailbox local part contains 4 or more dots
--     (a.fakebot.a.j.752@example.com). Three dots, as in
--     j.r.r.tolkien@example.com, do not match.
--   gibberish-location
--     location or location_interest is one alphabetic token with no vowel
--     (y counts as a vowel), a robot-like start (dz, yn, jl, ...), or a
--     consonant run of 5 or more when the token is 8 letters or longer.
--     Churchville, Lyndonville, Clyde, Brockport, Victor, and Kendall do
--     not match. A run of 4 consonants, and pairs such as rz, are not
--     treated as junk, so Krzysztof, Strzelecki, Schwarzkopf, and
--     Tschirhart do not match.
--     "Yankee Doodle" is a program name, not a gibberish location.
--   gibberish-program
--     program_interest is a gibberish token and not a real program.
--     "Yankee Doodle" and yankee-doodle do not match.
--   gibberish-message
--     message or comments is a single gibberish token. Multi-word notes
--     with a readable word do not match.

-- ---------------------------------------------------------------------------
-- PREVIEW (read-only)
-- ---------------------------------------------------------------------------

WITH flagged AS (
  SELECT
    'contact_inquiries' AS source,
    id,
    name,
    email,
    NULL::text AS location,
    message AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN regexp_replace(coalesce(message, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$' THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN message IS NOT NULL AND btrim(message) <> '' AND regexp_replace(coalesce(message, ''), '[[:space:]().+-]', '', 'g') !~ '^[0-9]{6,}$' AND btrim(message) !~ '[[:space:]]' AND (
        (btrim(message) ~ '^[A-Za-z]{4,40}$' AND (
          btrim(message) !~* '[aeiouy]'
          OR lower(btrim(message)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(message)) >= 8
            AND regexp_replace(lower(btrim(message)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        ))
        OR (
          btrim(message) ~ '[0-9]'
          OR char_length(regexp_replace(btrim(message), '[^A-Za-z]', '', 'g')) >= 16
          OR (char_length(regexp_replace(btrim(message), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(message), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        )
      ) THEN 'gibberish-message' END
    ) AS spam_reason
  FROM contact_inquiries

  UNION ALL

  SELECT
    'registration_waitlist' AS source,
    id,
    name,
    email,
    location_interest AS location,
    program_interest AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN (
        regexp_replace(coalesce(location_interest, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$'
        OR regexp_replace(coalesce(program_interest, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$'
      ) THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN location_interest IS NOT NULL AND btrim(location_interest) ~ '^[A-Za-z]{4,40}$' AND (
        btrim(location_interest) !~* '[aeiouy]'
          OR lower(btrim(location_interest)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(location_interest)) >= 8
            AND regexp_replace(lower(btrim(location_interest)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
      ) THEN 'gibberish-location' END,
      CASE WHEN program_interest IS NOT NULL
        AND lower(regexp_replace(btrim(program_interest), '[^a-z0-9]+', '-', 'g')) NOT IN ('macaronis', 'yankee-doodle', 'yankee-doodles', 'tycoons', 'seekers', 'pioneers', 'patriots')
        AND btrim(program_interest) ~ '^[A-Za-z]{4,40}$'
        AND (
          btrim(program_interest) !~* '[aeiouy]'
          OR lower(btrim(program_interest)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(program_interest)) >= 8
            AND regexp_replace(lower(btrim(program_interest)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        )
      THEN 'gibberish-program' END
    ) AS spam_reason
  FROM registration_waitlist

  UNION ALL

  SELECT
    'location_suggestions' AS source,
    id,
    name,
    email,
    location,
    comments AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN regexp_replace(coalesce(comments, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$' THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN location IS NOT NULL AND btrim(location) ~ '^[A-Za-z]{4,40}$' AND (
        btrim(location) !~* '[aeiouy]'
          OR lower(btrim(location)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(location)) >= 8
            AND regexp_replace(lower(btrim(location)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
      ) THEN 'gibberish-location' END,
      CASE WHEN comments IS NOT NULL AND btrim(comments) <> '' AND regexp_replace(coalesce(comments, ''), '[[:space:]().+-]', '', 'g') !~ '^[0-9]{6,}$' AND btrim(comments) !~ '[[:space:]]' AND (
        (btrim(comments) ~ '^[A-Za-z]{4,40}$' AND (
          btrim(comments) !~* '[aeiouy]'
          OR lower(btrim(comments)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(comments)) >= 8
            AND regexp_replace(lower(btrim(comments)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        ))
        OR (
          btrim(comments) ~ '[0-9]'
          OR char_length(regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g')) >= 16
          OR (char_length(regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        )
      ) THEN 'gibberish-message' END
    ) AS spam_reason
  FROM location_suggestions
),
matches AS (
  SELECT * FROM flagged WHERE spam_reason <> ''
)
SELECT
  source,
  count(*) OVER (PARTITION BY source) AS would_flag,
  sum(
    CASE
      WHEN name IN ('Kylee H.', 'Brianne', 'jaimie metz', 'Alyson Valenti')
        OR name ILIKE 'Kylee H%'
      THEN 1
      ELSE 0
    END
  ) OVER () AS real_names_flagged,
  id,
  name,
  email,
  location,
  note,
  created_at,
  spam_reason
FROM matches
ORDER BY source, created_at;

-- real_names_flagged must be 0 on every preview row.
-- would_flag is the per-source count (same value on each row from that source).
-- Kylee H. (Yankee Doodle), Brianne, jaimie metz, and Alyson Valenti must not appear.

-- ---------------------------------------------------------------------------
-- UPDATE (writes). Do not run until real_names_flagged is 0 on the preview.
-- Uncomment this block and run it once, in the same database, after
-- migrations/0002_add_spam_flags.sql. It refuses to write if Kylee H.,
-- Brianne, jaimie metz, or Alyson Valenti were selected.
-- Re-running after an admin clicks Not spam will flag those rows again.
-- ---------------------------------------------------------------------------

/*
BEGIN;

CREATE TEMP TABLE spam_matches AS
WITH flagged AS (
  SELECT
    'contact_inquiries' AS source,
    id,
    name,
    email,
    NULL::text AS location,
    message AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN regexp_replace(coalesce(message, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$' THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN message IS NOT NULL AND btrim(message) <> '' AND regexp_replace(coalesce(message, ''), '[[:space:]().+-]', '', 'g') !~ '^[0-9]{6,}$' AND btrim(message) !~ '[[:space:]]' AND (
        (btrim(message) ~ '^[A-Za-z]{4,40}$' AND (
          btrim(message) !~* '[aeiouy]'
          OR lower(btrim(message)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(message)) >= 8
            AND regexp_replace(lower(btrim(message)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        ))
        OR (
          btrim(message) ~ '[0-9]'
          OR char_length(regexp_replace(btrim(message), '[^A-Za-z]', '', 'g')) >= 16
          OR (char_length(regexp_replace(btrim(message), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(message), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        )
      ) THEN 'gibberish-message' END
    ) AS spam_reason
  FROM contact_inquiries

  UNION ALL

  SELECT
    'registration_waitlist' AS source,
    id,
    name,
    email,
    location_interest AS location,
    program_interest AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN (
        regexp_replace(coalesce(location_interest, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$'
        OR regexp_replace(coalesce(program_interest, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$'
      ) THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN location_interest IS NOT NULL AND btrim(location_interest) ~ '^[A-Za-z]{4,40}$' AND (
        btrim(location_interest) !~* '[aeiouy]'
          OR lower(btrim(location_interest)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(location_interest)) >= 8
            AND regexp_replace(lower(btrim(location_interest)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
      ) THEN 'gibberish-location' END,
      CASE WHEN program_interest IS NOT NULL
        AND lower(regexp_replace(btrim(program_interest), '[^a-z0-9]+', '-', 'g')) NOT IN ('macaronis', 'yankee-doodle', 'yankee-doodles', 'tycoons', 'seekers', 'pioneers', 'patriots')
        AND btrim(program_interest) ~ '^[A-Za-z]{4,40}$'
        AND (
          btrim(program_interest) !~* '[aeiouy]'
          OR lower(btrim(program_interest)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(program_interest)) >= 8
            AND regexp_replace(lower(btrim(program_interest)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        )
      THEN 'gibberish-program' END
    ) AS spam_reason
  FROM registration_waitlist

  UNION ALL

  SELECT
    'location_suggestions' AS source,
    id,
    name,
    email,
    location,
    comments AS note,
    created_at,
    concat_ws(', ',
      CASE WHEN (
        btrim(name) ~ '[0-9]'
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 16)
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(name), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        OR (btrim(name) !~ '[[:space:]]' AND char_length(regexp_replace(btrim(name), '[^A-Za-z]', '', 'g')) >= 8 AND length(regexp_replace(btrim(name), '[^A-Z]', '', 'g')) >= 4 AND length(regexp_replace(btrim(name), '[^a-z]', '', 'g')) >= 4)
      ) THEN 'random-name' END,
      CASE WHEN regexp_replace(coalesce(comments, ''), '[[:space:]().+-]', '', 'g') ~ '^[0-9]{6,}$' THEN 'all-digit-message' END,
      CASE WHEN lower(split_part(btrim(email), '@', 2)) IN ('rootsec.nl') THEN 'blocked-domain' END,
      CASE WHEN (length(split_part(email, '@', 1)) - length(replace(split_part(email, '@', 1), '.', ''))) >= 4 THEN 'dotted-email' END,
      CASE WHEN location IS NOT NULL AND btrim(location) ~ '^[A-Za-z]{4,40}$' AND (
        btrim(location) !~* '[aeiouy]'
          OR lower(btrim(location)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(location)) >= 8
            AND regexp_replace(lower(btrim(location)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
      ) THEN 'gibberish-location' END,
      CASE WHEN comments IS NOT NULL AND btrim(comments) <> '' AND regexp_replace(coalesce(comments, ''), '[[:space:]().+-]', '', 'g') !~ '^[0-9]{6,}$' AND btrim(comments) !~ '[[:space:]]' AND (
        (btrim(comments) ~ '^[A-Za-z]{4,40}$' AND (
          btrim(comments) !~* '[aeiouy]'
          OR lower(btrim(comments)) ~ '^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)'
          OR (
            char_length(btrim(comments)) >= 8
            AND regexp_replace(lower(btrim(comments)), $re$([a-z])\1+$re$, $re$\1$re$, 'g') ~ '[bcdfghjklmnpqrstvwxz]{5,}'
          )
        ))
        OR (
          btrim(comments) ~ '[0-9]'
          OR char_length(regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g')) >= 16
          OR (char_length(regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g')) >= 5 AND regexp_replace(btrim(comments), '[^A-Za-z]', '', 'g') !~* '[aeiouy]')
        )
      ) THEN 'gibberish-message' END
    ) AS spam_reason
  FROM location_suggestions
),
matches AS (
  SELECT * FROM flagged WHERE spam_reason <> ''
)
SELECT source, id, name, spam_reason FROM matches;

DO $$
DECLARE
  protected_hits integer;
BEGIN
  SELECT count(*) INTO protected_hits
  FROM spam_matches
  WHERE name IN ('Kylee H.', 'Brianne', 'jaimie metz', 'Alyson Valenti')
     OR name ILIKE 'Kylee H%';
  IF protected_hits > 0 THEN
    RAISE EXCEPTION 'Refusing to flag % protected real name(s). Roll back and fix the preview.', protected_hits;
  END IF;
END $$;

UPDATE contact_inquiries AS row
SET is_spam = true,
    spam_reason = match.spam_reason
FROM spam_matches AS match
WHERE match.source = 'contact_inquiries'
  AND row.id = match.id
  AND row.is_spam = false;

UPDATE registration_waitlist AS row
SET is_spam = true,
    spam_reason = match.spam_reason
FROM spam_matches AS match
WHERE match.source = 'registration_waitlist'
  AND row.id = match.id
  AND row.is_spam = false;

UPDATE location_suggestions AS row
SET is_spam = true,
    spam_reason = match.spam_reason
FROM spam_matches AS match
WHERE match.source = 'location_suggestions'
  AND row.id = match.id
  AND row.is_spam = false;

COMMIT;
*/
