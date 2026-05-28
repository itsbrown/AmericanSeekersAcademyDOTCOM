import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import { insertLocationSuggestionSchema, insertNewsletterSchema, insertProgramInfoRequestSchema, insertContactInquirySchema, insertBlogPostSchema, updateBlogPostSchema, insertPageViewSchema, insertAnnouncementSchema, insertRegistrationWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const programPdfUrls: Record<string, string> = {
  "macaronis": "/pdfs/macaronis.pdf",
  "yankee-doodle": "/pdfs/yankee-doodle.pdf",
  "tycoons": "/pdfs/tycoons.pdf",
  "seekers": "/pdfs/seekers.pdf",
  "pioneers": "/pdfs/pioneers.pdf",
  "patriots": "/pdfs/patriots.pdf",
};

async function addHubSpotContact(email: string, name: string, extraProperties?: Record<string, string>) {
  const apiKey = process.env.HUBSPOT_API;
  if (!apiKey) return;

  try {
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            idProperty: "email",
            id: email,
            properties: {
              email,
              firstname: firstName,
              lastname: lastName,
              ...extraProperties,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HubSpot contact upsert failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error adding contact to HubSpot:", error);
  }
}

interface EmailSendResult {
  sendId?: string;
  statusId?: string;
  provider?: string;
  error?: string;
  [key: string]: unknown;
}

/**
 * Low-level SendGrid sender. Throws on missing key or hard failure.
 * Prefer sendEmailSafe() for most call sites.
 */
async function sendTransactionalEmail(to: string, toName: string, subject: string, htmlContent: string): Promise<EmailSendResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  sgMail.setApiKey(apiKey);

  const sendId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await sgMail.send({
    to,
    from: {
      email: "contact@americanseekersacademy.com",
      name: "American Seekers Academy",
    },
    replyTo: "contact@americanseekersacademy.com",
    subject,
    html: htmlContent,
  });

  return { sendId, statusId: "accepted", provider: "sendgrid" };
}

/**
 * Safe email sender with:
 * - Never throws (safe for fire-and-forget and admin test flows)
 * - Consistent structured result
 * - Basic retry (1 retry with short delay) for transient failures
 * - Centralized logging with [email] prefix
 */
async function sendEmailSafe(params: {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  flow?: string; // e.g. "contact", "program", "waitlist"
}): Promise<EmailSendResult & { success: boolean; provider: "sendgrid" }> {
  const { to, toName = "", subject, htmlContent, flow = "unknown" } = params;
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    const msg = "SENDGRID_API_KEY not configured";
    console.error(`[email] ${flow} FAILED: ${msg}`);
    return { success: false, provider: "sendgrid", error: msg };
  }

  const maxAttempts = 2; // 1 initial + 1 retry
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await sendTransactionalEmail(to, toName, subject, htmlContent);
      console.log(
        `[email] ${flow} sent — provider=sendgrid sendId=${result.sendId ?? "unknown"}`
      );
      return {
        success: true,
        provider: "sendgrid",
        sendId: result.sendId,
        statusId: result.statusId,
      };
    } catch (err) {
      lastError = err;
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Only retry on transient-ish errors (network / 5xx type)
      const isTransient =
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("503") ||
        errorMessage.includes("502") ||
        errorMessage.includes("504");

      if (attempt < maxAttempts && isTransient) {
        console.warn(`[email] ${flow} attempt ${attempt} failed (transient). Retrying...`);
        await new Promise((r) => setTimeout(r, 600)); // short backoff
        continue;
      }

      console.error(`[email] ${flow} FAILED after ${attempt} attempt(s):`, errorMessage);
      return {
        success: false,
        provider: "sendgrid",
        error: errorMessage,
      };
    }
  }

  // Should not reach here
  return {
    success: false,
    provider: "sendgrid",
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}

async function sendContactInquiryNotification(inquiry: { name: string; email: string; phone: string; message: string }): Promise<EmailSendResult> {
  const htmlContent = `
    <html>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e3a5f;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e3a5f;">New Contact Inquiry</h1>
          <p>Someone has reached out through the American Seekers Academy website!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e3a5f; margin-top: 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #c4a052;">${inquiry.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This is an automated notification from your American Seekers Academy website.
          </p>
        </div>
      </body>
    </html>
  `;

  // Uses the safe wrapper (never throws, has retry + consistent logging)
  return sendEmailSafe({
    to: "contact@americanseekersacademy.com",
    toName: "American Seekers Academy",
    subject: `New Contact Inquiry from ${inquiry.name}`,
    htmlContent,
    flow: "contact",
  });
}

async function sendLocationSuggestionNotification(suggestion: { name: string; email: string; location: string; comments?: string | null }): Promise<EmailSendResult> {
  const htmlContent = `
    <html>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e3a5f;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e3a5f;">New Location Suggestion Received</h1>
          <p>Someone has suggested a new location for American Seekers Academy!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e3a5f; margin-top: 0;">Submission Details</h2>
            <p><strong>Name:</strong> ${suggestion.name}</p>
            <p><strong>Email:</strong> ${suggestion.email}</p>
            <p><strong>Suggested Location:</strong> ${suggestion.location}</p>
            ${suggestion.comments ? `<p><strong>Additional Comments:</strong> ${suggestion.comments}</p>` : ''}
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This is an automated notification from your American Seekers Academy website.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmailSafe({
    to: "contact@americanseekersacademy.com",
    toName: "American Seekers Academy",
    subject: `New Location Suggestion: ${suggestion.location}`,
    htmlContent,
    flow: "location",
  });
}

async function sendProgramInfoEmail(to: string, name: string, programName: string, programSlug: string, pdfUrl: string): Promise<EmailSendResult> {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://americanseekersacademy.com'
    : process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'http://localhost:5000';

  const htmlContent = `
    <html>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e3a5f;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e3a5f;">Thank you for your interest, ${name}!</h1>
          <p>We're excited that you want to learn more about our <strong>${programName}</strong> program at American Seekers Academy.</p>
          <p>At American Seekers Academy, we cultivate civic virtue, academic excellence, and lifelong friendships through in-person classical education for homeschool families.</p>
          <h2 style="color: #1e3a5f;">About ${programName}</h2>
          <p>Our ${programName} program provides a structured yet flexible curriculum designed specifically for homeschooling families. Students benefit from:</p>
          <ul>
            <li>In-person classical education 3 days a week</li>
            <li>Experienced mentors passionate about education</li>
            <li>A positive, social learning environment</li>
            <li>IHIP-compliant curriculum</li>
          </ul>
          <p><strong>Download your program details:</strong></p>
          <p><a href="${baseUrl}${pdfUrl}" style="background-color: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Download ${programName} PDF</a></p>
          <h2 style="color: #1e3a5f;">Ready to Enroll?</h2>
          <p>We'd love to welcome your family to our community! Contact us to schedule a visit or begin the enrollment process.</p>
          <p><a href="${baseUrl}/#contact" style="background-color: #c4a052; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Contact Us to Enroll</a></p>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Best regards,<br>
            The American Seekers Academy Team<br>
            <em>"Learn Better. Make Friends. Live Well."</em>
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmailSafe({
    to,
    toName: name,
    subject: `${programName} Program Information - American Seekers Academy`,
    htmlContent,
    flow: "program",
  });
}

async function sendWaitlistConfirmationEmail(entry: { name: string; email: string; programInterest?: string }): Promise<EmailSendResult> {
  const programLabel = entry.programInterest
    ? entry.programInterest.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : null;

  const htmlContent = `
    <html>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e3a5f; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 0;">
          <div style="background-color: #1e3a5f; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 4px 0;">American Seekers Academy</h1>
            <p style="color: #c4a052; margin: 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Fall 2026 Registration</p>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #1e3a5f; margin-top: 0;">You're on the waitlist, ${entry.name.split(" ")[0]}!</h2>
            <p>Thank you for your interest in American Seekers Academy. We've saved your spot on the <strong>Fall 2026 Registration Waitlist</strong>.</p>
            <div style="background-color: #f5f0e8; border-left: 4px solid #c4a052; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Registration Opens:</strong> May 27, 2026</p>
              ${programLabel ? `<p style="margin: 0;"><strong>Program Interest:</strong> ${programLabel}</p>` : ""}
            </div>
            <p>We'll reach out to you directly on <strong>May 27th</strong> so you can be among the first to secure your family's spot before classes fill up.</p>
            <p>In the meantime, feel free to explore our programs and curriculum at <a href="https://americanseekersacademy.com" style="color: #c4a052;">americanseekersacademy.com</a>.</p>
            <p style="margin-top: 32px;">We look forward to welcoming your family,</p>
            <p><strong>The American Seekers Academy Team</strong><br>
            <em style="color: #888;">"Learn Better. Make Friends. Live Well."</em></p>
          </div>
          <div style="background-color: #f5f0e8; padding: 20px 40px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">Questions? Reply to this email or contact us at <a href="mailto:contact@americanseekersacademy.com" style="color: #c4a052;">contact@americanseekersacademy.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmailSafe({
    to: entry.email,
    toName: entry.name,
    subject: "You're on the Fall 2026 Waitlist — American Seekers Academy",
    htmlContent,
    flow: "waitlist",
  });
}

function buildAnnouncementEmailHtml(announcement: Announcement, typeLabel: string): string {
  return `
    <html>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e3a5f; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 0;">
          <div style="background-color: #1e3a5f; padding: 28px 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">American Seekers Academy</h1>
            <p style="color: #c4a052; margin: 8px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">New ${typeLabel}</p>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
              ${new Date(announcement.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <h2 style="color: #1e3a5f; margin-top: 0; font-size: 22px;">${announcement.title}</h2>
            <p style="white-space: pre-line; color: #333;">${announcement.content}</p>
            ${announcement.url ? `
              <div style="margin: 28px 0 8px 0;">
                <a href="${announcement.url}" style="background-color: #c4a052; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Learn More →
                </a>
              </div>
            ` : `
              <p style="margin-top: 24px;">
                <a href="https://americanseekersacademy.com" style="color: #c4a052; font-weight: 600;">View on our website →</a>
              </p>
            `}
          </div>
          <div style="background-color: #f5f0e8; padding: 20px 40px; text-align: center; font-size: 13px; color: #666;">
            You're receiving this because you signed up for updates or previously contacted American Seekers Academy.<br>
            <a href="https://americanseekersacademy.com" style="color: #c4a052;">americanseekersacademy.com</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends a single test announcement email (used by admins to preview).
 */
async function sendTestAnnouncementEmail(announcement: Announcement, to: string, toName = "Test Recipient"): Promise<EmailSendResult> {
  const typeLabel = announcement.type === "new-class" ? "New Class" 
                  : announcement.type === "update" ? "Update" 
                  : "Announcement";

  const htmlContent = buildAnnouncementEmailHtml(announcement, typeLabel);
  const subject = `[TEST] New ${typeLabel}: ${announcement.title}`;

  return sendEmailSafe({
    to,
    toName,
    subject,
    htmlContent,
    flow: "announcement-test",
  });
}

/**
 * Sends a notification email about a newly published announcement
 * to all previous contact inquirers + newsletter subscribers (deduplicated by email).
 * This is fire-and-forget safe and should be called without awaiting.
 */
async function sendAnnouncementLiveNotification(announcement: Announcement): Promise<void> {
  try {
    const [contacts, newsletters] = await Promise.all([
      storage.getContactInquiries(),
      storage.getNewsletterSubscriptions(),
    ]);

    // Merge contacts + newsletter subscribers, deduplicated by email.
    // Prefer name from contact inquiry if available.
    const recipients = new Map<string, string>();

    for (const contact of contacts) {
      if (!recipients.has(contact.email)) {
        recipients.set(contact.email, contact.name);
      }
    }

    for (const sub of newsletters) {
      if (!recipients.has(sub.email)) {
        recipients.set(sub.email, ""); // No name available for pure newsletter subs
      }
    }

    if (recipients.size === 0) {
      console.log(`[email] announcement flow skipped — no recipients (contacts + newsletter) to notify (id=${announcement.id})`);
      return;
    }

    const typeLabel = announcement.type === "new-class" ? "New Class" 
                    : announcement.type === "update" ? "Update" 
                    : "Announcement";

    const htmlContent = buildAnnouncementEmailHtml(announcement, typeLabel);
    const subject = `New ${typeLabel}: ${announcement.title}`;

    // Fire off individual emails (non-blocking, each has its own retry via sendEmailSafe)
    for (const [email, name] of recipients.entries()) {
      sendEmailSafe({
        to: email,
        toName: name,
        subject,
        htmlContent,
        flow: "announcement",
      }).catch(err => {
        console.error(`[email] announcement individual send failed for ${email}:`, err);
      });
    }

    console.log(`[email] announcement notifications queued — id=${announcement.id}, recipients=${recipients.size} (contacts + newsletter subscribers)`);
  } catch (err) {
    console.error(`[email] announcement notification flow failed (id=${announcement.id}):`, err);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // External redirects
  app.get("/login", (_req: Request, res: Response) => {
    res.redirect(301, "https://accounts.americanseekersacademy.com/login");
  });

  // Defense-in-depth: discourage search engine indexing of admin surfaces
  app.use((req, res, next) => {
    if (req.path.startsWith("/admin") || req.path.startsWith("/blog/admin")) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
    }
    next();
  });

  // API routes for location suggestions
  app.post("/api/location-suggestions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLocationSuggestionSchema.parse(req.body);
      const suggestion = await storage.createLocationSuggestion(validatedData);
      
      // Send email notification via SendGrid (don't block on this)
      sendLocationSuggestionNotification(validatedData).catch(err => {
        console.error("[email] location-suggestion email FAILED:", {
          email: validatedData.email,
          location: validatedData.location,
          error: err instanceof Error ? err.message : String(err),
        });
      });
      
      res.status(201).json({ success: true, suggestion });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/location-suggestions", async (req: Request, res: Response) => {
    try {
      const suggestions = await storage.getLocationSuggestions();
      res.status(200).json({ success: true, suggestions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve location suggestions" });
    }
  });

  // API routes for newsletter subscriptions
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email is already subscribed
      const isSubscribed = await storage.isEmailSubscribed(validatedData.email);
      
      if (isSubscribed) {
        return res.status(400).json({ 
          success: false, 
          message: "This email is already subscribed to our newsletter" 
        });
      }
      
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.status(201).json({ success: true, subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else if (error instanceof Error && error.message === "Email already subscribed") {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  // API route for program info requests with email
  app.post("/api/program-info-request", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProgramInfoRequestSchema.parse(req.body);
      
      // Save the request first (never block the user on email)
      const request = await storage.createProgramInfoRequest(validatedData);
      
      // Get PDF URL for this program
      const pdfUrl = programPdfUrls[validatedData.programSlug] || "/pdfs/general.pdf";
      
      // Send email via SendGrid (non-blocking — uses sendEmailSafe with retry)
      sendProgramInfoEmail(
        validatedData.email,
        validatedData.name,
        validatedData.programName,
        validatedData.programSlug,
        pdfUrl
      ).then(result => {
        if (!result.success) {
          console.error("[email] program-info email FAILED:", {
            email: validatedData.email,
            program: validatedData.programName,
            error: result.error,
          });
        }
      });

      // Add the parent as a HubSpot contact (fire-and-forget, optional)
      addHubSpotContact(validatedData.email, validatedData.name, {
        last_program_inquired: validatedData.programName,
      }).catch(err => {
        console.error("Failed to add program info requester to HubSpot CRM:", err);
      });
      
      res.status(201).json({ success: true, request });
    } catch (error) {
      console.error("Program info request error:", error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        // Email failures are now handled non-blockingly above, so this is for
        // unexpected errors (validation already passed and record was saved).
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  // API route for contact inquiries (SendGrid notification + optional HubSpot CRM upsert)
  app.post("/api/contact-inquiry", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      
      // Save to database
      const inquiry = await storage.createContactInquiry(validatedData);
      
      // Add contact to HubSpot CRM (don't block)
      addHubSpotContact(validatedData.email, validatedData.name).catch(err => {
        console.error("Failed to add contact to HubSpot:", err);
      });
      
      // Send email notification via SendGrid (don't block)
      sendContactInquiryNotification(validatedData).catch(err => {
        console.error("[email] contact-inquiry email FAILED:", {
          email: validatedData.email,
          error: err instanceof Error ? err.message : String(err),
        });
      });
      
      res.status(201).json({ success: true, inquiry });
    } catch (error) {
      console.error("Contact inquiry error:", error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  // Blog API routes
  app.get("/api/blog", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json({ success: true, posts });
    } catch (error) {
      console.error("Failed to get blog posts:", error);
      res.status(500).json({ success: false, message: "Failed to retrieve blog posts" });
    }
  });

  app.get("/api/blog/all", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json({ success: true, posts });
    } catch (error) {
      console.error("Failed to get all blog posts:", error);
      res.status(500).json({ success: false, message: "Failed to retrieve blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ success: false, message: "Blog post not found" });
        return;
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error("Failed to get blog post:", error);
      res.status(500).json({ success: false, message: "Failed to retrieve blog post" });
    }
  });

  app.post("/api/blog", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json({ success: true, post });
    } catch (error) {
      console.error("Failed to create blog post:", error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      if (!post) {
        res.status(404).json({ success: false, message: "Blog post not found" });
        return;
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error("Failed to update blog post:", error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/:id", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Blog post not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      res.status(500).json({ success: false, message: "Failed to delete blog post" });
    }
  });

  // =============================================================================
  // Lightweight rate limiting for public analytics endpoint
  // Protects against spam while remaining invisible to normal visitors.
  // =============================================================================
  const PAGEVIEW_LIMIT = parseInt(process.env.ANALYTICS_RATE_LIMIT || "40", 10);
  const PAGEVIEW_WINDOW_MS = parseInt(process.env.ANALYTICS_RATE_WINDOW_MINUTES || "5", 10) * 60 * 1000;

  const pageViewRateLimit = new Map<string, { count: number; resetTime: number }>();
  let lastRateLimitLog = 0;

  function isPageViewRateLimited(ip: string): boolean {
    const now = Date.now();
    let entry = pageViewRateLimit.get(ip);

    if (!entry || now > entry.resetTime) {
      pageViewRateLimit.set(ip, { count: 1, resetTime: now + PAGEVIEW_WINDOW_MS });
      return false;
    }

    if (entry.count >= PAGEVIEW_LIMIT) {
      // Throttled logging so we don't spam logs during an attack
      if (now - lastRateLimitLog > 30000) {
        console.warn(`[analytics] Rate limit hit for IP ${ip} (${PAGEVIEW_LIMIT} views / ${PAGEVIEW_WINDOW_MS / 60000}min window)`);
        lastRateLimitLog = now;
      }
      return true;
    }

    entry.count += 1;
    return false;
  }

  // Periodic cleanup of stale rate limit entries (every 10 minutes)
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of pageViewRateLimit) {
      if (now > entry.resetTime) {
        pageViewRateLimit.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // =============================================================================
  // Rate limiting specifically for admin login (brute force protection)
  // =============================================================================
  const LOGIN_LIMIT = parseInt(process.env.ADMIN_LOGIN_RATE_LIMIT || "5", 10);
  const LOGIN_WINDOW_MS = parseInt(process.env.ADMIN_LOGIN_RATE_WINDOW_MINUTES || "15", 10) * 60 * 1000;

  const loginRateLimit = new Map<string, { count: number; resetTime: number }>();
  let lastLoginRateLimitLog = 0;

  function isLoginRateLimited(ip: string): boolean {
    const now = Date.now();
    let entry = loginRateLimit.get(ip);

    if (!entry || now > entry.resetTime) {
      loginRateLimit.set(ip, { count: 1, resetTime: now + LOGIN_WINDOW_MS });
      return false;
    }

    if (entry.count >= LOGIN_LIMIT) {
      if (now - lastLoginRateLimitLog > 30000) {
        console.warn(`[admin] Login rate limit hit for IP ${ip} (${LOGIN_LIMIT} attempts / ${LOGIN_WINDOW_MS / 60000}min)`);
        lastLoginRateLimitLog = now;
      }
      return true;
    }

    entry.count += 1;
    return false;
  }

  // Cleanup for login rate limits
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of loginRateLimit) {
      if (now > entry.resetTime) {
        loginRateLimit.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // Analytics - Track page view (public endpoint)
  // Protected with light per-IP rate limiting to reduce spam/abuse.
  app.post("/api/analytics/pageview", async (req: Request, res: Response) => {
    const ip = (req.ip || req.socket.remoteAddress || "unknown").toString();

    // If rate limited, still return success so the client doesn't retry or surface errors.
    // We simply drop the write to protect the database.
    if (isPageViewRateLimited(ip)) {
      return res.status(200).json({ success: true, rateLimited: true });
    }

    try {
      const validatedData = insertPageViewSchema.parse(req.body);
      await storage.createPageView(validatedData);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  });

  // Admin authentication middleware
  const requireAdmin = async (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    
    const token = authHeader.substring(7);
    const session = await storage.getAdminSession(token);
    
    if (!session) {
      res.status(401).json({ success: false, message: "Invalid or expired session" });
      return;
    }
    
    next();
  };

  // Admin login (with rate limiting to protect against brute force)
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const ip = (req.ip || req.socket.remoteAddress || "unknown").toString();

    // Apply strict rate limiting on login attempts
    if (isLoginRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
      });
    }

    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        res.status(500).json({ success: false, message: "Admin password not configured" });
        return;
      }

      if (password !== adminPassword) {
        res.status(401).json({ success: false, message: "Invalid password" });
        return;
      }

      // Create a session token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createAdminSession(token, expiresAt);

      // Clean up old expired sessions
      await storage.cleanExpiredSessions();

      res.json({ success: true, token, expiresAt: expiresAt.toISOString() });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // Admin logout (requires authentication to prevent session purge attacks)
  app.post("/api/admin/logout", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    
    const token = authHeader.substring(7);
    const session = await storage.getAdminSession(token);
    
    if (!session) {
      res.status(401).json({ success: false, message: "Invalid session" });
      return;
    }
    
    await storage.deleteAdminSession(token);
    res.json({ success: true });
  });

  // Verify admin session
  app.get("/api/admin/verify", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.json({ success: false, authenticated: false });
      return;
    }
    
    const token = authHeader.substring(7);
    const session = await storage.getAdminSession(token);
    
    res.json({ success: true, authenticated: !!session });
  });

  // Admin data endpoints (protected)
  app.get("/api/admin/contacts", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json({ success: true, inquiries });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve contact inquiries" });
    }
  });

  app.get("/api/admin/locations", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const suggestions = await storage.getLocationSuggestions();
      res.json({ success: true, suggestions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve location suggestions" });
    }
  });

  app.get("/api/admin/programs", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const requests = await storage.getProgramInfoRequests();
      res.json({ success: true, requests });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve program info requests" });
    }
  });

  app.get("/api/admin/newsletters", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json({ success: true, subscriptions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve newsletter subscriptions" });
    }
  });

  // Admin email config status (read-only, no email sent)
  app.get("/api/admin/email-status", requireAdmin as any, async (_req: Request, res: Response) => {
    res.json({
      success: true,
      sendgridApiConfigured: !!process.env.SENDGRID_API_KEY,
      hubspotApiConfigured: !!process.env.HUBSPOT_API,
    });
  });

  // Per-flow admin email test endpoints
  // Each runs the SAME logic as the corresponding public form submission route,
  // then persists the HubSpot send result (statusId, sendId) to the DB for audit.

  // Flow: contact — mirrors POST /api/contact-inquiry
  app.post("/api/admin/test-email/contact", requireAdmin as any, async (req: Request, res: Response) => {
    const config = { sendgridApiConfigured: !!process.env.SENDGRID_API_KEY };
    if (!process.env.SENDGRID_API_KEY) {
      res.json({ success: false, config, message: "Missing SENDGRID_API_KEY — see configuration status." });
      return;
    }

    const testInquiry = {
      name: "[TEST] Admin Verification",
      email: "admin-test@americanseekersacademy.com",
      phone: "555-000-0000",
      message: "[ADMIN TEST] End-to-end delivery check triggered from admin dashboard. No action needed.",
      phoneOptOut: false,
    };

    await storage.createContactInquiry(testInquiry);

    const sentTo = "contact@americanseekersacademy.com";
    const sentAt = new Date();

    // sendContactInquiryNotification now uses sendEmailSafe internally (never throws)
    const emailResult = await sendContactInquiryNotification(testInquiry);

    const run = await storage.createEmailTestRun({
      flow: "contact",
      sentTo,
      // Legacy fields (kept for backward compatibility with existing rows)
      hubspotStatusId: emailResult?.statusId ?? null,
      hubspotSendId: emailResult?.sendId ?? null,
      // Current provider fields (preferred)
      provider: "sendgrid",
      providerMessageId: emailResult?.sendId ?? null,
      apiAccepted: emailResult.success,
      errorMessage: emailResult.error ?? null,
      sentAt,
      inboxConfirmedAt: null,
      confirmedBy: null,
    });

    res.json({
      success: emailResult.success,
      config,
      run,
      sentTo,
      message: emailResult.success
        ? `SendGrid accepted the contact notification email. Check contact@americanseekersacademy.com inbox to confirm delivery, then mark it confirmed below.`
        : `SendGrid API call failed: ${emailResult.error}`,
    });
  });

  // Flow: location — mirrors POST /api/location-suggestions
  app.post("/api/admin/test-email/location", requireAdmin as any, async (req: Request, res: Response) => {
    const config = { sendgridApiConfigured: !!process.env.SENDGRID_API_KEY };
    if (!process.env.SENDGRID_API_KEY) {
      res.json({ success: false, config, message: "Missing SENDGRID_API_KEY — see configuration status." });
      return;
    }

    const testSuggestion = {
      name: "[TEST] Admin Verification",
      email: "admin-test@americanseekersacademy.com",
      location: "Test City, Test State (admin delivery check)",
      comments: "[ADMIN TEST] Automated end-to-end delivery check. No action needed.",
    };

    await storage.createLocationSuggestion(testSuggestion);

    const sentTo = "contact@americanseekersacademy.com";
    const sentAt = new Date();

    const emailResult = await sendLocationSuggestionNotification(testSuggestion);

    const run = await storage.createEmailTestRun({
      flow: "location",
      sentTo,
      // Legacy fields (kept for backward compatibility with existing rows)
      hubspotStatusId: emailResult?.statusId ?? null,
      hubspotSendId: emailResult?.sendId ?? null,
      // Current provider fields (preferred)
      provider: "sendgrid",
      providerMessageId: emailResult?.sendId ?? null,
      apiAccepted: emailResult.success,
      errorMessage: emailResult.error ?? null,
      sentAt,
      inboxConfirmedAt: null,
      confirmedBy: null,
    });

    res.json({
      success: emailResult.success,
      config,
      run,
      sentTo,
      message: emailResult.success
        ? `SendGrid accepted the location suggestion email. Check contact@americanseekersacademy.com to confirm delivery, then mark it confirmed below.`
        : `SendGrid API call failed: ${emailResult.error}`,
    });
  });

  // Flow: program — mirrors POST /api/program-info-request
  app.post("/api/admin/test-email/program", requireAdmin as any, async (req: Request, res: Response) => {
    const { recipientEmail = "contact@americanseekersacademy.com" } = req.body as { recipientEmail?: string };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      res.status(400).json({ success: false, message: `Invalid email address: "${recipientEmail}"` });
      return;
    }

    const config = { sendgridApiConfigured: !!process.env.SENDGRID_API_KEY };
    if (!process.env.SENDGRID_API_KEY) {
      res.json({ success: false, config, message: "Missing SENDGRID_API_KEY — see configuration status." });
      return;
    }

    const testRequest = {
      name: "[TEST] Admin Verification",
      email: recipientEmail,
      phone: "555-000-0000",
      programSlug: "seekers",
      programName: "Seekers (Grades 3–5)",
    };

    await storage.createProgramInfoRequest(testRequest);

    const sentAt = new Date();

    const emailResult = await sendProgramInfoEmail(
      recipientEmail,
      testRequest.name,
      testRequest.programName,
      testRequest.programSlug,
      programPdfUrls[testRequest.programSlug] ?? "/pdfs/general.pdf"
    );

    const run = await storage.createEmailTestRun({
      flow: "program",
      sentTo: recipientEmail,
      // Legacy fields (kept for backward compatibility with existing rows)
      hubspotStatusId: emailResult?.statusId ?? null,
      hubspotSendId: emailResult?.sendId ?? null,
      // Current provider fields (preferred)
      provider: "sendgrid",
      providerMessageId: emailResult?.sendId ?? null,
      apiAccepted: emailResult.success,
      errorMessage: emailResult.error ?? null,
      sentAt,
      inboxConfirmedAt: null,
      confirmedBy: null,
    });

    res.json({
      success: emailResult.success,
      config,
      run,
      sentTo: recipientEmail,
      message: emailResult.success
        ? `SendGrid accepted the program welcome email. Check ${recipientEmail} inbox to confirm delivery, then mark it confirmed below.`
        : `SendGrid API call failed: ${emailResult.error}`,
    });
  });

  // Get all email test runs (server-side audit log)
  app.get("/api/admin/email-test-runs", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const runs = await storage.getEmailTestRuns();
      res.json({ success: true, runs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve email test runs" });
    }
  });

  // Mark a test run inbox-confirmed
  app.post("/api/admin/email-test-runs/:id/confirm", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { confirmedBy = "admin" } = req.body as { confirmedBy?: string };
      const run = await storage.confirmEmailTestRun(id, confirmedBy);
      if (!run) {
        res.status(404).json({ success: false, message: "Test run not found" });
        return;
      }
      res.json({ success: true, run });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to confirm test run" });
    }
  });

  app.get("/api/admin/analytics", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const [pageStats, referrerStats, recentViews] = await Promise.all([
        storage.getPageViewStats(),
        storage.getReferrerStats(),
        storage.getRecentPageViews(50)
      ]);
      res.json({ success: true, pageStats, referrerStats, recentViews });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve analytics" });
    }
  });

  app.get("/api/admin/stats", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const [contacts, locations, programs, newsletters, pageViews] = await Promise.all([
        storage.getContactInquiries(),
        storage.getLocationSuggestions(),
        storage.getProgramInfoRequests(),
        storage.getNewsletterSubscriptions(),
        storage.getPageViews()
      ]);
      
      res.json({
        success: true,
        stats: {
          totalContacts: contacts.length,
          totalLocations: locations.length,
          totalPrograms: programs.length,
          totalNewsletters: newsletters.length,
          totalPageViews: pageViews.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve stats" });
    }
  });

  // Public announcements endpoint
  app.get("/api/announcements", async (_req: Request, res: Response) => {
    try {
      const announcementList = await storage.getPublishedAnnouncements();
      res.json({ success: true, announcements: announcementList });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve announcements" });
    }
  });

  // Admin announcements endpoints
  app.get("/api/admin/announcements", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const announcementList = await storage.getAllAnnouncements();
      res.json({ success: true, announcements: announcementList });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve announcements" });
    }
  });

  app.post("/api/admin/announcements", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);

      // If created already published, send notifications (if not already sent)
      if (announcement.published && !announcement.notificationSentAt) {
        sendAnnouncementLiveNotification(announcement).then(async () => {
          try {
            await storage.updateAnnouncement(announcement.id, { notificationSentAt: new Date() } as any);
          } catch (e) {
            console.error("[announcement] Failed to mark notificationSentAt after create", e);
          }
        }).catch(err => {
          console.error(`[email] announcement notification failed after create (id=${announcement.id}):`, err);
        });
      }

      res.status(201).json({ success: true, announcement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "Failed to create announcement" });
      }
    }
  });

  app.patch("/api/admin/announcements/:id", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // Fetch previous state so we can detect publish transitions
      const previous = await storage.getAnnouncement(id);

      const validatedData = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, validatedData);

      if (!announcement) {
        res.status(404).json({ success: false, message: "Announcement not found" });
        return;
      }

      // Trigger email notifications when an announcement goes live (published: false → true)
      // and we haven't already sent notifications for it.
      const justPublished = announcement.published && (!previous || !previous.published);
      const notYetNotified = !announcement.notificationSentAt;

      if (justPublished && notYetNotified) {
        // Fire-and-forget — do not block the admin response
        sendAnnouncementLiveNotification(announcement).then(async () => {
          // Best-effort: mark that we have sent the notification
          try {
            await storage.updateAnnouncement(id, { notificationSentAt: new Date() } as any);
          } catch (e) {
            console.error("[announcement] Failed to mark notificationSentAt", e);
          }
        }).catch(err => {
          console.error(`[email] announcement notification failed (id=${id}):`, err);
        });
      }

      res.json({ success: true, announcement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "Failed to update announcement" });
      }
    }
  });

  app.delete("/api/admin/announcements/:id", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAnnouncement(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Announcement not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete announcement" });
    }
  });

  // Send a test email of an announcement (useful for admins to preview before publishing)
  app.post("/api/admin/announcements/:id/test-email", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { testEmail } = req.body as { testEmail?: string };

      const announcement = await storage.getAnnouncement(id);
      if (!announcement) {
        res.status(404).json({ success: false, message: "Announcement not found" });
        return;
      }

      const recipient = testEmail || "contact@americanseekersacademy.com";

      const result = await sendTestAnnouncementEmail(announcement, recipient);

      if (result.success) {
        res.json({ success: true, message: `Test email sent to ${recipient}` });
      } else {
        res.status(500).json({ success: false, message: "Failed to send test email", error: result.error });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send test email" });
    }
  });

  // Registration waitlist routes
  app.post("/api/registration-waitlist", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRegistrationWaitlistSchema.parse(req.body);
      const entry = await storage.createRegistrationWaitlistEntry(validatedData);

      // Send confirmation email (non-blocking, now uses safe helper with retry)
      sendWaitlistConfirmationEmail(validatedData).then((result) => {
        if (result.success) {
          console.log(`[email] waitlist confirmation sent to ${validatedData.email}`);
        } else {
          console.error(`[email] waitlist email FAILED to ${validatedData.email}: ${result.error}`);
        }
      });

      res.status(201).json({ success: true, entry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/admin/registration-waitlist", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const entries = await storage.getRegistrationWaitlistEntries();
      res.json({ success: true, entries });
    } catch {
      res.status(500).json({ success: false, message: "Failed to retrieve waitlist" });
    }
  });

  app.get("/api/admin/contacts/export.csv", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const items = await storage.getContactInquiries();
      const header = "ID,Name,Email,Phone,No Phone Contact,Message,Date\n";
      const rows = items.map(e => [
        e.id,
        `"${(e.name || "").replace(/"/g, '""')}"`,
        `"${(e.email || "").replace(/"/g, '""')}"`,
        `"${(e.phone || "").replace(/"/g, '""')}"`,
        e.phoneOptOut ? "Yes" : "No",
        `"${(e.message || "").replace(/"/g, '""')}"`,
        `"${(e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt)).toLocaleString()}"`,
      ].join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"contacts.csv\"");
      res.send(header + rows);
    } catch { res.status(500).json({ success: false, message: "Failed to export contacts" }); }
  });

  app.get("/api/admin/locations/export.csv", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const items = await storage.getLocationSuggestions();
      const header = "ID,Name,Email,Suggested Location,Comments,Date\n";
      const rows = items.map(e => [
        e.id,
        `"${(e.name || "").replace(/"/g, '""')}"`,
        `"${(e.email || "").replace(/"/g, '""')}"`,
        `"${(e.location || "").replace(/"/g, '""')}"`,
        `"${(e.comments || "").replace(/"/g, '""')}"`,
        `"${(e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt)).toLocaleString()}"`,
      ].join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"location-suggestions.csv\"");
      res.send(header + rows);
    } catch { res.status(500).json({ success: false, message: "Failed to export locations" }); }
  });

  app.get("/api/admin/programs/export.csv", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const items = await storage.getProgramInfoRequests();
      const header = "ID,Name,Email,Phone,Program,Date\n";
      const rows = items.map(e => [
        e.id,
        `"${(e.name || "").replace(/"/g, '""')}"`,
        `"${(e.email || "").replace(/"/g, '""')}"`,
        `"${(e.phone || "").replace(/"/g, '""')}"`,
        `"${(e.programName || "").replace(/"/g, '""')}"`,
        `"${(e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt)).toLocaleString()}"`,
      ].join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"program-requests.csv\"");
      res.send(header + rows);
    } catch { res.status(500).json({ success: false, message: "Failed to export program requests" }); }
  });

  app.get("/api/admin/newsletters/export.csv", requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const items = await storage.getNewsletterSubscriptions();
      const header = "ID,Email,Date\n";
      const rows = items.map(e => [
        e.id,
        `"${(e.email || "").replace(/"/g, '""')}"`,
        `"${(e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt)).toLocaleString()}"`,
      ].join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"newsletters.csv\"");
      res.send(header + rows);
    } catch { res.status(500).json({ success: false, message: "Failed to export newsletters" }); }
  });

  app.get("/api/admin/registration-waitlist/export.csv", requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const entries = await storage.getRegistrationWaitlistEntries();
      const header = "ID,Name,Email,Phone,Program Interest,Signed Up At\n";
      const rows = entries.map(e =>
        [
          e.id,
          `"${(e.name || "").replace(/"/g, '""')}"`,
          `"${(e.email || "").replace(/"/g, '""')}"`,
          `"${(e.phone || "").replace(/"/g, '""')}"`,
          `"${(e.programInterest || "").replace(/"/g, '""')}"`,
          `"${(e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt)).toLocaleString()}"`,
        ].join(",")
      ).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"registration-waitlist.csv\"");
      res.send(header + rows);
    } catch {
      res.status(500).json({ success: false, message: "Failed to export waitlist" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
