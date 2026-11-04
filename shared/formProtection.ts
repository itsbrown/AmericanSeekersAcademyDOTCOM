/**
 * Shared spam rules for the public lead forms.
 *
 * Live posts use these checks before anything is saved.
 * scripts/flag-existing-form-spam.sql mirrors the same predicates for a
 * one-time, read-only preview and a separate UPDATE. Keep the two in sync.
 */

export const HONEYPOT_FIELD = "asa_hp";
export const FORM_STARTED_FIELD = "formStartedAt";
export const DEFAULT_MIN_FILL_MS = 3000;
export const DEFAULT_RATE_LIMIT = 5;
export const DEFAULT_RATE_WINDOW_MINUTES = 60;
export const MAX_FILL_MS = 7 * 24 * 60 * 60 * 1000;

export const CAMPUS_SLUGS = ["brighton", "greece", "victor", "batavia", "angelica"] as const;
export const PROGRAM_SLUGS = ["macaronis", "yankee-doodle", "tycoons", "seekers", "pioneers", "patriots"] as const;

/** Domains seen in the Aug 2026 form spam. Extend with SPAM_DOMAIN_BLOCKLIST. */
export const DEFAULT_BLOCKED_EMAIL_DOMAINS = ["rootsec.nl"] as const;

const RARE_START = /^(dz|yn|mn|tb|db|wq|jl|zv|xr|qx|xz|fq|vb|gb)/;
const NAME_PUNCTUATION = " .'’-";
const PLACE_PUNCTUATION = " ,.'’()-/";

export type FormKind = "contact" | "waitlist" | "location";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  phoneOptOut: boolean;
};

export type WaitlistPayload = {
  name: string;
  email: string;
  phone?: string;
  programInterest?: string;
  locationInterest?: string;
};

export type LocationPayload = {
  name: string;
  email: string;
  location: string;
  comments?: string;
};

export type GuardDecision =
  | { action: "silent" }
  | { action: "reject"; message: string }
  | { action: "allow"; kind: "contact"; data: ContactPayload }
  | { action: "allow"; kind: "waitlist"; data: WaitlistPayload }
  | { action: "allow"; kind: "location"; data: LocationPayload };

export type StoredSpamRow = {
  name: string;
  email: string;
  message?: string | null;
  comments?: string | null;
  location?: string | null;
  locationInterest?: string | null;
  programInterest?: string | null;
};

export function parseDomainBlocklist(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function emailDomain(email: string): string {
  const domain = email.split("@")[1] ?? "";
  return domain.trim().toLowerCase().replace(/\.$/, "");
}

export function isBlockedEmailDomain(email: string, extraDomains: string[] = []): boolean {
  const domain = emailDomain(email);
  if (!domain) return false;
  const blocked = new Set<string>([
    ...DEFAULT_BLOCKED_EMAIL_DOMAINS,
    ...extraDomains.map((item) => item.trim().toLowerCase()).filter(Boolean),
  ]);
  return blocked.has(domain);
}

export function localPartDotCount(email: string): number {
  const local = email.split("@")[0] ?? "";
  return (local.match(/\./g) || []).length;
}

/**
 * Bot mailbox names from the Aug 2026 wave use 4 or more dots
 * (a.higitoz.a.j.752@gmail.com). Three dots, as in j.r.r.tolkien@example.com, stay allowed.
 */
export function isDottedSpamEmail(email: string): boolean {
  return localPartDotCount(email) >= 4;
}

function isCasedLetter(char: string): boolean {
  return char.toLowerCase() !== char.toUpperCase();
}

function isAllowedName(value: string): boolean {
  const chars = Array.from(value);
  if (chars.length === 0 || !isCasedLetter(chars[0])) return false;
  return chars.every((char, index) => isCasedLetter(char) || (index > 0 && NAME_PUNCTUATION.includes(char)));
}

function isAllowedPlace(value: string): boolean {
  const chars = Array.from(value);
  if (chars.length === 0) return false;
  return chars.every((char) => isCasedLetter(char) || /[0-9]/.test(char) || PLACE_PUNCTUATION.includes(char));
}

export function isAllDigitPayload(value: string): boolean {
  const stripped = value.trim().replace(/[\s().+\-]/g, "");
  return /^[0-9]{6,}$/.test(stripped);
}

export function isGibberishToken(raw: string): boolean {
  const word = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length < 4 || word.length > 40) return false;
  // y counts as a vowel so Lynn, Bryn, Clyde, and Lyndonville are names and towns.
  if (!/[aeiouy]/.test(word)) return true;
  if (RARE_START.test(word)) return true;
  // Runs of 4 show up in real words (Churchville, Schwarzkopf, Tschirhart, Strzelecki).
  // Only a run of 5 or more, and only on a longer token, counts as junk.
  if (word.length >= 8) {
    const collapsed = word.replace(/([a-z])\1+/g, "$1");
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(collapsed)) return true;
  }
  return false;
}

/**
 * Junk cities in the location-suggestion spam are a single random token
 * ("Dzotw", "Fltxbzc"). Real entries include a space or comma
 * ("Brockport, NY", "orleans county", "Victor, NY") or a normal place name.
 */
export function isGibberishPlace(value: string): boolean {
  const trimmed = value.trim();
  if (!/^[A-Za-z]{4,40}$/.test(trimmed)) return false;
  return isGibberishToken(trimmed);
}

export function isRandomSpamName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (/[0-9]/.test(trimmed)) return true;
  if (/\s/.test(trimmed)) return false;
  const letters = Array.from(trimmed).filter(isCasedLetter).join("");
  const latin = letters.replace(/[^A-Za-z]/g, "");
  // Cyrillic, Vietnamese, and other non-Latin names are not the latin junk pattern.
  if (latin.length !== letters.length) return letters.length >= 16;
  if (latin.length >= 16) return true;
  if (latin.length >= 5 && !/[aeiouy]/i.test(latin)) return true;
  if (latin.length >= 8) {
    const upper = (latin.match(/[A-Z]/g) || []).length;
    const lower = (latin.match(/[a-z]/g) || []).length;
    if (upper >= 4 && lower >= 4) return true;
  }
  return false;
}

export function isGibberishMessage(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || isAllDigitPayload(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const readable = words.filter((word) => {
    const letters = word.replace(/[^A-Za-z]/g, "");
    return letters.length >= 4 && !isGibberishToken(word);
  });
  if (words.length >= 3 && readable.length >= 1) return false;
  if (readable.length >= 2) return false;
  if (/^[A-Za-z]{4,40}$/.test(trimmed) && isGibberishToken(trimmed)) return true;
  if (!/\s/.test(trimmed) && isRandomSpamName(trimmed)) return true;
  return false;
}

export function normalizeProgram(value: string): string | null {
  const key = value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if ((PROGRAM_SLUGS as readonly string[]).includes(key)) return key;
  if (key === "yankee-doodles") return "yankee-doodle";
  return null;
}

export function normalizeCampus(value: string): string | null {
  const key = value
    .trim()
    .toLowerCase()
    .replace(/\(coming soon\)/g, "")
    .replace(/campus/g, "")
    .replace(/[^a-z]/g, "");
  if ((CAMPUS_SLUGS as readonly string[]).includes(key)) return key;
  return null;
}

export function isHoneypotFilled(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function isTooFast(formStartedAt: unknown, now: number, minFillMs: number): boolean {
  const started = typeof formStartedAt === "number"
    ? formStartedAt
    : typeof formStartedAt === "string" && formStartedAt.trim() !== ""
      ? Number(formStartedAt)
      : NaN;
  if (!Number.isFinite(started)) return true;
  const elapsed = now - started;
  if (elapsed < minFillMs) return true;
  if (elapsed > MAX_FILL_MS) return true;
  return false;
}

function reject(message: string): GuardDecision {
  return { action: "reject", message };
}

function personNameError(name: unknown): string | null {
  if (typeof name !== "string") return "Please enter your name.";
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return "Please enter your name.";
  if (!isAllowedName(trimmed) || isRandomSpamName(trimmed)) {
    return "Please enter your name using letters, spaces, hyphens, or apostrophes.";
  }
  return null;
}

function emailError(email: unknown, blockedDomains: string[]): string | null {
  if (typeof email !== "string") return "Please enter a valid email address.";
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  if (isBlockedEmailDomain(trimmed, blockedDomains) || isDottedSpamEmail(trimmed)) {
    return "Please use a different email address.";
  }
  return null;
}

function phoneError(phone: unknown, required: boolean): string | null {
  if (phone == null || phone === "") return required ? "Please enter a phone number." : null;
  if (typeof phone !== "string") return "Please enter a valid phone number.";
  const trimmed = phone.trim();
  if (!trimmed) return required ? "Please enter a phone number." : null;
  if (trimmed.length > 30 || !/^[0-9+\-().\s]+$/.test(trimmed)) {
    return "Please enter a valid phone number.";
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "Please enter a valid phone number.";
  return null;
}

function noteError(note: unknown, minLength: number): string | null {
  if (typeof note !== "string") return "Please write a note we can read.";
  const trimmed = note.trim();
  if (trimmed.length < minLength) return `Please enter at least ${minLength} characters.`;
  if (trimmed.length > 2000) return "That note is too long.";
  if (isAllDigitPayload(trimmed) || isGibberishMessage(trimmed)) {
    return "Please write a note we can read.";
  }
  return null;
}

function optionalNoteError(note: unknown): string | null {
  if (note == null || note === "") return null;
  if (typeof note !== "string") return "Please write a note we can read.";
  const trimmed = note.trim();
  if (!trimmed) return null;
  if (trimmed.length > 2000) return "That note is too long.";
  if (isAllDigitPayload(trimmed) || isGibberishMessage(trimmed)) {
    return "Please write a note we can read.";
  }
  return null;
}

function suggestedLocationError(location: unknown): string | null {
  if (typeof location !== "string") return "Please enter a location.";
  const trimmed = location.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return "Please enter a location.";
  if (!isAllowedPlace(trimmed) || isAllDigitPayload(trimmed) || isGibberishPlace(trimmed)) {
    return "Please enter a city or area.";
  }
  return null;
}

export function guardFormSubmission(input: {
  kind: FormKind;
  body: Record<string, unknown> | null | undefined;
  now?: number;
  blockedDomains?: string[];
  minFillMs?: number;
}): GuardDecision {
  const body = input.body ?? {};
  const now = input.now ?? Date.now();
  const minFillMs = input.minFillMs ?? DEFAULT_MIN_FILL_MS;
  const blockedDomains = input.blockedDomains ?? [];

  if (isHoneypotFilled(body[HONEYPOT_FIELD]) || isTooFast(body[FORM_STARTED_FIELD], now, minFillMs)) {
    return { action: "silent" };
  }

  const nameMessage = personNameError(body.name);
  if (nameMessage) return reject(nameMessage);
  const emailMessage = emailError(body.email, blockedDomains);
  if (emailMessage) return reject(emailMessage);

  const name = (body.name as string).trim();
  const email = (body.email as string).trim();

  if (input.kind === "contact") {
    const phoneMessage = phoneError(body.phone, true);
    if (phoneMessage) return reject(phoneMessage);
    const messageMessage = noteError(body.message, 10);
    if (messageMessage) return reject(messageMessage);
    if (body.phoneOptOut != null && typeof body.phoneOptOut !== "boolean") {
      return reject("Invalid phone preference.");
    }
    return {
      action: "allow",
      kind: "contact",
      data: {
        name,
        email,
        phone: (body.phone as string).trim(),
        message: (body.message as string).trim(),
        phoneOptOut: body.phoneOptOut === true,
      },
    };
  }

  if (input.kind === "waitlist") {
    const phoneMessage = phoneError(body.phone, false);
    if (phoneMessage) return reject(phoneMessage);
    let programInterest: string | undefined;
    if (typeof body.programInterest === "string" && body.programInterest.trim()) {
      const program = normalizeProgram(body.programInterest);
      if (!program) return reject("Please choose a program.");
      programInterest = program;
    }
    let locationInterest: string | undefined;
    if (typeof body.locationInterest === "string" && body.locationInterest.trim()) {
      const campus = normalizeCampus(body.locationInterest);
      if (!campus) return reject("Please choose a campus.");
      locationInterest = campus;
    }
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    return {
      action: "allow",
      kind: "waitlist",
      data: {
        name,
        email,
        ...(phone ? { phone } : {}),
        ...(programInterest ? { programInterest } : {}),
        ...(locationInterest ? { locationInterest } : {}),
      },
    };
  }

  const locationMessage = suggestedLocationError(body.location);
  if (locationMessage) return reject(locationMessage);
  const commentsMessage = optionalNoteError(body.comments);
  if (commentsMessage) return reject(commentsMessage);
  const comments = typeof body.comments === "string" ? body.comments.trim() : "";
  return {
    action: "allow",
    kind: "location",
    data: {
      name,
      email,
      location: (body.location as string).trim(),
      ...(comments ? { comments } : {}),
    },
  };
}

/**
 * Reasons a stored row would be counted by the one-time spam preview.
 * A row is flagged when this list is non-empty. Ordinary names, Unicode names,
 * and real town names return [].
 */
export function storedRowSpamReasons(row: StoredSpamRow, extraDomains: string[] = []): string[] {
  const reasons: string[] = [];
  if (isRandomSpamName(row.name || "")) reasons.push("random-name");

  const digitFields = [row.message, row.comments, row.locationInterest, row.programInterest];
  if (digitFields.some((value) => typeof value === "string" && isAllDigitPayload(value))) {
    reasons.push("all-digit-message");
  }

  if (isBlockedEmailDomain(row.email || "", extraDomains)) reasons.push("blocked-domain");
  if (isDottedSpamEmail(row.email || "")) reasons.push("dotted-email");

  const places = [row.location, row.locationInterest];
  if (places.some((value) => typeof value === "string" && isGibberishPlace(value))) {
    reasons.push("gibberish-location");
  }

  if (typeof row.programInterest === "string" && row.programInterest.trim()) {
    if (!normalizeProgram(row.programInterest) && isGibberishPlace(row.programInterest)) {
      reasons.push("gibberish-program");
    }
  }

  const notes = [row.message, row.comments];
  if (notes.some((value) => typeof value === "string" && isGibberishMessage(value))) {
    reasons.push("gibberish-message");
  }

  return reasons;
}

export function countSpamRows(rows: StoredSpamRow[], extraDomains: string[] = []): number {
  return rows.filter((row) => storedRowSpamReasons(row, extraDomains).length > 0).length;
}
