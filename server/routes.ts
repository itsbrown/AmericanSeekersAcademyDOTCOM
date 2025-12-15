import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSuggestionSchema, insertNewsletterSchema, insertProgramInfoRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const programPdfUrls: Record<string, string> = {
  "macaronis": "/pdfs/macaronis.pdf",
  "yankee-doodle": "/pdfs/yankee-doodle.pdf",
  "tycoons": "/pdfs/tycoons.pdf",
  "seekers": "/pdfs/seekers.pdf",
  "pioneers": "/pdfs/pioneers.pdf",
  "patriots": "/pdfs/patriots.pdf",
};

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
      sender: { name: "American Seekers Academy", email: "info@americanseekersacademy.com" },
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

  const httpServer = createServer(app);

  return httpServer;
}
