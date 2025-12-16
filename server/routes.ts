import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import crypto from "crypto";
import { storage } from "./storage";
import { insertLocationSuggestionSchema, insertNewsletterSchema, insertProgramInfoRequestSchema, insertContactInquirySchema, insertBlogPostSchema, updateBlogPostSchema, insertPageViewSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const programPdfUrls: Record<string, string> = {
  "macaronis": "/pdfs/macaronis.pdf",
  "yankee-doodle": "/pdfs/yankee-doodle.pdf",
  "tycoons": "/pdfs/tycoons.pdf",
  "seekers": "/pdfs/seekers.pdf",
  "pioneers": "/pdfs/pioneers.pdf",
  "patriots": "/pdfs/patriots.pdf",
};

const BREVO_WEBSITE_CONTACTS_LIST_ID = 2; // Will be created/updated on first use

async function getOrCreateBrevoList(): Promise<number> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return BREVO_WEBSITE_CONTACTS_LIST_ID;

  try {
    // Try to get existing lists to find "Website Contacts"
    const listsResponse = await fetch("https://api.brevo.com/v3/contacts/lists?limit=50", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
      },
    });

    if (listsResponse.ok) {
      const listsData = await listsResponse.json();
      const existingList = listsData.lists?.find((list: { name: string; id: number }) => 
        list.name === "Website Contacts"
      );
      if (existingList) {
        return existingList.id;
      }
    }

    // Create the list if it doesn't exist
    const createResponse = await fetch("https://api.brevo.com/v3/contacts/lists", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Website Contacts",
        folderId: 1
      }),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      return createData.id;
    }
  } catch (error) {
    console.error("Error getting/creating Brevo list:", error);
  }

  return BREVO_WEBSITE_CONTACTS_LIST_ID;
}

async function addContactToBrevoList(email: string, name: string, listId: number) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  try {
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
        },
        listIds: [listId],
        updateEnabled: true
      }),
    });
  } catch (error) {
    console.error("Error adding contact to Brevo list:", error);
  }
}

async function sendContactInquiryNotification(inquiry: { name: string; email: string; phone: string; message: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log("BREVO_API_KEY not configured - skipping contact inquiry notification");
    return;
  }

  const emailContent = `
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

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "American Seekers Academy", email: "contact@americanseekersacademy.com" },
      to: [{ email: "contact@americanseekersacademy.com", name: "American Seekers Academy" }],
      subject: `New Contact Inquiry from ${inquiry.name}`,
      htmlContent: emailContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send contact inquiry notification: ${errorText}`);
  }
}

async function sendLocationSuggestionNotification(suggestion: { name: string; email: string; location: string; comments?: string | null }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log("BREVO_API_KEY not configured - skipping location suggestion notification");
    return;
  }

  const emailContent = `
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

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "American Seekers Academy", email: "contact@americanseekersacademy.com" },
      to: [{ email: "contact@americanseekersacademy.com", name: "American Seekers Academy" }],
      subject: `New Location Suggestion: ${suggestion.location}`,
      htmlContent: emailContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send location suggestion notification: ${errorText}`);
  }
}

async function sendBrevoEmail(to: string, name: string, programName: string, programSlug: string, pdfUrl: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY not configured");
  }

  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : 'http://localhost:5000';

  const emailContent = `
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

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "American Seekers Academy", email: "contact@americanseekersacademy.com" },
      to: [{ email: to, name: name }],
      subject: `${programName} Program Information - American Seekers Academy`,
      htmlContent: emailContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error: ${errorText}`);
  }

  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for location suggestions
  app.post("/api/location-suggestions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLocationSuggestionSchema.parse(req.body);
      const suggestion = await storage.createLocationSuggestion(validatedData);
      
      // Send email notification (don't block on this)
      sendLocationSuggestionNotification(validatedData).catch(err => {
        console.error("Failed to send location suggestion notification:", err);
      });
      
      res.status(201).json({ success: true, suggestion });
    } catch (error) {
      if (error instanceof Error) {
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
      if (error instanceof Error) {
        if (error.message === "Email already subscribed") {
          res.status(400).json({ success: false, message: error.message });
        } else {
          const validationError = fromZodError(error);
          res.status(400).json({ success: false, message: validationError.message });
        }
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  // API route for program info requests with Brevo email
  app.post("/api/program-info-request", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProgramInfoRequestSchema.parse(req.body);
      
      // Save the request
      const request = await storage.createProgramInfoRequest(validatedData);
      
      // Get PDF URL for this program
      const pdfUrl = programPdfUrls[validatedData.programSlug] || "/pdfs/general.pdf";
      
      // Send email via Brevo
      await sendBrevoEmail(
        validatedData.email,
        validatedData.name,
        validatedData.programName,
        validatedData.programSlug,
        pdfUrl
      );
      
      res.status(201).json({ success: true, request });
    } catch (error) {
      console.error("Program info request error:", error);
      if (error instanceof Error) {
        if (error.message.includes("Brevo")) {
          res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
        } else {
          const validationError = fromZodError(error);
          res.status(400).json({ success: false, message: validationError.message });
        }
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  // API route for contact inquiries with Brevo list and email notification
  app.post("/api/contact-inquiry", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      
      // Save to database
      const inquiry = await storage.createContactInquiry(validatedData);
      
      // Get or create the "Website Contacts" list and add contact (don't block)
      getOrCreateBrevoList().then(listId => {
        addContactToBrevoList(validatedData.email, validatedData.name, listId);
      }).catch(err => {
        console.error("Failed to add contact to Brevo list:", err);
      });
      
      // Send email notification (don't block)
      sendContactInquiryNotification(validatedData).catch(err => {
        console.error("Failed to send contact inquiry notification:", err);
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

  app.get("/api/blog/all", async (_req: Request, res: Response) => {
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

  app.post("/api/blog", async (req: Request, res: Response) => {
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

  app.put("/api/blog/:id", async (req: Request, res: Response) => {
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

  app.delete("/api/blog/:id", async (req: Request, res: Response) => {
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

  // Analytics - Track page view (public endpoint)
  app.post("/api/analytics/pageview", async (req: Request, res: Response) => {
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

  // Admin login
  app.post("/api/admin/login", async (req: Request, res: Response) => {
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

  // Admin logout
  app.post("/api/admin/logout", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      await storage.deleteAdminSession(token);
    }
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

  const httpServer = createServer(app);

  return httpServer;
}
