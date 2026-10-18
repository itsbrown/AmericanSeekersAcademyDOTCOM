import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FormRateLimiter, resetTurnstileWarningForTests, verifyTurnstileToken } from "./formProtection.ts";
import {
  countSpamRows,
  guardFormSubmission,
  isGibberishPlace,
  storedRowSpamReasons,
  type StoredSpamRow,
} from "../shared/formProtection.ts";

const NOW = Date.parse("2026-10-18T12:00:00Z");

function readyBody(extra: Record<string, unknown> = {}) {
  return {
    formStartedAt: NOW - 5000,
    asa_hp: "",
    ...extra,
  };
}

const realRows: StoredSpamRow[] = [
  {
    name: "Kylee H.",
    email: "kylee.h@example.com",
    programInterest: "Yankee Doodle",
    locationInterest: "greece",
  },
  {
    name: "Brianne",
    email: "briannelynk@yahoo.com",
    location: "Brockport, NY",
    comments: "",
  },
  {
    name: "jaimie metz",
    email: "Jmetz4711@gmail.com",
    location: "orleans county",
    comments: "brockport, holley, kent, kendall",
  },
  {
    name: "Alyson Valenti",
    email: "acragle1@gmail.com",
    location: "Victor, NY",
    comments: "We are very interested in your program for our girls and would love to learn more.",
  },
];

const spamRows: StoredSpamRow[] = [
  {
    name: "OWIJkOAtgUrflGAqJTnvGxl",
    email: "a.higitoz.a.j.752@gmail.com",
    location: "Dzotw",
    comments: "6654270955",
  },
  {
    name: "syzjxlxrNqblLxHWXTIH",
    email: "shane.glb.s.on.42@gmail.com",
    location: "Fltxbzc",
    comments: "4129780010",
  },
  {
    name: "DSjnaGMarbxqeBnSJKwksmlW",
    email: "admin@rootsec.nl",
    location: "Ipocgntfl",
    comments: "4850666007",
  },
  {
    name: "vCpHXmOvrnrqGBae",
    email: "jswerdon@comcast.net",
    location: "Mngrp",
    comments: "5441462939",
  },
  {
    name: "KMLIzIXosMXbTAMXQRsArjMc",
    email: "wazo@aol.com",
    location: "Pegswlgdv",
    comments: "96036244433",
  },
];

const junkCities = [
  "Dzotw",
  "Fltxbzc",
  "Ynsupe",
  "Ipocgntfl",
  "Mngrp",
  "Zviugqh",
  "Jlhvbelkh",
  "Weqrxl",
  "Dbrlgk",
  "Tbzkzy",
  "Fulorz",
  "Pegswlgdv",
];

const realPlaces = [
  "Brockport, NY",
  "orleans county",
  "Victor, NY",
  "Brighton",
  "Greece",
  "Victor",
  "Kendall",
  "Brockport",
  "Holley",
  "Pittsford",
  "Rochester",
  "Batavia",
  "Angelica",
  "Spencerport",
  "Hilton",
  "Irondequoit",
  "Orleans County",
];

test("preview count ignores real families and counts junk rows", () => {
  for (const row of realRows) {
    assert.deepEqual(storedRowSpamReasons(row), [], row.name);
  }
  assert.equal(countSpamRows(realRows), 0);
  assert.equal(countSpamRows(spamRows), spamRows.length);
  assert.equal(countSpamRows([...realRows, ...spamRows]), spamRows.length);

  const dotted = storedRowSpamReasons(spamRows[0]);
  assert.ok(dotted.includes("random-name"));
  assert.ok(dotted.includes("dotted-email"));
  assert.ok(dotted.includes("all-digit-message"));
  assert.ok(dotted.includes("gibberish-location"));

  const blocked = storedRowSpamReasons(spamRows[2]);
  assert.ok(blocked.includes("blocked-domain"));
  assert.ok(!blocked.includes("dotted-email"));
});

test("place names from real suggestions are kept and junk cities are flagged", () => {
  for (const place of realPlaces) {
    assert.equal(isGibberishPlace(place), false, place);
  }
  for (const place of junkCities) {
    assert.equal(isGibberishPlace(place), true, place);
  }
});

test("honeypot and fast fills are silent successes", () => {
  const base = {
    name: "Brianne",
    email: "briannelynk@yahoo.com",
    location: "Brockport, NY",
  };
  const honeypot = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: readyBody({ ...base, asa_hp: "https://spam.example" }),
  });
  assert.equal(honeypot.action, "silent");

  const tooFast = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: { ...base, formStartedAt: NOW - 500, asa_hp: "" },
  });
  assert.equal(tooFast.action, "silent");

  const missingTimer = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: { ...base, asa_hp: "" },
  });
  assert.equal(missingTimer.action, "silent");
});

test("real location suggestions and Kylee's waitlist entry are accepted", () => {
  const brianne = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "briannelynk@yahoo.com",
      location: "Brockport, NY",
      comments: "",
    }),
  });
  assert.equal(brianne.action, "allow");
  if (brianne.action === "allow" && brianne.kind === "location") {
    assert.equal(brianne.data.location, "Brockport, NY");
    assert.equal(brianne.data.comments, undefined);
  }

  const jaimie = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: readyBody({
      name: "jaimie metz",
      email: "Jmetz4711@gmail.com",
      location: "orleans county",
      comments: "brockport, holley, kent, kendall",
    }),
  });
  assert.equal(jaimie.action, "allow");

  const alyson = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: readyBody({
      name: "Alyson Valenti",
      email: "acragle1@gmail.com",
      location: "Victor, NY",
      comments: "We are very interested in your program for our girls and would love to learn more.",
    }),
  });
  assert.equal(alyson.action, "allow");

  const kylee = guardFormSubmission({
    kind: "waitlist",
    now: NOW,
    body: readyBody({
      name: "Kylee H.",
      email: "kylee.h@example.com",
      phone: "(585) 555-0100",
      programInterest: "Yankee Doodle",
      locationInterest: "Greece",
    }),
  });
  assert.equal(kylee.action, "allow");
  if (kylee.action === "allow" && kylee.kind === "waitlist") {
    assert.equal(kylee.data.programInterest, "yankee-doodle");
    assert.equal(kylee.data.locationInterest, "greece");
  }
});

test("server validation rejects the bot patterns", () => {
  const randomName = guardFormSubmission({
    kind: "contact",
    now: NOW,
    body: readyBody({
      name: "OWIJkOAtgUrflGAqJTnvGxl",
      email: "parent@example.com",
      phone: "5855550100",
      message: "We would like to know more about the Greece campus.",
    }),
  });
  assert.equal(randomName.action, "reject");

  const digits = guardFormSubmission({
    kind: "contact",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "briannelynk@yahoo.com",
      phone: "5855550100",
      message: "6654270955",
    }),
  });
  assert.equal(digits.action, "reject");

  const blocked = guardFormSubmission({
    kind: "contact",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "admin@rootsec.nl",
      phone: "5855550100",
      message: "We would like to know more about the Greece campus.",
    }),
  });
  assert.equal(blocked.action, "reject");

  const dotted = guardFormSubmission({
    kind: "waitlist",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "a.higitoz.a.j.752@gmail.com",
      locationInterest: "brighton",
    }),
  });
  assert.equal(dotted.action, "reject");

  const badCampus = guardFormSubmission({
    kind: "waitlist",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "briannelynk@yahoo.com",
      locationInterest: "Dzotw",
    }),
  });
  assert.equal(badCampus.action, "reject");

  const junkCity = guardFormSubmission({
    kind: "location",
    now: NOW,
    body: readyBody({
      name: "Brianne",
      email: "briannelynk@yahoo.com",
      location: "Fltxbzc",
      comments: "Looking for a campus nearby.",
    }),
  });
  assert.equal(junkCity.action, "reject");

  const extraDomain = guardFormSubmission({
    kind: "contact",
    now: NOW,
    blockedDomains: ["mailinator.com"],
    body: readyBody({
      name: "Brianne",
      email: "person@mailinator.com",
      phone: "5855550100",
      message: "We would like to know more about the Greece campus.",
    }),
  });
  assert.equal(extraDomain.action, "reject");
});

test("rate limiter allows 5 posts per hour for an IP and for an email", () => {
  let clock = 0;
  const limiter = new FormRateLimiter(5, 60 * 60 * 1000, () => clock);
  for (let i = 0; i < 5; i++) {
    assert.equal(limiter.consume("1.2.3.4", "parent@example.com").allowed, true);
  }
  const blocked = limiter.consume("1.2.3.4", "parent@example.com");
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  assert.equal(limiter.consume("1.2.3.4", "other@example.com").allowed, false);
  assert.equal(limiter.consume("9.9.9.9", "parent@example.com").allowed, false);
  assert.equal(limiter.consume("9.9.9.9", "fresh@example.com").allowed, true);

  clock = 60 * 60 * 1000;
  assert.equal(limiter.consume("1.2.3.4", "parent@example.com").allowed, true);
});

test("Turnstile is skipped with a warning when keys are unset and checked when they are set", async () => {
  resetTurnstileWarningForTests();
  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (message?: unknown) => {
    warnings.push(String(message));
  };
  try {
    const skipped = await verifyTurnstileToken("anything", "1.1.1.1", {});
    assert.deepEqual(skipped, { ok: true, skipped: true });
    assert.equal(warnings.length, 1);
    const skippedAgain = await verifyTurnstileToken(undefined, "1.1.1.1", {});
    assert.deepEqual(skippedAgain, { ok: true, skipped: true });
    assert.equal(warnings.length, 1);
  } finally {
    console.warn = originalWarn;
  }

  const calls: string[] = [];
  const ok = await verifyTurnstileToken("token-ok", "203.0.113.5", {
    TURNSTILE_SITE_KEY: "site",
    TURNSTILE_SECRET_KEY: "secret",
  }, (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push(String(url));
    assert.match(String(init?.body), /secret=secret/);
    assert.match(String(init?.body), /response=token-ok/);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }) as typeof fetch);
  assert.deepEqual(ok, { ok: true });
  assert.equal(calls[0], "https://challenges.cloudflare.com/turnstile/v0/siteverify");

  const missing = await verifyTurnstileToken("", "203.0.113.5", {
    TURNSTILE_SITE_KEY: "site",
    TURNSTILE_SECRET_KEY: "secret",
  });
  assert.equal(missing.ok, false);

  const failed = await verifyTurnstileToken("bad", "203.0.113.5", {
    TURNSTILE_SITE_KEY: "site",
    TURNSTILE_SECRET_KEY: "secret",
  }, (async () => new Response(JSON.stringify({ success: false }), { status: 200 })) as typeof fetch);
  assert.equal(failed.ok, false);
});

test("migration is additive and the preview script does not delete rows", () => {
  const migration = readFileSync(new URL("../migrations/0002_add_spam_flags.sql", import.meta.url), "utf8");
  const preview = readFileSync(new URL("../scripts/flag-existing-form-spam.sql", import.meta.url), "utf8");

  for (const table of ["contact_inquiries", "registration_waitlist", "location_suggestions"]) {
    assert.match(migration, new RegExp(`ALTER TABLE ${table}`));
  }
  assert.match(migration, /ADD COLUMN IF NOT EXISTS is_spam boolean NOT NULL DEFAULT false/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS spam_reason text/);
  assert.doesNotMatch(migration, /\b(DROP|DELETE|TRUNCATE|UPDATE)\b/i);

  assert.match(preview, /SELECT/);
  assert.match(preview, /random-name/);
  assert.match(preview, /all-digit-message/);
  assert.match(preview, /blocked-domain/);
  assert.match(preview, /dotted-email/);
  assert.match(preview, /gibberish-location/);
  assert.match(preview, /rootsec\.nl/);
  assert.match(preview, /Kylee H\./);
  assert.match(preview, /Brianne/);
  assert.match(preview, /jaimie metz/);
  assert.match(preview, /Alyson Valenti/);
  assert.match(preview, /Yankee Doodle/);
  assert.match(preview, /UPDATE contact_inquiries/);
  assert.match(preview, /UPDATE registration_waitlist/);
  assert.match(preview, /UPDATE location_suggestions/);
  assert.doesNotMatch(preview, /\b(DROP|DELETE FROM|TRUNCATE)\b/i);
});
