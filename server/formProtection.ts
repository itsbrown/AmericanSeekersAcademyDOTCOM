import type { Request, Response } from "express";
import {
  DEFAULT_MIN_FILL_MS,
  DEFAULT_RATE_LIMIT,
  DEFAULT_RATE_WINDOW_MINUTES,
  guardFormSubmission,
  parseDomainBlocklist,
  type FormKind,
  type GuardDecision,
} from "@shared/formProtection";

type Bucket = { count: number; resetTime: number };

export class FormRateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private limit = DEFAULT_RATE_LIMIT,
    private windowMs = DEFAULT_RATE_WINDOW_MINUTES * 60 * 1000,
    private now: () => number = Date.now,
  ) {}

  consume(ip: string, email: string): { allowed: boolean; retryAfterSeconds: number } {
    const ipResult = this.hit(`ip:${ip || "unknown"}`);
    const normalizedEmail = email.trim().toLowerCase();
    const emailResult = normalizedEmail ? this.hit(`email:${normalizedEmail}`) : { allowed: true, retryAfterSeconds: 0 };
    if (ipResult.allowed && emailResult.allowed) {
      return { allowed: true, retryAfterSeconds: 0 };
    }
    return {
      allowed: false,
      retryAfterSeconds: Math.max(ipResult.retryAfterSeconds, emailResult.retryAfterSeconds),
    };
  }

  private hit(key: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = this.now();
    const current = this.buckets.get(key);
    if (!current || now >= current.resetTime) {
      this.buckets.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= this.limit) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetTime - now) / 1000)) };
    }
    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

let warnedMissingTurnstile = false;

export function resetTurnstileWarningForTests(): void {
  warnedMissingTurnstile = false;
}

export function turnstileKeysConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

export function logTurnstileConfig(env: NodeJS.ProcessEnv = process.env): void {
  if (turnstileKeysConfigured(env)) return;
  if (warnedMissingTurnstile) return;
  warnedMissingTurnstile = true;
  const missing = [
    env.TURNSTILE_SITE_KEY ? null : "TURNSTILE_SITE_KEY",
    env.TURNSTILE_SECRET_KEY ? null : "TURNSTILE_SECRET_KEY",
  ].filter(Boolean).join(" and ");
  console.warn(
    `[spam] ${missing} is not set; skipping Cloudflare Turnstile verification. Public form posts are still accepted.`,
  );
}

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp: string,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true; skipped?: boolean } | { ok: false; message: string }> {
  if (!turnstileKeysConfigured(env)) {
    logTurnstileConfig(env);
    return { ok: true, skipped: true };
  }

  if (typeof token !== "string" || token.trim() === "") {
    return { ok: false, message: "Please complete the verification and try again." };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET_KEY as string);
    body.set("response", token.trim());
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);
    const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const result = await response.json() as { success?: boolean };
    if (result.success === true) return { ok: true };
    return { ok: false, message: "Please complete the verification and try again." };
  } catch (error) {
    console.error("[spam] Turnstile verification request failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Please complete the verification and try again." };
  }
}

export function requestIp(req: Request): string {
  const ip = (req.ip || req.socket?.remoteAddress || "unknown").toString();
  return ip.replace(/^::ffff:/, "") || "unknown";
}

export function createFormRateLimiter(env: NodeJS.ProcessEnv = process.env): FormRateLimiter {
  const limit = positiveInt(env.FORM_RATE_LIMIT, DEFAULT_RATE_LIMIT);
  const minutes = positiveInt(env.FORM_RATE_WINDOW_MINUTES, DEFAULT_RATE_WINDOW_MINUTES);
  return new FormRateLimiter(limit, minutes * 60 * 1000);
}

function positiveInt(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function rejectIfFormBlocked(
  req: Request,
  res: Response,
  kind: FormKind,
  limiter: FormRateLimiter,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<Extract<GuardDecision, { action: "allow" }> | null> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const ip = requestIp(req);
  const email = typeof body.email === "string" ? body.email : "";
  const limit = limiter.consume(ip, email);
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({
      success: false,
      message: "Too many submissions. Please try again later.",
    });
    return null;
  }

  const decision = guardFormSubmission({
    kind,
    body,
    blockedDomains: parseDomainBlocklist(env.SPAM_DOMAIN_BLOCKLIST),
    minFillMs: positiveInt(env.FORM_MIN_FILL_MS, DEFAULT_MIN_FILL_MS),
  });

  if (decision.action === "silent") {
    res.status(200).json({ success: true });
    return null;
  }
  if (decision.action === "reject") {
    res.status(400).json({ success: false, message: decision.message });
    return null;
  }

  const turnstile = await verifyTurnstileToken(body.turnstileToken, ip, env, fetchImpl);
  if (!turnstile.ok) {
    res.status(400).json({ success: false, message: turnstile.message });
    return null;
  }

  return decision;
}
